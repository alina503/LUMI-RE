import { resolveImage, resolveImageSrcset, PLACEHOLDER } from '../../constants/images';

export interface ProductImageOptions {
  productId: string;
  alt: string;
  /** CSS classes applied to the <img> element */
  className?: string;
  /** Pixel width for the primary src (default 800) */
  width?: number;
  /** Makes the image clickable — calls this handler on click */
  onClick?: (e: MouseEvent) => void;
}

/**
 * Creates an <img> element with:
 *  - Unsplash/Pexels src resolved from the centralized image registry
 *  - responsive srcset (400w / 800w / 1200w)
 *  - sizes hint for the browser layout engine
 *  - native lazy loading
 *  - blur-up reveal animation via CSS classes
 *  - automatic fallback to placeholder on error
 */
export function createProductImage(opts: ProductImageOptions): HTMLImageElement {
  const { productId, alt, className = '', width = 800, onClick } = opts;

  const img = document.createElement('img');
  img.src      = resolveImage(productId, width);
  img.srcset   = resolveImageSrcset(productId);
  img.sizes    = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px';
  img.alt      = alt;
  img.loading  = 'lazy';
  img.decoding = 'async';
  img.className = `product-img img-loading${className ? ' ' + className : ''}`;

  img.addEventListener('load', () => {
    img.classList.remove('img-loading');
    img.classList.add('img-loaded');
  });

  img.addEventListener('error', () => {
    if (img.src !== PLACEHOLDER) {
      img.src    = PLACEHOLDER;
      img.srcset = '';
    }
  });

  if (onClick) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', onClick);
  }

  return img;
}

/**
 * Wires lazy-load intersection observer to any img.product-img already in
 * the DOM that does NOT yet have a src. Used for server-rendered HTML cards
 * where the image src is set via data-src for deferred loading.
 */
export function initLazyImages(root: Document | Element = document): void {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src    = src;
          img.srcset = img.dataset.srcset ?? '';
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
        }
        observer.unobserve(img);
      });
    },
    { rootMargin: '200px 0px' },
  );

  root.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => {
    observer.observe(img);
  });
}

/**
 * Upgrades every .product-card in root that still references a local
 * assets/icon path to use the CDN URL from the image registry.
 * Call once on DOMContentLoaded if you have server-rendered cards.
 */
export function upgradeStaticCardImages(root: Document | Element = document): void {
  root.querySelectorAll<HTMLElement>('.product-card').forEach((card) => {
    const img = card.querySelector<HTMLImageElement>('img');
    if (!img) return;

    const id = card.dataset.id ?? '';
    const resolved = resolveImage(id);

    // Only upgrade if still pointing at local assets
    if (img.src.includes('assets/icon') || img.src.includes('assets/image')) {
      img.src    = resolved;
      img.srcset = resolveImageSrcset(id);
    }

    // Ensure lazy loading & reveal classes
    img.loading  = 'lazy';
    img.decoding = 'async';
    if (!img.classList.contains('img-loaded')) {
      img.classList.add('img-loading');
      img.addEventListener('load', () => {
        img.classList.remove('img-loading');
        img.classList.add('img-loaded');
      }, { once: true });
    }
  });
}
