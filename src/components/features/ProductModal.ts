import { formatPrice } from '../../utils/formatters';
import { sanitizeText } from '../../utils/helpers';
import { showToast } from '../ui/Toast';
import { CART_CONFIG } from '../../constants/config';
import { cart } from '../../hooks/useCart';
import { useModal } from '../../hooks/useModal';
import { PLACEHOLDER } from '../../constants/images';

const s = sanitizeText;

const MODAL_HTML = `
<div id="product-popup" role="dialog" aria-modal="true" aria-labelledby="pp-name"
  style="display:none;z-index:var(--lum-z-modal);"
  class="fixed inset-0 flex items-center justify-center bg-black/60 px-4 py-8">
  <div class="bg-white relative w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col sm:flex-row"
    style="box-shadow:var(--lum-shadow-xl);">

    <button id="pp-close" aria-label="Close product preview"
      class="modal-close">&times;</button>

    <div class="absolute top-3 left-4 text-xs text-gray-500 flex items-center gap-1">
      <button id="pp-back" class="flex items-center gap-1 hover:text-black transition-colors duration-150">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Back
      </button>
    </div>

    <div class="flex flex-col items-center p-4 pt-10 sm:w-[55%] flex-shrink-0">
      <img id="pp-main-img" src="" alt="" loading="lazy" decoding="async"
        class="w-full max-h-72 sm:max-h-96 object-cover object-top mb-3 img-loading"
        onerror="this.src='assets/image/placeholder.avif'" />
      <div id="pp-thumbs" class="flex gap-2 flex-wrap justify-center"></div>
    </div>

    <div class="flex flex-col p-5 pt-10 flex-1 min-w-0">
      <p id="pp-brand" class="section-eyebrow mb-1"></p>
      <h2 id="pp-name" class="text-xl sm:text-2xl font-light mb-1 text-balance"></h2>

      <p id="pp-price" class="text-lg font-semibold mb-2 mt-1"></p>
      <p id="pp-promo" class="product-card__promo mb-2 hidden"></p>

      <div class="flex items-center gap-3 mb-4" role="group" aria-label="Quantity">
        <button id="pp-qty-minus" class="qty-btn" aria-label="Decrease quantity">−</button>
        <span id="pp-qty-val" class="text-sm w-6 text-center tabular-nums" aria-live="polite">1</span>
        <button id="pp-qty-plus" class="qty-btn" aria-label="Increase quantity">+</button>
      </div>

      <div id="pp-sizes-wrap" class="mb-4">
        <p class="lum-label mb-2">Size</p>
        <div id="pp-size-btns" class="flex flex-wrap gap-2" role="group" aria-label="Available sizes"></div>
        <p id="pp-size-error" class="lum-field-error hidden">Please select a size.</p>
      </div>

      <button id="pp-add-btn" class="add-to-cart mt-auto">
        ADD TO BAG
      </button>

      <p id="pp-subtitle" class="text-xs text-gray-400 mt-4 leading-relaxed"></p>
    </div>
  </div>
</div>`;

let _openPopupFn: ((card: HTMLElement) => void) | null = null;

export function openProductModal(card: HTMLElement): void {
  _openPopupFn?.(card);
}

export function initProductModal(): void {
  if (document.getElementById('product-popup')) return;
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  const modal = useModal('product-popup');
  const mainImg = document.getElementById('pp-main-img') as HTMLImageElement;
  const thumbs = document.getElementById('pp-thumbs')!;
  const brandEl = document.getElementById('pp-brand')!;
  const nameEl = document.getElementById('pp-name')!;
  const priceEl = document.getElementById('pp-price')!;
  const promoEl = document.getElementById('pp-promo')!;
  const subtitleEl = document.getElementById('pp-subtitle')!;
  const sizeBtns = document.getElementById('pp-size-btns')!;
  const sizeErr = document.getElementById('pp-size-error')!;
  const qtyVal = document.getElementById('pp-qty-val')!;

  let currentCard: HTMLElement | null = null;
  let currentQty = 1;

  function openPopup(card: HTMLElement): void {
    currentCard = card;
    currentQty = 1;
    qtyVal.textContent = '1';
    sizeErr.classList.add('hidden');

    const imgSrc = card.dataset.image || PLACEHOLDER;
    mainImg.classList.remove('img-loaded');
    mainImg.classList.add('img-loading');
    mainImg.alt   = s(card.dataset.name ?? '');
    mainImg.sizes = '(max-width: 640px) 100vw, 55vw';
    mainImg.onload = () => {
      mainImg.classList.remove('img-loading');
      mainImg.classList.add('img-loaded');
    };
    mainImg.onerror = () => { mainImg.src = PLACEHOLDER; mainImg.srcset = ''; };
    mainImg.srcset = '';
    mainImg.src    = imgSrc;

    brandEl.textContent = 'LUMIÈRE';
    nameEl.textContent = card.dataset.name ?? '';
    priceEl.textContent = formatPrice(parseFloat(card.dataset.price ?? '0'));

    if (card.dataset.promo) {
      promoEl.textContent = card.dataset.promo;
      promoEl.classList.remove('hidden');
    } else {
      promoEl.classList.add('hidden');
    }
    subtitleEl.textContent = card.dataset.subtitle ?? '';

    thumbs.innerHTML = '';
    const thumb = document.createElement('img');
    thumb.src    = imgSrc;
    thumb.srcset = '';
    thumb.sizes  = '64px';
    thumb.className = 'w-16 h-16 object-cover object-top cursor-pointer border-2 border-black transition';
    thumb.loading   = 'lazy';
    thumb.addEventListener('click', () => {
      mainImg.src    = imgSrc;
      mainImg.srcset = '';
    });
    thumb.onerror = () => { thumb.src = PLACEHOLDER; thumb.srcset = ''; };
    thumbs.appendChild(thumb);

    sizeBtns.innerHTML = '';
    card.querySelectorAll<HTMLButtonElement>('.size-btn').forEach((btn) => {
      const b = document.createElement('button');
      b.textContent = btn.textContent?.trim() ?? '';
      b.className = 'pp-size border border-gray-300 text-xs px-3 py-2 hover:border-black transition';
      b.addEventListener('click', () => {
        sizeBtns.querySelectorAll('.pp-size').forEach((si) =>
          si.classList.remove('bg-black', 'text-white', 'border-black'),
        );
        b.classList.add('bg-black', 'text-white', 'border-black');
        sizeErr.classList.add('hidden');
      });
      sizeBtns.appendChild(b);
    });

    modal.open();
  }

  document.getElementById('pp-qty-minus')!.addEventListener('click', () => {
    if (currentQty > 1) { currentQty--; qtyVal.textContent = String(currentQty); }
  });
  document.getElementById('pp-qty-plus')!.addEventListener('click', () => {
    if (currentQty < CART_CONFIG.maxQty) { currentQty++; qtyVal.textContent = String(currentQty); }
  });

  document.getElementById('pp-add-btn')!.addEventListener('click', () => {
    const selected = sizeBtns.querySelector<HTMLElement>('.pp-size.bg-black');
    if (!selected || !currentCard) { sizeErr.classList.remove('hidden'); return; }

    cart.add({
      id: currentCard.dataset.id ?? '',
      name: currentCard.dataset.name ?? '',
      subtitle: currentCard.dataset.subtitle ?? '',
      price: parseFloat(currentCard.dataset.price ?? '0'),
      image: currentCard.dataset.image || '',
      color: currentCard.dataset.color ?? '',
      size: selected.textContent?.trim() ?? '',
      promo: currentCard.dataset.promo ?? '',
    }, currentQty);

    showToast(`${currentCard.dataset.name} added to bag!`);
    modal.close();
  });

  document.getElementById('pp-close')!.addEventListener('click', () => modal.close());
  document.getElementById('pp-back')!.addEventListener('click', () => modal.close());
  document.getElementById('product-popup')!.addEventListener('click', (e) => {
    if (e.target === document.getElementById('product-popup')) modal.close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.isOpen()) modal.close(); });

  _openPopupFn = openPopup;
}
