import type { Product, SearchResult } from '../types';
import { resolveImage } from '../constants/images';

let _cache: SearchResult[] | null = null;

export async function loadAllProducts(): Promise<SearchResult[]> {
  if (_cache) return _cache;
  const res = await fetch(`${import.meta.env.BASE_URL}data/products.json`);
  const products: Product[] = await res.json();
  _cache = products.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    price: p.price,
    image: resolveImage(p.id) || p.image,
    color: p.color,
    sizes: p.sizes,
    promo: p.promo,
    category: p.category,
  }));
  return _cache;
}

export function filterProducts(products: SearchResult[], query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    `${p.name} ${p.subtitle} ${p.color} ${p.category}`.toLowerCase().includes(q),
  );
}

export function collectPageProducts(): SearchResult[] {
  const products: SearchResult[] = [];
  document.querySelectorAll<HTMLElement>('.product-card').forEach((card) => {
    const sizes = Array.from(card.querySelectorAll('.size-btn')).map(
      (b) => b.textContent?.trim() ?? '',
    );
    products.push({
      id: card.dataset.id ?? '',
      name: card.dataset.name ?? '',
      subtitle: card.dataset.subtitle ?? '',
      price: parseFloat(card.dataset.price ?? '0'),
      image: card.dataset.image ?? '',
      color: card.dataset.color ?? '',
      sizes,
    });
  });
  return products;
}
