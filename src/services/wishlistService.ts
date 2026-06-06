import { showToast } from '../components/ui/Toast';
import { STORAGE_KEYS } from '../constants/config';

const WISHLIST_KEY = STORAGE_KEYS.wishlist;

export interface WishlistProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  color: string;
}

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

export const WishlistService = {
  load(): WishlistProduct[] {
    return storageGet<WishlistProduct[]>(WISHLIST_KEY, []);
  },

  save(items: WishlistProduct[]): void {
    storageSet(WISHLIST_KEY, items);
  },

  has(id: string): boolean {
    return this.load().some((i) => i.id === id);
  },

  toggle(product: WishlistProduct): boolean {
    const items = this.load();
    const idx = items.findIndex((i) => i.id === product.id);
    if (idx >= 0) {
      items.splice(idx, 1);
      this.save(items);
      return false;
    } else {
      items.push(product);
      this.save(items);
      return true;
    }
  },

  count(): number {
    return this.load().length;
  },
};

export function initWishlistButtons(root: Document | HTMLElement = document): void {
  root.querySelectorAll<HTMLElement>('.product-card').forEach((card) => {
    if (card.querySelector('.wishlist-btn')) return;
    const id = card.dataset.id;
    if (!id) return;

    const btn = document.createElement('button');
    btn.className = 'wishlist-btn absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow transition';
    btn.setAttribute('aria-label', 'Add to wishlist');
    btn.setAttribute('title', 'Add to wishlist');
    btn.innerHTML = WishlistService.has(id)
      ? '<i class="fa-solid fa-heart text-[#c37989] text-sm"></i>'
      : '<i class="fa-regular fa-heart text-gray-400 text-sm hover:text-[#c37989]"></i>';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const product: WishlistProduct = {
        id: card.dataset.id ?? '',
        name: card.dataset.name ?? '',
        subtitle: card.dataset.subtitle ?? '',
        price: parseFloat(card.dataset.price ?? '0') || 0,
        image: card.dataset.image ?? (card.querySelector('img') as HTMLImageElement | null)?.src ?? '',
        color: card.dataset.color ?? '',
      };
      const added = WishlistService.toggle(product);
      btn.innerHTML = added
        ? '<i class="fa-solid fa-heart text-[#c37989] text-sm"></i>'
        : '<i class="fa-regular fa-heart text-gray-400 text-sm hover:text-[#c37989]"></i>';
      btn.setAttribute('title', added ? 'Remove from wishlist' : 'Add to wishlist');
      showToast(added ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist.`);
    });

    const imgEl = card.querySelector('img');
    if (imgEl?.parentElement) {
      imgEl.parentElement.style.position = 'relative';
      imgEl.parentElement.appendChild(btn);
    } else {
      card.style.position = 'relative';
      card.appendChild(btn);
    }
  });
}
