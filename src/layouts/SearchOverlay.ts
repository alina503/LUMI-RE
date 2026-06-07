import { loadAllProducts, filterProducts } from '../services/searchService';
import { formatPrice } from '../utils/formatters';
import { sanitizeText, debounce } from '../utils/helpers';
import { ROUTES } from '../constants/routes';
import { lockScroll, unlockScroll } from '../hooks/useModal';

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

  // ── Inject overlay shell using design system classes ──────────────────────
  overlay.className = 'search-overlay-anim';
  overlay.style.cssText = 'display:none;position:fixed;inset:0;z-index:var(--lum-z-modal);background:var(--lum-white);flex-direction:column;overflow-y:auto;';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Search');

  overlay.innerHTML = `
    <div class="search-header" style="position:sticky;top:0;background:var(--lum-white);z-index:var(--lum-z-sticky);border-bottom:1px solid var(--lum-gray-100);">
      <div style="max-width:960px;margin:0 auto;padding:var(--lum-space-5) var(--lum-space-6);display:flex;align-items:center;gap:var(--lum-space-4);">
        <i class="fa-solid fa-magnifying-glass" style="color:var(--lum-gray-400);font-size:1.125rem;flex-shrink:0;" aria-hidden="true"></i>
        <input
          id="search-input"
          type="text"
          placeholder="Search for styles, collections, colours…"
          aria-label="Search products"
          style="flex:1;font-size:clamp(1rem,3vw,1.5rem);font-weight:300;outline:none;border:none;color:var(--lum-black);letter-spacing:var(--lum-tracking-normal);"
          autocomplete="off"
          spellcheck="false"
        />
        <button id="search-close"
          aria-label="Close search"
          style="display:flex;align-items:center;gap:0.25rem;font-size:var(--lum-text-xs);letter-spacing:var(--lum-tracking-widest);color:var(--lum-gray-500);background:none;border:none;cursor:pointer;flex-shrink:0;text-transform:uppercase;transition:color var(--lum-duration-150);">
          CLOSE <i class="fa-solid fa-xmark" style="font-size:1rem;margin-left:0.25rem;" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <div style="max-width:960px;margin:0 auto;padding:var(--lum-space-8) var(--lum-space-6);width:100%;">
      <div id="search-trending">
        <p class="section-eyebrow" style="margin-bottom:var(--lum-space-5);">Trending</p>
        <div style="display:flex;flex-wrap:wrap;gap:var(--lum-space-3);">
          ${TRENDING.map((t) => `<a href="${t.href}" class="search-trend-pill">${t.label.toUpperCase()}</a>`).join('')}
        </div>
      </div>

      <div id="search-results" style="display:none;">
        <p id="search-count" class="section-eyebrow" style="margin-bottom:var(--lum-space-6);"></p>
        <div id="search-cards" class="search-cards-grid"></div>
      </div>

      <div id="search-empty" class="empty-state" style="display:none;">
        <i class="fa-regular fa-face-frown empty-state__icon" aria-hidden="true"></i>
        <p class="empty-state__title">No results found.</p>
        <p class="empty-state__description">Try a different keyword or browse a category above.</p>
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
  let closing = false;

  function openOverlay(): void {
    if (isOpen) return;
    closing = false;
    overlay!.style.display = 'flex';
    requestAnimationFrame(() => overlay!.classList.add('search-open'));
    isOpen = true;
    lockScroll();
    setTimeout(() => newInput.focus(), 50);
  }

  function closeOverlay(): void {
    if (!isOpen || closing) return;
    closing = true;
    overlay!.classList.remove('search-open');
    unlockScroll();
    setTimeout(() => {
      overlay!.style.display = 'none';
      newInput.value = '';
      showTrending();
      isOpen = false;
      closing = false;
      toggleBtn!.focus();
    }, 250);
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

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && isOpen) closeOverlay();
  }

  newInput.addEventListener('input', handleInput);
  toggleBtn.addEventListener('click', openOverlay);
  newClose.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', onKeyDown);
}
