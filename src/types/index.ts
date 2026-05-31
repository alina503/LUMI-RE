export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description?: string;
  price: number;
  image: string;
  images?: string[];
  color: string;
  sizes: string[];
  promo?: string;
  category: ProductCategory;
}

export type ProductCategory =
  | 'new-in'
  | 'bras'
  | 'panties'
  | 'lingerie'
  | 'sleepwear'
  | 'activewear'
  | 'beauty'
  | 'accessories'
  | 'swim'
  | 'edit'
  | 'atelier';

export interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  color: string;
  size: string;
  promo?: string;
  key: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
  promoApplied: boolean;
}

/** Shared shape for both nav and brand-nav items */
export interface NavigationItem {
  label: string;
  href: string;
  key: string;
}

export type BrandNavigationItem = NavigationItem;

/** Minimal product shape used by search results and dynamically rendered cards */
export interface SearchResult {
  id: string;
  name: string;
  subtitle: string;
  description?: string;
  price: number;
  image: string;
  color: string;
  sizes: string[];
  promo?: string;
  category?: ProductCategory;
}

export interface ToastOptions {
  message: string;
  duration?: number;
  cartLink?: boolean;
}

export interface NewsletterFormData {
  name: string;
  email: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}
