// DEPRECATED: search is handled entirely by initSearchOverlay() in src/layouts/SearchOverlay.ts.
// This hook is never called and must not be called — it would attach duplicate listeners.
import type { SearchResult } from '../types';
import { collectPageProducts, filterProducts } from '../services/searchService';
import { renderProductCard } from '../components/features/ProductCard';
import { debounce } from '../utils/helpers';

export interface UseSearch {
  init(): void;
}

export function useSearch(): UseSearch {
  let products: SearchResult[] = [];

  function init(): void {
    products = collectPageProducts();

    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input') as HTMLInputElement | null;
    const toggleBtn = document.getElementById('search-toggle');
    const closeBtn = document.getElementById('search-close');
    const resultsEl = document.getElementById('search-results');
    const emptyEl = document.getElementById('search-empty');

    if (!overlay || !input || !toggleBtn || !closeBtn || !resultsEl || !emptyEl) return;

    toggleBtn.addEventListener('click', () => {
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      input.focus();
    });

    closeBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
      input.value = '';
      resultsEl.innerHTML = '';
      emptyEl.style.display = 'none';
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
        input.value = '';
        resultsEl.innerHTML = '';
        emptyEl.style.display = 'none';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.style.display !== 'none') {
        overlay.style.display = 'none';
        input.value = '';
        resultsEl.innerHTML = '';
        emptyEl.style.display = 'none';
      }
    });

    const handleInput = debounce(() => {
      const q = input.value.trim();
      resultsEl.innerHTML = '';

      if (!q) {
        emptyEl.style.display = 'none';
        return;
      }

      const matches = filterProducts(products, q);

      if (matches.length === 0) {
        emptyEl.style.display = 'block';
        return;
      }

      emptyEl.style.display = 'none';
      renderSearchResults(matches, resultsEl);
    }, 200);

    input.addEventListener('input', handleInput);
  }

  return { init };
}

function renderSearchResults(
  results: SearchResult[],
  container: HTMLElement,
): void {
  results.forEach((product) => {
    container.appendChild(renderProductCard(product));
  });
}
