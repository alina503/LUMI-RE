# LUMIÈRE — Lingerie E-Commerce Storefront

A fully responsive, multi-page e-commerce storefront built from scratch in **vanilla TypeScript** with zero framework dependencies. Demonstrates production-grade frontend architecture: observable state management, Web Crypto authentication, lazy image loading, and a clean service/component separation.

**[Live Demo](https://alina503.github.io/victoria.secret.clone/)**

---

## Features

- Product catalog across 9 categories — Bras, Panties, Lingerie, Sleepwear, Activewear, Beauty, Accessories, Swim, New In
- Product detail page with image gallery, size selection, and quantity controls
- Shopping cart with promo codes, real-time order summary, and cross-tab sync via `storage` events
- Wishlist with persistent localStorage storage
- User authentication — register, login, logout, account page with order history
- Live search overlay with 180ms debounce, trending tags, and category-scoped filtering
- Responsive, mobile-first layout across all pages
- Lazy image loading with `IntersectionObserver` and blur-up reveal animation

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5 (strict mode) |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v4 (PostCSS build, tree-shaken) + CSS custom properties |
| Auth | Web Crypto API — SHA-256 + per-user random salt via `crypto.subtle` |
| State | Observable cart store (custom observer pattern, no library) |
| Icons | Font Awesome 6 |
| Deployment | GitHub Pages |

## Architecture

```
src/
├── components/
│   ├── features/     # ProductCard, ProductModal, CartItem, CartSummary
│   └── ui/           # Toast, SizeButton, CartBadge, ProductImage
├── constants/        # config, navigation, images, routes
├── hooks/            # useCart, useModal, useToast
├── layouts/          # Header, SearchOverlay, NewsletterModal
├── lib/              # safe localStorage wrappers with QuotaExceededError handling
├── pages/            # one TypeScript entry file per HTML page
├── services/         # authService, cartService, wishlistService, searchService
├── styles/           # Tailwind entry, design tokens (CSS vars), base reset, components
├── types/            # centralized TypeScript interfaces
└── utils/            # dom helpers, formatters, validation, debounce
```

**Key pattern — observable cart store:**
A singleton with `subscribe()` keeps the header badge, cart page, and toast notifications in sync without any framework or external state library.

```ts
cartStore.subscribe(() => updateCartBadge(cartStore.getTotalCount()));
```

## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
npm run type-check  # TypeScript validation only
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## Design Decisions

- **No framework** — demonstrates understanding of the DOM API, event delegation, module architecture, and state management patterns without framework abstractions
- **Web Crypto API** — passwords hashed client-side with SHA-256 + per-user random salt; no third-party crypto dependency
- **Tailwind v4 PostCSS build** — CSS is tree-shaken at build time; the CDN version is never used in production
- **MPA over SPA** — each page is a separate HTML file with its own TypeScript entry point, keeping initial load times low

## Known Limitations

Frontend-only demo — there is no backend:

- Auth uses localStorage (no JWT or server-side sessions)
- Cart and wishlist data are browser-local — clearing storage resets them
- Payment UI is decorative — no real gateway is connected
- Ratings are static — no review system

## License

MIT — built for portfolio and educational purposes.
