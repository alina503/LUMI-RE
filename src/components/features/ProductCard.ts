import type { SearchResult } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { sanitizeText } from '../../utils/helpers';
import { initSizeButtons, getSelectedSize, highlightSizeError } from '../ui/SizeButton';
import { showToast } from '../ui/Toast';
import { cart } from '../../hooks/useCart';
import { openProductModal } from './ProductModal';
import { upgradeStaticCardImages } from '../ui/ProductImage';

const s = sanitizeText;

export function renderProductCard(product: SearchResult): HTMLElement {
  const sizeButtons = product.sizes
    .map(
      (size) =>
        `<button class="size-btn" type="button" aria-label="Select size ${s(size)}">${s(size)}</button>`,
    )
    .join('');

  const promoHtml = product.promo
    ? `<span class="product-card__promo">${s(product.promo)}</span>`
    : '';

  const descHtml = product.description
    ? `<p class="text-xs text-gray-400 mt-1 mb-1 line-clamp-2">${s(product.description)}</p>`
    : '';

  const detailLink = product.id
    ? `<a href="produs.html?id=${s(product.id)}" class="text-xs text-brand hover:text-brand-dark underline mt-1 transition-colors duration-150">View details</a>`
    : '';

  const div = document.createElement('article');
  div.className = 'product-card';
  div.dataset.id       = product.id;
  div.dataset.name     = product.name;
  div.dataset.subtitle = product.subtitle;
  div.dataset.price    = String(product.price);
  div.dataset.image    = product.image;
  div.dataset.color    = product.color;
  div.dataset.sizes    = product.sizes.join(',');
  if (product.promo) div.dataset.promo = product.promo;

  // Image with progressive reveal and overflow container
  const imgWrap = document.createElement('div');
  imgWrap.className = 'product-card__image-wrap';

  const img = document.createElement('img');
  img.src        = product.image;
  img.alt        = product.name;
  img.loading    = 'lazy';
  img.decoding   = 'async';
  img.className  = 'product-card__image img-loading';
  img.onload     = () => { img.classList.remove('img-loading'); img.classList.add('img-loaded'); };
  img.onerror    = () => { img.src = 'assets/image/placeholder.avif'; img.srcset = ''; };
  img.addEventListener('click', () => openProductModal(div));

  imgWrap.appendChild(img);

  // Promo badge
  if (product.promo) {
    const badge = document.createElement('span');
    badge.className   = 'product-card__badge';
    badge.textContent = product.promo;
    div.appendChild(badge);
  }

  const body = document.createElement('div');
  body.className = 'product-card__body';
  body.innerHTML = `
    <p class="product-card__name product-name">${s(product.name)}</p>
    <p class="product-card__subtitle">${s(product.subtitle)}</p>
    ${descHtml}
    <span class="product-card__price">${formatPrice(product.price)}</span>
    ${promoHtml}
    <div class="flex gap-1 flex-wrap my-2 size-group" role="group" aria-label="Available sizes">
      ${sizeButtons}
    </div>
    <button type="button" class="add-to-cart mt-auto" aria-label="Add ${s(product.name)} to bag">
      ADD TO BAG
    </button>
    ${detailLink}`;

  div.appendChild(imgWrap);
  div.appendChild(body);

  initSizeButtons(div);

  div.querySelector('.add-to-cart')?.addEventListener('click', () => {
    const size = getSelectedSize(div);
    if (!size) {
      const group = div.querySelector<HTMLElement>('.size-group');
      if (group) highlightSizeError(group);
      return;
    }
    cart.add({
      id:       product.id,
      name:     product.name,
      subtitle: product.subtitle,
      price:    product.price,
      image:    product.image,
      color:    product.color,
      size,
      promo:    product.promo ?? '',
    });
    showToast(`${product.name} added to bag!`);
  });

  return div;
}

export function initPageProductCards(): void {
  upgradeStaticCardImages(document);

  document.querySelectorAll<HTMLElement>('.product-card').forEach((card) => {
    const imgEl = card.querySelector<HTMLImageElement>('img');
    if (imgEl) {
      imgEl.addEventListener('click', () => openProductModal(card));
    }

    card.querySelector('.add-to-cart')?.addEventListener('click', () => {
      const size = getSelectedSize(card);
      if (!size) {
        const group = card.querySelector<HTMLElement>('.size-group');
        if (group) highlightSizeError(group);
        return;
      }
      const name  = card.dataset.name ?? '';
      const price = parseFloat(card.dataset.price ?? '0');
      if (isNaN(price)) return;
      cart.add({
        id:       card.dataset.id ?? '',
        name,
        subtitle: card.dataset.subtitle ?? '',
        price,
        image:    card.dataset.image ?? '',
        color:    card.dataset.color ?? '',
        size,
        promo:    card.dataset.promo ?? '',
      });
      showToast(`${name} added to bag!`);
    });
  });
}
