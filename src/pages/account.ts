import { AuthService } from '../services/authService';
import { initHeader } from '../layouts/Header';
import { initSearchOverlay } from '../layouts/SearchOverlay';
import { injectToast } from '../components/ui/Toast';

interface Order {
  id: string;
  date: string;
  total: number;
  items: Array<{ qty: number }>;
  delivery: { method: string; city: string };
  payment: string;
}

function init(): void {
  injectToast();
  initHeader();
  initSearchOverlay();

  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('open');
  });

  const session = AuthService.getSession();

  if (!session) {
    const notLogged = document.getElementById('not-logged-in');
    if (notLogged) { notLogged.classList.remove('hidden'); notLogged.classList.add('flex'); }
    return;
  }

  document.getElementById('account-content')?.classList.remove('hidden');

  const accName = document.getElementById('acc-name');
  const accEmail = document.getElementById('acc-email');
  if (accName) accName.textContent = `${session.firstName} ${session.lastName}`;
  if (accEmail) accEmail.textContent = session.email;

  const pfFirst = document.getElementById('pf-first-name') as HTMLInputElement | null;
  const pfLast = document.getElementById('pf-last-name') as HTMLInputElement | null;
  const pfEmail = document.getElementById('pf-email') as HTMLInputElement | null;
  if (pfFirst) pfFirst.value = session.firstName;
  if (pfLast) pfLast.value = session.lastName;
  if (pfEmail) pfEmail.value = session.email;

  // Tab switching
  document.querySelectorAll<HTMLElement>('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const tab = (this as HTMLElement).dataset.tab;
      if (!tab || tab === 'wishlist-link') return;
      document.querySelectorAll<HTMLElement>('.tab-btn').forEach((b) => {
        b.classList.remove('font-medium', 'text-black', 'bg-gray-50');
        b.classList.add('text-gray-600');
      });
      (this as HTMLElement).classList.add('font-medium', 'text-black', 'bg-gray-50');
      (this as HTMLElement).classList.remove('text-gray-600');
      document.querySelectorAll<HTMLElement>('.tab-panel').forEach((p) => p.classList.add('hidden'));
      document.getElementById(`tab-${tab}`)?.classList.remove('hidden');
    });
  });

  // Load orders
  const historyKey = `vs_orders_${session.id}`;
  let orders: Order[] = [];
  try { orders = JSON.parse(localStorage.getItem(historyKey) || '[]'); } catch { orders = []; }

  const ordersContainer = document.getElementById('orders-list');
  if (orders.length === 0) {
    document.getElementById('no-orders')?.classList.remove('hidden');
  } else if (ordersContainer) {
    const payLabels: Record<string, string> = { card: 'Bank card', paypal: 'PayPal', ramburs: 'Cash on delivery' };
    orders.forEach((order) => {
      const date = new Date(order.date);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

      const div = document.createElement('div');
      div.className = 'border border-gray-200 p-5';
      div.innerHTML =
        `<div class="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Order</p>
            <p class="font-mono font-semibold text-[#8B5A8C]">${order.id}</p>
          </div>
          <div class="text-right sm:text-right">
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
            <p class="text-sm">${dateStr}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Total</p>
            <p class="text-sm font-semibold">${order.total.toFixed(2)} lei</p>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-3 flex flex-wrap gap-2 text-xs text-gray-500">
          <span><i class="fa-solid fa-box mr-1"></i>${itemCount} item${itemCount === 1 ? '' : 's'}</span>
          <span class="mx-2">·</span>
          <span><i class="fa-solid fa-truck mr-1"></i>${order.delivery.method === 'express' ? 'Express' : 'Standard'}</span>
          <span class="mx-2">·</span>
          <span><i class="fa-solid fa-credit-card mr-1"></i>${payLabels[order.payment] || order.payment}</span>
          <span class="mx-2">·</span>
          <span><i class="fa-solid fa-location-dot mr-1"></i>${order.delivery.city}</span>
        </div>`;
      ordersContainer.appendChild(div);
    });
  }

  // Profile save
  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fn = (document.getElementById('pf-first-name') as HTMLInputElement).value.trim();
    const ln = (document.getElementById('pf-last-name') as HTMLInputElement).value.trim();
    if (!fn || !ln) return;

    let users: Array<{ id: number; firstName: string; lastName: string }> = [];
    try { users = JSON.parse(localStorage.getItem('vs_users') || '[]'); } catch { users = []; }
    const user = users.find((u) => u.id === session.id);
    if (user) { user.firstName = fn; user.lastName = ln; }
    try { localStorage.setItem('vs_users', JSON.stringify(users)); } catch { /* quota */ }

    const newSession = { id: session.id, firstName: fn, lastName: ln, email: session.email };
    localStorage.setItem('vs_user', JSON.stringify(newSession));

    const accNameEl = document.getElementById('acc-name');
    if (accNameEl) accNameEl.textContent = `${fn} ${ln}`;

    const successEl = document.getElementById('profile-success');
    if (successEl) {
      successEl.classList.remove('hidden');
      setTimeout(() => successEl.classList.add('hidden'), 3000);
    }
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    // Re-use the modal from authService via dynamic import not needed — just do inline
    const confirmed = window.confirm(`Sign out from ${session.firstName} ${session.lastName}?`);
    if (confirmed) {
      AuthService.logout();
      window.location.href = 'index.html';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
