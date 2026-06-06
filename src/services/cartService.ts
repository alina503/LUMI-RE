import type { CartItem, CartState, OrderSummary } from '../types';
import { storageGet, storageSet } from '../lib/storage';
import { CART_CONFIG, SHIPPING_CONFIG, PROMO_CODES, STORAGE_KEYS } from '../constants/config';
import { buildCartKey } from '../utils/formatters';
import { clamp } from '../utils/helpers';

const CART_STATE_KEY = STORAGE_KEYS.cartState;

export function loadCart(): CartItem[] {
  return storageGet<CartItem[]>(STORAGE_KEYS.cart, []);
}

export function saveCart(items: CartItem[]): void {
  storageSet(STORAGE_KEYS.cart, items);
}

export function loadCartState(): CartState {
  const saved = storageGet<Partial<CartState> | null>(CART_STATE_KEY, null);
  return {
    items: loadCart(),
    promoCode: saved?.promoCode ?? null,
    promoDiscount: saved?.promoDiscount ?? 0,
    promoApplied: saved?.promoApplied ?? false,
  };
}

export function saveCartState(state: CartState): void {
  storageSet(STORAGE_KEYS.cart, state.items);
  storageSet(CART_STATE_KEY, {
    promoCode: state.promoCode,
    promoDiscount: state.promoDiscount,
    promoApplied: state.promoApplied,
  });
}

export function addToCart(
  product: Omit<CartItem, 'key' | 'qty'>,
  qty = 1,
): CartItem[] {
  const items = loadCart();
  const key = buildCartKey(product.id, product.size, product.color);
  const existing = items.find((i) => i.key === key);

  if (existing) {
    existing.qty = clamp(existing.qty + qty, 1, CART_CONFIG.maxQty);
  } else {
    items.push({ ...product, key, qty });
  }

  saveCart(items);
  return items;
}

export function removeFromCart(key: string): CartItem[] {
  const items = loadCart().filter((i) => i.key !== key);
  saveCart(items);
  return items;
}

export function setCartItemQty(key: string, qty: number): CartItem[] {
  const items = loadCart();
  const item = items.find((i) => i.key === key);
  if (item) item.qty = clamp(qty, 1, CART_CONFIG.maxQty);
  saveCart(items);
  return items;
}

export function clearCart(): void {
  saveCart([]);
}

export function getTotalItems(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function calculateOrderSummary(
  items: CartItem[],
  promoCode: string | null,
): OrderSummary {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = getTotalItems(items);
  const shipping =
    subtotal > 0
      ? subtotal >= SHIPPING_CONFIG.freeThreshold
        ? 0
        : SHIPPING_CONFIG.standardCost
      : 0;

  const discountRate =
    promoCode && PROMO_CODES[promoCode.toUpperCase()]
      ? PROMO_CODES[promoCode.toUpperCase()]
      : 0;
  const discount = (subtotal + shipping) * discountRate;
  const total = subtotal + shipping - discount;

  return { subtotal, shipping, discount, total, itemCount };
}
