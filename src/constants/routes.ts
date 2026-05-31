export const ROUTES = {
  home: 'index.html',
  cart: 'cart.html',
  login: 'login.html',
  register: 'inregistrare.html',
  atelier: 'atelier.html',
  beauty: 'beauty.html',
  newIn: 'new-in.html',
  bras: 'bras.html',
  panties: 'panties.html',
  lingerie: 'lingerie.html',
  sleepwear: 'sleepwear.html',
  activewear: 'activewear.html',
  accessories: 'accessories.html',
  swim: 'swim.html',
  edit: 'the-edit.html',
} as const;

export type RouteKey = keyof typeof ROUTES;
