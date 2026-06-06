import '../styles/index.css';
import { WishlistService } from '../services/wishlistService';
import { initHeader } from '../layouts/Header';
import { initSearchOverlay } from '../layouts/SearchOverlay';
import { injectToast, showToast } from '../components/ui/Toast';
import { cart } from '../hooks/useCart';

function render(): void {
  const items = WishlistService.load();
  const grid = document.getElementById('wishlist-grid');
  const empty = document.getElementById('wishlist-empty');
  const countText = document.getElementById('wishlist-count-text');
  if (!grid || !empty) return;

  grid.innerHTML = '';

  if (items.length === 0) {
    empty.classList.remove('hidden');
    if (countText) countText.textContent = '0 saved items';
    return;
  }

  empty.classList.add('hidden');
  if (countText) countText.textContent = `${items.length} saved item${items.length === 1 ? '' : 's'}`;

  items.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'flex flex-col border border-gray-100 hover:border-gray-300 transition';
    card.innerHTML =
      `<div class="relative">
        <img src="${p.image}" alt="${p.name}" class="w-full object-cover" loading="lazy" onerror="this.src='assets/image/placeholder.avif'" />
        <button class="remove-wish absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition" data-id="${p.id}" title="Remove from wishlist">
          <i class="fa-solid fa-heart text-[#8B5A8C] text-sm"></i>
        </button>
      </div>
      <div class="flex flex-col p-3 flex-1">
        <p class="text-sm font-medium leading-tight">${p.name}</p>
        <p class="text-xs text-gray-500 mb-2">${p.subtitle || ''}</p>
        <p class="text-sm font-semibold mb-3">${p.price.toFixed(2)} lei</p>
        <button class="add-to-cart-wish bg-black text-white text-xs py-2 hover:bg-gray-800 transition w-full mt-auto tracking-wider"
          data-id="${p.id}" data-name="${p.name}" data-subtitle="${p.subtitle || ''}"
          data-price="${p.price}" data-image="${p.image}" data-color="${p.color || ''}">
          ADD TO BAG
        </button>
      </div>`;
    grid.appendChild(card);
  });

  grid.querySelectorAll<HTMLElement>('.remove-wish').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = WishlistService.load().find((i) => i.id === id);
      if (item) { WishlistService.toggle(item); render(); }
    });
  });

  grid.querySelectorAll<HTMLElement>('.add-to-cart-wish').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = {
        id: btn.dataset.id ?? '',
        name: btn.dataset.name ?? '',
        subtitle: btn.dataset.subtitle ?? '',
        price: parseFloat(btn.dataset.price ?? '0'),
        image: btn.dataset.image ?? '',
        color: btn.dataset.color ?? '',
        size: 'One Size',
        promo: '',
      };
      cart.add(product);
      showToast(`${product.name} added to bag!`);
    });
  });
}

function init(): void {
  injectToast();
  initHeader();
  initSearchOverlay();

  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('open');
  });

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
