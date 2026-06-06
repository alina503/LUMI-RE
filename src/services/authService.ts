import { STORAGE_KEYS } from '../constants/config';

const AUTH_KEY = STORAGE_KEYS.session;
const USERS_KEY = STORAGE_KEYS.users;

export interface UserSession {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface StoredUser extends UserSession {
  password: string;
  salt: string;
}

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota */ }
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateSalt(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getUsers(): StoredUser[] {
  return storageGet<StoredUser[]>(USERS_KEY, []);
}

function saveUsers(users: StoredUser[]): void {
  storageSet(USERS_KEY, users);
}

export const AuthService = {
  async register(firstName: string, lastName: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'exists' };
    }
    const salt = generateSalt();
    const user: StoredUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      salt,
      password: await hashPassword(password, salt),
    };
    users.push(user);
    saveUsers(users);
    this.setSession({ id: user.id, firstName, lastName, email });
    return { ok: true };
  },

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, error: 'invalid' };
    const hash = await hashPassword(password, user.salt ?? '');
    if (hash !== user.password) return { ok: false, error: 'invalid' };
    this.setSession({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
    return { ok: true };
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  },

  getSession(): UserSession | null {
    return storageGet<UserSession | null>(AUTH_KEY, null);
  },

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  },

  setSession(data: UserSession): void {
    storageSet(AUTH_KEY, data);
  },
};

// ─── Logout modal ─────────────────────────────────────────────────────────────

const LOGOUT_MODAL_HTML = `
<div id="logout-modal" style="display:none"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
  <div class="bg-white shadow-xl p-6 max-w-sm w-full text-center">
    <p class="text-base font-light mb-1">Sign Out</p>
    <p id="logout-modal-msg" class="text-sm text-gray-600 mb-6"></p>
    <div class="flex gap-3 justify-center">
      <button id="logout-cancel"
        class="px-5 py-2 border border-gray-300 text-sm hover:border-black transition">Cancel</button>
      <button id="logout-confirm"
        class="px-5 py-2 bg-black text-white text-sm hover:bg-gray-800 transition">Sign Out</button>
    </div>
  </div>
</div>`;

function closeLogoutModal(): void {
  const modal = document.getElementById('logout-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function openLogoutModal(userName: string, onConfirm: () => void): void {
  if (!document.getElementById('logout-modal')) {
    document.body.insertAdjacentHTML('beforeend', LOGOUT_MODAL_HTML);
    document.getElementById('logout-cancel')!.addEventListener('click', closeLogoutModal);
    document.getElementById('logout-modal')!.addEventListener('click', function (e) {
      if (e.target === this) closeLogoutModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLogoutModal(); });
  }

  document.getElementById('logout-modal-msg')!.textContent =
    `Are you sure you want to sign out from ${userName}?`;
  document.getElementById('logout-modal')!.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const confirmBtn = document.getElementById('logout-confirm')!;
  const newBtn = confirmBtn.cloneNode(true) as HTMLElement;
  confirmBtn.parentNode!.replaceChild(newBtn, confirmBtn);
  newBtn.addEventListener('click', () => { closeLogoutModal(); onConfirm(); });
}

// ─── Header auth state ────────────────────────────────────────────────────────

export function initAuthHeader(): void {
  const session = AuthService.getSession();
  const userLink = document.getElementById('user-nav-link') as HTMLAnchorElement | null;
  const userIcon = document.getElementById('user-nav-icon');
  if (!userLink) return;

  if (session) {
    userLink.href = '#';
    userLink.title = `${session.firstName} ${session.lastName}`;
    if (userIcon) {
      userIcon.className = 'fa-solid fa-user text-xl sm:text-2xl cursor-pointer text-[#c37989]';
    }
    userLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLogoutModal(`${session.firstName} ${session.lastName}`, () => {
        AuthService.logout();
        window.location.reload();
      });
    });
  }
}

// ─── Newsletter footer ────────────────────────────────────────────────────────

export function initNewsletterFooter(): void {
  document.querySelectorAll<HTMLFormElement>('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector<HTMLInputElement>('input[type="email"]');
      const msg = form.querySelector<HTMLElement>('.newsletter-msg');
      if (!input) return;
      const email = input.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (msg) { msg.textContent = 'Please enter a valid email.'; msg.className = 'newsletter-msg text-xs text-red-500 mt-2'; }
        return;
      }
      const subs = storageGet<string[]>(STORAGE_KEYS.newsletter, []);
      if (!subs.includes(email)) { subs.push(email); storageSet(STORAGE_KEYS.newsletter, subs); }
      input.value = '';
      if (msg) { msg.textContent = 'Thank you! You are now subscribed.'; msg.className = 'newsletter-msg text-xs text-green-600 mt-2'; }
    });
  });
}
