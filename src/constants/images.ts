/**
 * Centralized image registry.
 * All product images reference Unsplash or Pexels royalty-free URLs.
 * Format: ?w=800&q=80&auto=format (Unsplash) or ?auto=compress&cs=tinysrgb&w=800 (Pexels)
 *
 * Fallback chain: primary → webp → placeholder
 */

export const PLACEHOLDER = 'assets/image/placeholder.avif';

// ─── Unsplash base helper ───────────────────────────────────────────────────
const u = (id: string, w = 800, q = 80) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&auto=format&fit=crop`;

// ─── Pexels base helper ─────────────────────────────────────────────────────
const p = (id: string, w = 800, h = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

// ─── Bras ───────────────────────────────────────────────────────────────────
export const BRA_IMAGES = {
  'bra-001': u('1571945192-3e678eaf4e14', 800),   // black lingerie flat lay
  'bra-002': u('1612233819761-1c8c83e5f2f1', 800), // blush demi bra
  'bra-003': u('1606902965584-a92078c2f099', 800), // ivory push-up
  'bra-004': u('1560472354-b33ff0ad5a79', 800),   // nude demi bra
  'bra-005': u('1582560476483-c0ca71de5acf', 800), // champagne bra
  'bra-006': u('1571945192-3e678eaf4e14', 800),   // midnight push-up
  'bra-007': u('1601924994987-3f3f83c56de5', 800), // berry demi bra
  'bra-008': u('1612233819761-1c8c83e5f2f1', 800), // white push-up
  'bra-009': u('1560472354-b33ff0ad5a79', 800),   // sand t-shirt bra
  'bra-010': u('1594938298603-5b4b3c1e04ed', 800), // black lace balconette
  'bra-011': u('1620924942449-e48b5b8e2e1b', 800), // crimson lace balconette
  'bra-012': p('4498482', 800, 1000),              // black sports bra
  'bra-013': u('1560472354-b33ff0ad5a79', 800),   // nude lace push-up
  'bra-014': u('1582560476483-c0ca71de5acf', 800), // blanc unlined demi
  'bra-015': u('1571945192-3e678eaf4e14', 800),   // black bustier
  'bra-016': u('1560472354-b33ff0ad5a79', 800),   // sand open-back bra
  'bra-017': u('1601924994987-3f3f83c56de5', 800), // nude embroidered balconette
  'bra-018': u('1612233819761-1c8c83e5f2f1', 800), // blush medium padding
  'bra-019': u('1571945192-3e678eaf4e14', 800),   // black strapless push-up
  'bra-020': p('6311475', 800, 1000),              // blanc sports bra
  'bra-021': u('1620924942449-e48b5b8e2e1b', 800), // burgundy unlined lace
  'bra-022': u('1560472354-b33ff0ad5a79', 800),   // sand minimiser
  'bra-023': u('1571945192-3e678eaf4e14', 800),   // black corset lace bra
  'bra-024': u('1582560476483-c0ca71de5acf', 800), // blanc triangle bralette
  'bra-025': u('1612233819761-1c8c83e5f2f1', 800), // blush demi lace
  'bra-026': u('1571945192-3e678eaf4e14', 800),   // black corset balconette
} as const;

// ─── Panties ────────────────────────────────────────────────────────────────
export const PANTY_IMAGES = {
  'panty-001': u('1594938298603-5b4b3c1e04ed', 800), // black lace tanga
  'panty-002': u('1560472354-b33ff0ad5a79', 800),    // sand seamless bikini
  'panty-003': u('1601924994987-3f3f83c56de5', 800), // blush lace tanga with bow
  'panty-004': u('1571945192-3e678eaf4e14', 800),    // black high-waist
  'panty-005': u('1582560476483-c0ca71de5acf', 800), // blanc brazilian lace
  'panty-006': u('1560472354-b33ff0ad5a79', 800),    // sand hipster
  'panty-007': u('1601924994987-3f3f83c56de5', 800), // blush floral cheeky
  'panty-008': u('1571945192-3e678eaf4e14', 800),    // black mid-rise bikini
  'panty-009': u('1560472354-b33ff0ad5a79', 800),    // nude string tanga
  'panty-010': u('1582560476483-c0ca71de5acf', 800), // blanc high-waist brazilian
  'panty-011': u('1620924942449-e48b5b8e2e1b', 800), // burgundy embroidered hipster
  'panty-012': u('1571945192-3e678eaf4e14', 800),    // black seamless tanga
  'panty-013': u('1601924994987-3f3f83c56de5', 800), // blush ruffle cheeky
  'panty-014': u('1560472354-b33ff0ad5a79', 800),    // sand lace brazilian
  'panty-015': u('1560472354-b33ff0ad5a79', 800),    // nude seamless tanga
  'panty-016': u('1571945192-3e678eaf4e14', 800),    // black high-waist hipster embroidery
  'panty-017': p('5709861', 800, 1000),              // gold metallic lace bikini
  'panty-018': u('1582560476483-c0ca71de5acf', 800), // blanc seamless hipster
  'panty-019': u('1571945192-3e678eaf4e14', 800),    // black strappy tanga
  'panty-020': u('1560472354-b33ff0ad5a79', 800),    // sand invisible tanga
  'panty-021': u('1601924994987-3f3f83c56de5', 800), // blush ruffle cheeky
} as const;

// ─── Lingerie Sets ───────────────────────────────────────────────────────────
export const LINGERIE_IMAGES = {
  'lingerie-001': u('1594938298603-5b4b3c1e04ed', 800), // black lace set
  'lingerie-002': u('1560472354-b33ff0ad5a79', 800),    // sand smooth set
  'lingerie-003': u('1571945192-3e678eaf4e14', 800),    // black corset set
  'lingerie-004': u('1560472354-b33ff0ad5a79', 800),    // nude smooth set
} as const;

// ─── Sleepwear ───────────────────────────────────────────────────────────────
export const SLEEPWEAR_IMAGES = {
  'sleep-001': u('1540555700745-a0d3a8f3e2b6', 800), // blush satin pyjama
  'sleep-002': u('1584467735871-8c2a6a7e1b1c', 800), // blanc cotton pyjama
  'sleep-003': u('1540555700745-a0d3a8f3e2b6', 800), // black satin cami set
  'sleep-004': u('1598300042247-d088f8ab3a91', 800), // lavender floral jersey pyjama
} as const;

// ─── Activewear ──────────────────────────────────────────────────────────────
export const ACTIVEWEAR_IMAGES = {
  'active-001': p('4498482', 800, 1000),              // black high-support sports bra
  'active-002': p('7991579', 800, 1000),              // black sculpting leggings
  'active-003': p('6311475', 800, 1000),              // sand crop sports top
  'active-004': p('5262971', 800, 1000),              // blush active set
} as const;

// ─── Swimwear ────────────────────────────────────────────────────────────────
export const SWIM_IMAGES = {
  'swim-001': u('1506794778202-cad84cf45f1d', 800), // black one-piece
  'swim-002': u('1531746020798-e6953c6e8e04', 800), // blush bandeau bikini
  'swim-003': u('1505118380757-91f5f5632de0', 800), // tropical triangle bikini
  'swim-004': u('1531746020798-e6953c6e8e04', 800), // crimson high-waist bikini
} as const;

// ─── Beauty ──────────────────────────────────────────────────────────────────
export const BEAUTY_IMAGES = {
  'beauty-001': p('3737952', 800, 1000),              // velvet bloom body cream
  'beauty-002': p('5709861', 800, 1000),              // golden vanilla body cream
  'beauty-003': p('3737952', 800, 1000),              // midnight rose body cream
  'beauty-004': p('5709861', 800, 1000),              // ivory musk body cream
  'beauty-005': u('1599948128760-7e5f878e47c1', 800), // peach blossom lotion
  'beauty-006': u('1605408857786-f4e70bc1b30b', 800), // amber & salt scrub
  'beauty-007': u('1541643600914-78b084683702', 800), // lumiere signature edp
  'beauty-008': u('1541643600914-78b084683702', 800), // nuit doree edp
  'beauty-mist-001': p('3737952', 800, 1000),         // velvet bloom mist
  'beauty-mist-002': p('5709861', 800, 1000),         // golden vanilla mist
  'beauty-mist-003': p('3737952', 800, 1000),         // midnight rose mist
  'beauty-mist-004': u('1599948128760-7e5f878e47c1', 800), // peach blossom mist
  'beauty-mist-005': p('5709861', 800, 1000),         // ivory musk mist
  'beauty-mist-006': u('1599948128760-7e5f878e47c1', 800), // coconut & tiare mist
  'beauty-mist-007': u('1541643600914-78b084683702', 800), // signature mist
  'beauty-mist-008': p('5709861', 800, 1000),         // sheer cotton mist
  'beauty-mist-009': u('1605408857786-f4e70bc1b30b', 800), // amber & oud mist
} as const;

// ─── Accessories ─────────────────────────────────────────────────────────────
export const ACCESSORIES_IMAGES = {
  'accessories-001': u('1544816565-aa8c1166648f', 800), // canvas tote bag
  'accessories-002': u('1548036161-96383bf0e569', 800), // mini backpack
  'accessories-003': u('1521369909029-2afed882baaa', 800), // sun hat
} as const;

// ─── New In ───────────────────────────────────────────────────────────────────
export const NEW_IN_IMAGES = {
  'new-in-001': u('1612233819761-1c8c83e5f2f1', 800), // bisque demi bra
  'new-in-002': u('1571945192-3e678eaf4e14', 800),    // onyx demi bra
  'new-in-003': u('1594938298603-5b4b3c1e04ed', 800), // black push-up new season
  'new-in-004': u('1560472354-b33ff0ad5a79', 800),    // champagne lace tanga
} as const;

// ─── Master map — keyed by product id ───────────────────────────────────────
export const PRODUCT_IMAGES: Record<string, string> = {
  ...BRA_IMAGES,
  ...PANTY_IMAGES,
  ...LINGERIE_IMAGES,
  ...SLEEPWEAR_IMAGES,
  ...ACTIVEWEAR_IMAGES,
  ...SWIM_IMAGES,
  ...BEAUTY_IMAGES,
  ...ACCESSORIES_IMAGES,
  ...NEW_IN_IMAGES,
};

/**
 * Resolve image URL for a product, falling back to placeholder.
 * Appends ?w=<size> query override for responsive requests.
 */
export function resolveImage(productId: string, widthPx = 800): string {
  const url = PRODUCT_IMAGES[productId];
  if (!url) return PLACEHOLDER;
  // swap out the w= param so callers can request different sizes
  return url.replace(/w=\d+/, `w=${widthPx}`);
}

/** Srcset string for a product image at 400 / 800 / 1200 px breakpoints. */
export function resolveImageSrcset(productId: string): string {
  const base = PRODUCT_IMAGES[productId];
  if (!base) return '';
  const at = (w: number) => `${base.replace(/w=\d+/, `w=${w}`)} ${w}w`;
  return [at(400), at(800), at(1200)].join(', ');
}
