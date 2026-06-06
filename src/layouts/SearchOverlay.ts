import { loadAllProducts, filterProducts } from '../services/searchService';
import { formatPrice } from '../utils/formatters';
import { sanitizeText } from '../utils/helpers';
import { debounce } from '../utils/helpers';
import { ROUTES } from '../constants/routes';

const s = sanitizeText;

const TRENDING = [
  { label: 'Bras', href: ROUTES.bras },
  { label: 'Lingerie', href: ROUTES.lingerie },
  { label: 'New In', href: ROUTES.newIn },
  { label: 'Swim', href: ROUTES.swim },
  { label: 'Beauty', href: ROUTES.beauty },
  { label: 'Sleepwear', href: ROUTES.sleepwear },
];

export function initSearchOverlay(): void {
  const overlay = document.getElementById('search-overlay');
  const toggleBtn = document.getElementById('search-toggle');

  if (!overlay || !toggleBtn) return;

  // ── inject VS-style shell ──────────────────────────────────────────────────
  overlay.className = 'search-overlay-anim';
  overlay.style.cssText = 'display:none;position:fixed;inset:0;z-index:1000;background:#fff;flex-direction:column;overflow-y:auto;';

  overlay.innerHTML = `
    <div class="search-header" style="position:sticky;top:0;background:#fff;z-index:10;border-bottom:1px solid #f3f4f6;">
      <div style="max-width:960px;margin:0 auto;padding:1.25rem 1.5rem;display:flex;align-items:center;gap:1rem;">
        <i class="fa-solid fa-magnifying-glass" style="color:#9ca3af;font-size:1.125rem;flex-shrink:0;"></i>
        <input
          id="search-input"
          type="text"
          placeholder="Search for styles, collections, colours…"
          style="flex:1;font-size:clamp(1rem,3vw,1.5rem);font-weight:300;outline:none;border:none;color:#111;letter-spacing:0.02em;"
          autocomplete="off"
          spellcheck="false"
        />
        <button id="search-close" style="display:flex;align-items:center;gap:0.25rem;font-size:0.7rem;letter-spacing:0.15em;color:#6b7280;background:none;border:none;cursor:pointer;flex-shrink:0;">
          CLOSE <i class="fa-solid fa-xmark" style="font-size:1rem;margin-left:0.25rem;"></i>
        </button>
      </div>
    </div>

    <div style="max-width:960px;margin:0 auto;padding:2rem 1.5rem;width:100%;">
      <div id="search-trending">
        <p style="font-size:0.65rem;letter-spacing:0.2em;color:#9ca3af;text-transform:uppercase;margin-bottom:1.25rem;">Trending</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
          ${TRENDING.map((t) => `<a href="${t.href}" class="search-trend-pill">${t.label.toUpperCase()}</a>`).join('')}
        </div>
      </div>

      <div id="search-results" style="display:none;">
        <p id="search-count" style="font-size:0.65rem;letter-spacing:0.2em;color:#9ca3af;text-transform:uppercase;margin-bottom:1.5rem;"></p>
        <div id="search-cards" class="search-cards-grid"></div>
      </div>

      <div id="search-empty" style="display:none;text-align:center;padding:5rem 0;">
        <i class="fa-regular fa-face-frown" style="font-size:2rem;color:#d1d5db;display:block;margin-bottom:1rem;"></i>
        <p style="font-size:0.875rem;color:#9ca3af;">No results found.</p>
        <p style="font-size:0.75rem;color:#d1d5db;margin-top:0.25rem;">Try a different keyword or browse a category above.</p>
      </div>
    </div>`;

  // re-grab elements after innerHTML replacement
  const newInput = overlay.querySelector<HTMLInputElement>('#search-input')!;
  const newClose = overlay.querySelector<HTMLButtonElement>('#search-close')!;
  const trendingEl = overlay.querySelector<HTMLElement>('#search-trending')!;
  const resultsWrapper = overlay.querySelector<HTMLElement>('#search-results')!;
  const cardsEl = overlay.querySelector<HTMLElement>('#search-cards')!;
  const countEl = overlay.querySelector<HTMLElement>('#search-count')!;
  const newEmpty = overlay.querySelector<HTMLElement>('#search-empty')!;

  let isOpen = false;

  function openOverlay(): void {
    overlay!.style.display = 'flex';
    requestAnimationFrame(() => overlay!.classList.add('search-open'));
    isOpen = true;
    document.body.style.overflow = 'hidden';
    setTimeout(() => newInput.focus(), 50);
  }

  function closeOverlay(): void {
    overlay!.classList.remove('search-open');
    setTimeout(() => {
      overlay!.style.display = 'none';
      newInput.value = '';
      showTrending();
    }, 250);
    isOpen = false;
    document.body.style.overflow = '';
  }

  function showTrending(): void {
    trendingEl.style.display = 'block';
    resultsWrapper.style.display = 'none';
    newEmpty.style.display = 'none';
    cardsEl.innerHTML = '';
  }

  function renderResults(matches: Awaited<ReturnType<typeof filterProducts>>): void {
    trendingEl.style.display = 'none';
    cardsEl.innerHTML = '';

    if (matches.length === 0) {
      resultsWrapper.style.display = 'none';
      newEmpty.style.display = 'block';
      return;
    }

    newEmpty.style.display = 'none';
    resultsWrapper.style.display = 'block';
    countEl.textContent = `${matches.length} result${matches.length !== 1 ? 's' : ''}`;

    matches.slice(0, 12).forEach((p) => {
      const card = document.createElement('a');
      card.href = `${import.meta.env.BASE_URL}produs.html?id=${s(p.id)}`;
      card.className = 'search-result-card';
      card.innerHTML = `
        <div class="search-result-img-wrap">
          <img
            src="${s(p.image)}"
            alt="${s(p.name)}"
            class="search-result-img"
            loading="lazy"
            onerror="this.src='assets/image/placeholder.avif'"
          />
        </div>
        <div style="display:flex;flex-direction:column;gap:2px;margin-top:0.5rem;">
          <p class="search-result-name">${s(p.name)}</p>
          <p style="font-size:0.72rem;color:#9ca3af;">${s(p.subtitle)}</p>
          <p style="font-size:0.75rem;font-weight:500;margin-top:2px;">${formatPrice(p.price)}</p>
        </div>`;
      cardsEl.appendChild(card);
    });
  }

  const pageCategory = document.getElementById('product-grid')?.dataset.category ?? null;

  let allProducts: Awaited<ReturnType<typeof loadAllProducts>> = [];
  loadAllProducts()
    .then((products) => {
      allProducts = products;
      const q = newInput.value.trim();
      if (q) handleInput();
    })
    .catch(() => {});

  const handleInput = debounce(() => {
    const q = newInput.value.trim();
    if (!q) { showTrending(); return; }
    if (allProducts.length === 0) return;
    const pool = pageCategory
      ? allProducts.filter((p) => p.category === pageCategory)
      : allProducts;
    const matches = filterProducts(pool, q);
    renderResults(matches);
  }, 180);

  newInput.addEventListener('input', handleInput);
  toggleBtn.addEventListener('click', openOverlay);
  newClose.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closeOverlay(); });
}
