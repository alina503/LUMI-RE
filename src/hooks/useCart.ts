import type { CartItem } from '../types';
import { cartStore } from '../store/cartStore';

export interface UseCart {
  add(product: Omit<CartItem, 'key' | 'qty'>, qty?: number): void;
  remove(key: string): void;
  setQty(key: string, qty: number): void;
  applyPromo(code: string): boolean;
  getTotalCount(): number;
  getSummary(): ReturnType<typeof cartStore.getSummary>;
  getItems(): CartItem[];
}

function createCart(): UseCart {
  function add(product: Omit<CartItem, 'key' | 'qty'>, qty = 1): void {
    cartStore.add(product, qty);
  }

  function remove(key: string): void {
    cartStore.remove(key);
  }

  function setQty(key: string, qty: number): void {
    cartStore.setQty(key, qty);
  }

  function applyPromo(code: string): boolean {
    return cartStore.applyPromo(code);
  }

  function getTotalCount(): number {
    return cartStore.getTotalCount();
  }

  function getSummary() {
    return cartStore.getSummary();
  }

  function getItems(): CartItem[] {
    return cartStore.getState().items;
  }

  return { add, remove, setQty, applyPromo, getTotalCount, getSummary, getItems };
}

export const cart = createCart();
