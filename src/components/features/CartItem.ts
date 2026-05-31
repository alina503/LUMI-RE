import type { CartItem } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { sanitizeText } from '../../utils/helpers';

const s = sanitizeText;

export function renderCartItem(
  item: CartItem,
  onRemove: (key: string) => void,
  onQtyChange: (key: string, qty: number) => void,
): HTMLElement {
  const div = document.createElement('div');
  div.className = 'flex gap-4 py-6';
  div.dataset.key = item.key;

  div.innerHTML = `
    <div class="shrink-0">
      <img src="${s(item.image)}" alt="${s(item.name)}" class="w-24 sm:w-32 aspect-[3/4] object-cover object-top" loading="lazy" onerror="this.src='assets/image/placeholder.avif'" />
    </div>
    <div class="flex flex-col flex-1 gap-1">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm font-semibold">${s(item.name)}</p>
          <p class="text-xs text-gray-600">${s(item.subtitle)}</p>
          <p class="text-xs text-gray-500 mt-1">Mărime: <span class="font-medium">${s(item.size)}</span></p>
          ${item.color ? `<p class="text-xs text-gray-500">Culoare: <span class="font-medium">${s(item.color)}</span></p>` : ''}
        </div>
        <button class="remove-btn text-gray-400 hover:text-red-500 ml-2 text-sm" data-key="${s(item.key)}" title="Elimină">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="flex items-center justify-between mt-3">
        <div class="flex items-center border border-gray-300">
          <button class="qty-btn minus w-8 h-8 flex items-center justify-center border-r border-gray-300 text-sm hover:bg-black hover:text-white transition" data-key="${s(item.key)}">−</button>
          <span class="qty-val w-8 h-8 flex items-center justify-center text-sm">${item.qty}</span>
          <button class="qty-btn plus w-8 h-8 flex items-center justify-center border-l border-gray-300 text-sm hover:bg-black hover:text-white transition" data-key="${s(item.key)}">+</button>
        </div>
        <p class="item-total text-base font-semibold">${formatPrice(item.price * item.qty)}</p>
      </div>
      ${item.promo ? `<p class="text-red-400 text-xs mt-1">${s(item.promo)}</p>` : ''}
    </div>`;

  div.querySelector('.remove-btn')?.addEventListener('click', () => onRemove(item.key));
  div.querySelector('.qty-btn.plus')?.addEventListener('click', () => onQtyChange(item.key, item.qty + 1));
  div.querySelector('.qty-btn.minus')?.addEventListener('click', () => {
    if (item.qty > 1) onQtyChange(item.key, item.qty - 1);
  });

  return div;
}
