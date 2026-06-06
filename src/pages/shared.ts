import { initHeader } from '../layouts/Header';
import { initSearchOverlay } from '../layouts/SearchOverlay';
import { initSizeButtons } from '../components/ui/SizeButton';
import { initPageProductCards } from '../components/features/ProductCard';
import { initProductModal } from '../components/features/ProductModal';
import { injectToast } from '../components/ui/Toast';
import { initAuthHeader, initNewsletterFooter } from '../services/authService';
import { initWishlistButtons } from '../services/wishlistService';

function runSharedInit(): void {
  injectToast();
  initHeader();
  initAuthHeader();
  initNewsletterFooter();
  initSizeButtons();
  initProductModal();
  initPageProductCards();
  initWishlistButtons();
  initSearchOverlay();
}

export function initSharedPage(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSharedInit, { once: true });
  } else {
    runSharedInit();
  }
}
