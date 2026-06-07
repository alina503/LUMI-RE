import { STORAGE_KEYS } from '../constants/config';
import { storageGet, storageSet } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { lockScroll, unlockScroll } from '../hooks/useModal';
import type { UserSession } from '../types';

export type { UserSession };

// ─── AuthService ──────────────────────────────────────────────────────────────

export const AuthService = {
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<{ ok: boolean; error?: string }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    if (error) {
      return { ok: false, error: error.message.includes('already') ? 'exists' : error.message };
    }
    if (data.user) {
      this.setSession({
        id: data.user.id,
        firstName,
        lastName,
        email: data.user.email ?? email,
      });
    }
    return { ok: true };
  },

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: 'invalid' };
    if (data.user) {
      const meta = data.user.user_metadata ?? {};
      this.setSession({
        id: data.user.id,
        firstName: (meta['first_name'] as string | undefined) ?? '',
        lastName: (meta['last_name'] as string | undefined) ?? '',
        email: data.user.email ?? email,
      });
    }
    return { ok: true };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEYS.session);
  },

  getSession(): UserSession | null {
    return storageGet<UserSession | null>(STORAGE_KEYS.session, null);
  },

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  },

  setSession(data: UserSession): void {
    storageSet(STORAGE_KEYS.session, data);
  },

  async updateProfile(_id: string, firstName: string, lastName: string): Promise<void> {
    await supabase.auth.updateUser({ data: { first_name: firstName, last_name: lastName } });
    const session = this.getSession();
    if (session) this.setSession({ ...session, firstName, lastName });
  },
};

// ─── Sync Supabase session on load ────────────────────────────────────────────
// Supabase restores the session from its own storage on page load.
// We mirror it into our lightweight session cache so synchronous callers work.
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    const meta = session.user.user_metadata ?? {};
    AuthService.setSession({
      id: session.user.id,
      firstName: (meta['first_name'] as string | undefined) ?? '',
      lastName: (meta['last_name'] as string | undefined) ?? '',
      email: session.user.email ?? '',
    });
  } else if (event === 'SIGNED_OUT') {
    localStorage.removeItem(STORAGE_KEYS.session);
  }
});

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
  if (!modal || modal.style.display === 'none') return;
  modal.style.display = 'none';
  unlockScroll();
}

export function openLogoutModal(userName: string, onConfirm: () => void): void {
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
  lockScroll();

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
      userIcon.className = 'fa-solid fa-user text-xl sm:text-2xl cursor-pointer text-brand';
    }
    userLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLogoutModal(`${session.firstName} ${session.lastName}`, () => {
        AuthService.logout().then(() => window.location.reload());
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
