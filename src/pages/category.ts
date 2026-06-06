import { initSharedPage } from './shared';
import { fetchProducts } from '../api/products';
import { renderProductCard } from '../components/features/ProductCard';
import type { ProductCategory } from '../types';

initSharedPage();

async function loadCategoryProducts(): Promise<void> {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const category = grid.dataset.category as ProductCategory | undefined;
  if (!category) return;

  try {
    const products = await fetchProducts(category);

    const countEl = document.getElementById('product-count');
    if (countEl) countEl.textContent = `${products.length} products`;

    grid.innerHTML = '';
    for (const product of products) {
      const card = renderProductCard(product);
      // Name click → product detail page
      const nameEl = card.querySelector<HTMLElement>('.product-name');
      if (nameEl) {
        nameEl.addEventListener('click', () => {
          window.location.href = `produs.html?id=${product.id}`;
        });
      }
      grid.appendChild(card);
    }
  } catch {
    const grid2 = document.getElementById('product-grid');
    if (grid2) grid2.innerHTML = '<p class="col-span-full text-center text-gray-400 py-20">Failed to load products.</p>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCategoryProducts, { once: true });
} else {
  loadCategoryProducts();
}
