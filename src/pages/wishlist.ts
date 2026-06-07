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

    const sizes = p.sizes ?? [];
    const needsSizePicker = sizes.length > 0;
    const singleSize = sizes.length === 1 ? sizes[0] : null;

    const sizePicker = needsSizePicker && !singleSize
      ? `<div class="flex flex-wrap gap-1 mb-3 size-picker" role="group" aria-label="Select size">
          ${sizes.map((sz) => `<button type="button" class="wish-size-btn border border-gray-300 text-xs px-2 py-1 hover:border-black transition" data-size="${sz}">${sz}</button>`).join('')}
        </div>`
      : '';

    card.innerHTML =
      `<div class="relative">
        <img src="${p.image}" alt="${p.name}" class="w-full object-cover" loading="lazy" onerror="this.src='assets/image/placeholder.avif'" />
        <button class="remove-wish absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition" data-id="${p.id}" title="Remove from wishlist">
          <i class="fa-solid fa-heart text-brand text-sm"></i>
        </button>
      </div>
      <div class="flex flex-col p-3 flex-1">
        <p class="text-sm font-medium leading-tight">${p.name}</p>
        <p class="text-xs text-gray-500 mb-2">${p.subtitle || ''}</p>
        <p class="text-sm font-semibold mb-3">${p.price.toFixed(2)} lei</p>
        ${sizePicker}
        <button class="add-to-cart-wish bg-black text-white text-xs py-2 hover:bg-gray-800 transition w-full mt-auto tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          data-id="${p.id}" data-name="${p.name}" data-subtitle="${p.subtitle || ''}"
          data-price="${p.price}" data-image="${p.image}" data-color="${p.color || ''}"
          ${needsSizePicker && !singleSize ? 'disabled aria-disabled="true"' : ''}>
          ${needsSizePicker && !singleSize ? 'SELECT A SIZE' : 'ADD TO BAG'}
        </button>
      </div>`;

    if (needsSizePicker && !singleSize) {
      card.querySelectorAll<HTMLElement>('.wish-size-btn').forEach((sizeBtn) => {
        sizeBtn.addEventListener('click', () => {
          card.querySelectorAll('.wish-size-btn').forEach((b) => {
            b.classList.remove('bg-black', 'text-white', 'border-black');
          });
          sizeBtn.classList.add('bg-black', 'text-white', 'border-black');
          const addBtn = card.querySelector<HTMLButtonElement>('.add-to-cart-wish');
          if (addBtn) {
            addBtn.disabled = false;
            addBtn.removeAttribute('aria-disabled');
            addBtn.dataset.selectedSize = sizeBtn.dataset.size ?? '';
            addBtn.textContent = 'ADD TO BAG';
          }
        });
      });
    }

    grid.appendChild(card);
  });

  grid.querySelectorAll<HTMLElement>('.remove-wish').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = WishlistService.load().find((i) => i.id === id);
      if (item) { WishlistService.toggle(item); render(); }
    });
  });

  grid.querySelectorAll<HTMLButtonElement>('.add-to-cart-wish').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const sizes = (btn.closest('.flex.flex-col') as HTMLElement | null)
        ?.querySelector<HTMLElement>('.wish-size-btn.bg-black')?.dataset.size;
      const size = btn.dataset.selectedSize || sizes || 'One Size';
      const product = {
        id: btn.dataset.id ?? '',
        name: btn.dataset.name ?? '',
        subtitle: btn.dataset.subtitle ?? '',
        price: parseFloat(btn.dataset.price ?? '0'),
        image: btn.dataset.image ?? '',
        color: btn.dataset.color ?? '',
        size,
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

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
