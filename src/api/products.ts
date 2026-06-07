import type { Product, ProductCategory } from '../types';

let _cache: Product[] | null = null;

export async function fetchProducts(category?: ProductCategory): Promise<Product[]> {
  if (!_cache) {
    const res = await fetch(`${import.meta.env.BASE_URL}data/products.json`);
    if (!res.ok) throw new Error('Failed to load products');
    _cache = (await res.json()) as Product[];
  }

  if (!category) return _cache;
  return _cache.filter((p) => p.category === category);
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id);
}

export function clearProductCache(): void {
  _cache = null;
}
