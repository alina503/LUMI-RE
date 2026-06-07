import '../styles/index.css';
import { STORAGE_KEYS } from '../constants/config';
import { initHeader } from '../layouts/Header';
import { initSearchOverlay } from '../layouts/SearchOverlay';
import { injectToast } from '../components/ui/Toast';
import { renderCartItem } from '../components/features/CartItem';
import { renderCartSummary, initPromoCode } from '../components/features/CartSummary';
import { cart } from '../hooks/useCart';
import { PROMO_CODES } from '../constants/config';

function init(): void {
  injectToast();
  initHeader();
  initSearchOverlay();

  function renderCart(): void {
    const items = cart.getItems();
    const container = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');

    if (!container || !emptyCart) return;
    container.innerHTML = '';

    if (items.length === 0) {
      emptyCart.classList.remove('hidden');
    } else {
      emptyCart.classList.add('hidden');
      items.forEach((item) => {
        const el = renderCartItem(
          item,
          (key) => { cart.remove(key); renderCart(); },
          (key, qty) => { cart.setQty(key, qty); renderCart(); },
        );
        container.appendChild(el);
      });
    }

    renderCartSummary(cart.getSummary());
  }

  initPromoCode((code) => {
    const upper = code.toUpperCase();
    const discountRate = PROMO_CODES[upper];
    const success = cart.applyPromo(code);
    if (success) renderCartSummary(cart.getSummary());
    return { success, discountRate };
  });

  renderCart();

  initCrossTabSync(renderCart);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

function initCrossTabSync(onExternalChange: () => void): void {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.cart || e.key === STORAGE_KEYS.cartState) {
      onExternalChange();
    }
  });
}
