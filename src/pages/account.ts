import '../styles/index.css';
import { AuthService, openLogoutModal } from '../services/authService';
import { STORAGE_KEYS } from '../constants/config';
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
  const historyKey = STORAGE_KEYS.orders(session.id);
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

      // Use textContent for all user-supplied data to prevent XSS
      const header = document.createElement('div');
      header.className = 'flex flex-col sm:flex-row justify-between gap-3 mb-4';
      header.innerHTML = `
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Order</p>
          <p class="font-mono font-semibold text-brand order-id"></p>
        </div>
        <div class="text-right sm:text-right">
          <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
          <p class="text-sm order-date"></p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Total</p>
          <p class="text-sm font-semibold order-total"></p>
        </div>`;
      header.querySelector<HTMLElement>('.order-id')!.textContent = order.id;
      header.querySelector<HTMLElement>('.order-date')!.textContent = dateStr;
      header.querySelector<HTMLElement>('.order-total')!.textContent = `${order.total.toFixed(2)} lei`;

      const meta = document.createElement('div');
      meta.className = 'border-t border-gray-100 pt-3 flex flex-wrap gap-2 text-xs text-gray-500';
      const deliveryLabel = order.delivery.method === 'express' ? 'Express' : 'Standard';
      const payLabel = payLabels[order.payment] ?? 'Unknown';
      meta.innerHTML = `
        <span><i class="fa-solid fa-box mr-1"></i><span class="meta-items"></span></span>
        <span class="mx-2">·</span>
        <span><i class="fa-solid fa-truck mr-1"></i><span class="meta-delivery"></span></span>
        <span class="mx-2">·</span>
        <span><i class="fa-solid fa-credit-card mr-1"></i><span class="meta-pay"></span></span>
        <span class="mx-2">·</span>
        <span><i class="fa-solid fa-location-dot mr-1"></i><span class="meta-city"></span></span>`;
      meta.querySelector<HTMLElement>('.meta-items')!.textContent = `${itemCount} item${itemCount === 1 ? '' : 's'}`;
      meta.querySelector<HTMLElement>('.meta-delivery')!.textContent = deliveryLabel;
      meta.querySelector<HTMLElement>('.meta-pay')!.textContent = payLabel;
      meta.querySelector<HTMLElement>('.meta-city')!.textContent = order.delivery.city;

      div.appendChild(header);
      div.appendChild(meta);
      ordersContainer.appendChild(div);
    });
  }

  // Profile save
  document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fn = (document.getElementById('pf-first-name') as HTMLInputElement).value.trim();
    const ln = (document.getElementById('pf-last-name') as HTMLInputElement).value.trim();
    if (!fn || !ln) return;

    await AuthService.updateProfile(session.id, fn, ln);

    const accNameEl = document.getElementById('acc-name');
    if (accNameEl) accNameEl.textContent = `${fn} ${ln}`;

    const successEl = document.getElementById('profile-success');
    if (successEl) {
      successEl.classList.remove('hidden');
      setTimeout(() => successEl.classList.add('hidden'), 3000);
    }
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    openLogoutModal(`${session.firstName} ${session.lastName}`, () => {
      AuthService.logout().then(() => { window.location.href = 'index.html'; });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
