import { initSharedPage } from './shared';
import { fetchProductById } from '../api/products';
import { cart } from '../hooks/useCart';
import { showToast } from '../components/ui/Toast';
import { ROUTES } from '../constants/routes';
import type { Product } from '../types';

initSharedPage();

const CATEGORY_ROUTES: Record<string, string> = {
  bras: ROUTES.bras,
  panties: ROUTES.panties,
  lingerie: ROUTES.lingerie,
  sleepwear: ROUTES.sleepwear,
  activewear: ROUTES.activewear,
  beauty: ROUTES.beauty,
  accessories: ROUTES.accessories,
  swim: ROUTES.swim,
  'new-in': ROUTES.newIn,
  edit: ROUTES.edit,
  atelier: ROUTES.atelier,
};

function showNotFound(): void {
  const el = document.getElementById('not-found');
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.add('flex');
}

function renderProduct(p: Product): void {
  document.title = `${p.name} | LUMIÈRE`;

  const breadcrumbCat = document.getElementById('breadcrumb-cat') as HTMLAnchorElement | null;
  if (breadcrumbCat) {
    breadcrumbCat.textContent = p.category;
    breadcrumbCat.href = CATEGORY_ROUTES[p.category] ?? ROUTES.home;
  }
  const breadcrumbName = document.getElementById('breadcrumb-name');
  if (breadcrumbName) breadcrumbName.textContent = p.name;

  const mainImg = document.getElementById('pd-main-img') as HTMLImageElement | null;
  if (mainImg) {
    mainImg.src = p.image;
    mainImg.alt = p.name;
  }

  const thumbs = document.getElementById('pd-thumbs');
  if (thumbs) {
    const images = p.images?.length ? p.images : [p.image];
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = p.name;
      img.className = `w-20 h-20 object-cover object-top cursor-pointer border-2 transition ${i === 0 ? 'border-black' : 'border-transparent hover:border-black'}`;
      img.addEventListener('click', () => {
        if (mainImg) mainImg.src = src;
        thumbs.querySelectorAll('img').forEach((t) => {
          t.classList.remove('border-black');
          t.classList.add('border-transparent');
        });
        img.classList.add('border-black');
        img.classList.remove('border-transparent');
      });
      thumbs.appendChild(img);
    });
  }

  if (p.promo) {
    const badge = document.getElementById('pd-promo-badge');
    if (badge) { badge.textContent = p.promo; badge.classList.remove('hidden'); }
    const promoEl = document.getElementById('pd-promo');
    if (promoEl) { promoEl.textContent = p.promo; promoEl.classList.remove('hidden'); }
  }

  const nameEl = document.getElementById('pd-name');
  if (nameEl) nameEl.textContent = p.name;
  const subtitleEl = document.getElementById('pd-subtitle');
  if (subtitleEl) subtitleEl.textContent = p.subtitle;
  const priceEl = document.getElementById('pd-price');
  if (priceEl) priceEl.textContent = `${p.price.toFixed(2)} lei`;

  if (p.color) {
    const colorWrap = document.getElementById('pd-color-wrap');
    if (colorWrap) colorWrap.classList.remove('hidden');
    const colorLabel = document.getElementById('pd-color-label');
    if (colorLabel) colorLabel.textContent = p.color;
  }

  const sizeContainer = document.getElementById('pd-size-btns');
  if (sizeContainer) {
    (p.sizes ?? []).forEach((size) => {
      const btn = document.createElement('button');
      btn.textContent = size;
      btn.className = 'pd-size border border-gray-300 text-xs px-4 py-2 hover:border-black transition';
      btn.addEventListener('click', () => {
        sizeContainer.querySelectorAll<HTMLButtonElement>('.pd-size').forEach((b) => {
          b.classList.remove('bg-black', 'text-white', 'border-black');
        });
        btn.classList.add('bg-black', 'text-white', 'border-black');
        selectedSize = size;
        document.getElementById('pd-size-error')?.classList.add('hidden');
      });
      sizeContainer.appendChild(btn);
    });
  }

  document.getElementById('product-main')?.classList.remove('hidden');
}

let qty = 1;
let selectedSize: string | null = null;

async function init(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) { showNotFound(); return; }

  try {
    const product = await fetchProductById(productId);
    if (!product) { showNotFound(); return; }

    renderProduct(product);

    document.getElementById('pd-qty-minus')?.addEventListener('click', () => {
      if (qty > 1) { qty--; const el = document.getElementById('pd-qty-val'); if (el) el.textContent = String(qty); }
    });
    document.getElementById('pd-qty-plus')?.addEventListener('click', () => {
      qty++; const el = document.getElementById('pd-qty-val'); if (el) el.textContent = String(qty);
    });

    document.getElementById('pd-add-btn')?.addEventListener('click', () => {
      if (!selectedSize) {
        document.getElementById('pd-size-error')?.classList.remove('hidden');
        return;
      }
      cart.add(
        {
          id: product.id,
          name: product.name,
          subtitle: product.subtitle,
          price: product.price,
          image: product.image,
          color: product.color ?? '',
          size: selectedSize,
          promo: product.promo ?? '',
        },
        qty,
      );
      showToast(`${product.name} added to bag!`);
    });
  } catch {
    showNotFound();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
