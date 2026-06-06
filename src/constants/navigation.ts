import type { NavigationItem, BrandNavigationItem } from '../types';
import { ROUTES } from './routes';

export const BRAND_NAV: BrandNavigationItem[] = [
  { key: 'lumiere', label: 'LUMIÈRE', href: ROUTES.home },
  { key: 'atelier', label: 'ATELIER', href: ROUTES.atelier },
  { key: 'beauty', label: 'BEAUTY', href: ROUTES.beauty },
];

export const CATEGORY_NAV: NavigationItem[] = [
  { key: 'new-in', label: 'NEW IN', href: ROUTES.newIn },
  { key: 'bras', label: 'BRAS', href: ROUTES.bras },
  { key: 'panties', label: 'PANTIES', href: ROUTES.panties },
  { key: 'lingerie', label: 'LINGERIE', href: ROUTES.lingerie },
  { key: 'sleepwear', label: 'SLEEPWEAR', href: ROUTES.sleepwear },
  { key: 'activewear', label: 'ACTIVEWEAR', href: ROUTES.activewear },
  { key: 'beauty', label: 'BEAUTY', href: ROUTES.beauty },
  { key: 'accessories', label: 'ACCESSORIES', href: ROUTES.accessories },
  { key: 'swim', label: 'SWIM', href: ROUTES.swim },
  { key: 'edit', label: 'THE EDIT', href: ROUTES.edit },
];

export const FOOTER_NAV = {
  help: [
    { label: 'FAQ', href: '#' },
    { label: 'Our Boutiques', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
  info: [
    { label: 'Shipping & Payment', href: '#' },
    { label: 'Returns & Claims', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Returns Form', href: '#' },
  ],
  support: [
    { label: 'My Account', href: '#' },
    { label: 'Wishlist', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Promotions', href: '#' },
    { label: 'Returns & Claims', href: '#' },
  ],
} as const;
