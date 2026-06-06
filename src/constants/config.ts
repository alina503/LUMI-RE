export const APP_CONFIG = {
  name: 'LUMIÈRE',
  tagline: 'Wear your story.',
  currency: 'lei',
  locale: 'ro-RO',
  instagramHandle: '@LUMIERE.LINGERIE',
  copyright: '© 2025 Lumière. All Rights Reserved.',
} as const;

export const SHIPPING_CONFIG = {
  freeThreshold: 269,
  standardCost: 20,
  currency: 'lei',
} as const;

export const CART_CONFIG = {
  maxQty: 99,
} as const;

export const STORAGE_KEYS = {
  cart:       'lumiere_cart',
  cartState:  'lumiere_cart_state',
  session:    'vs_user',
  users:      'vs_users',
  wishlist:   'vs_wishlist',
  newsletter: 'vs_newsletter',
  orders:     (userId: number) => `vs_orders_${userId}`,
} as const;

export const PROMO_CODES: Record<string, number> = {
  LUM10: 0.1,
  LUM15: 0.15,
  LUM20: 0.2,
};

export const TOAST_DURATION = 3000;
export const SIZE_ERROR_DURATION = 1500;
