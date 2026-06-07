/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './src/**/*.{ts,js}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /*
       * Semantic color aliases — reference CSS custom properties from tokens.css.
       * Use these in HTML: bg-brand  text-plum  border-rose  bg-pink-hero  etc.
       * Never write raw hex values in HTML or TS — all colour decisions live in tokens.css.
       */
      colors: {
        /* Brand */
        brand:        'var(--lum-plum-500)',
        'brand-dark': 'var(--lum-plum-700)',
        plum:         'var(--lum-plum-700)',
        rose:         'var(--lum-rose-400)',

        /* Warm surfaces */
        blush:        'var(--lum-blush)',
        nav:          'var(--lum-nav)',
        champagne:    'var(--lum-champagne)',
        'champagne-dark': 'var(--lum-champagne-dark)',

        /* Pink sub-brand (PINK collection page) */
        'pink-hero':  'var(--lum-pink-hero)',
        'pink-dark':  'var(--lum-pink-dark)',
        'pink-darker':'var(--lum-pink-darker)',
        'pink-light': 'var(--lum-pink-light)',
        'pink-border':'var(--lum-pink-border)',

        /* Socials */
        facebook:     'var(--lum-facebook)',

        /* Feedback */
        success:      'var(--lum-success)',
        error:        'var(--lum-error)',
        warning:      'var(--lum-warning)',

        /* Deep dark neutral */
        ink:          'var(--lum-ink)',
      },
      fontFamily: {
        sans:  ['var(--lum-font-sans)'],
        serif: ['var(--lum-font-serif)'],
      },
      screens: {
        xs:   '480px',
        sm:   '640px',
        md:   '768px',
        lg:   '1024px',
        xl:   '1280px',
        '2xl':'1536px',
      },
      maxWidth: {
        form:    'var(--lum-form-max-width)',
        sidebar: 'var(--lum-sidebar-width)',
      },
      /*
       * Spacing: use Tailwind's built-in scale (4 / 8 / 12 … 96).
       * Only add values that the built-in scale genuinely cannot express.
       */
      spacing: {
        '18': '4.5rem',   /* 72px — hero top-padding, tall header clearance */
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-lum': 'cubic-bezier(0, 0, 0.2, 1)',
        'spring':       'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
};
