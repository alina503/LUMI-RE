import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  base: '/victoria.secret.clone/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        cart: resolve(__dirname, 'cart.html'),
        bras: resolve(__dirname, 'bras.html'),
        panties: resolve(__dirname, 'panties.html'),
        lingerie: resolve(__dirname, 'lingerie.html'),
        sleepwear: resolve(__dirname, 'sleepwear.html'),
        activewear: resolve(__dirname, 'activewear.html'),
        beauty: resolve(__dirname, 'beauty.html'),
        accessories: resolve(__dirname, 'accessories.html'),
        newIn: resolve(__dirname, 'new-in.html'),
        swim: resolve(__dirname, 'swim.html'),
        atelier: resolve(__dirname, 'atelier.html'),
        theEdit: resolve(__dirname, 'the-edit.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'inregistrare.html'),
        produs: resolve(__dirname, 'produs.html'),
        account: resolve(__dirname, 'contul-meu.html'),
        wishlist: resolve(__dirname, 'lista-de-dorinte.html'),
        pink: resolve(__dirname, 'pink.html'),
        vsNow: resolve(__dirname, 'vs-now.html'),
        confirmare: resolve(__dirname, 'confirmare-comanda.html'),
        contact: resolve(__dirname, 'contact.html'),
        faq: resolve(__dirname, 'faq.html'),
        checkout: resolve(__dirname, 'finalizare-comanda.html'),
        livrare: resolve(__dirname, 'livrare-plata.html'),
        parolaUitata: resolve(__dirname, 'parola-uitata.html'),
        privacy: resolve(__dirname, 'politica-de-confidentialitate.html'),
        returns: resolve(__dirname, 'returnari.html'),
        terms: resolve(__dirname, 'termeni-conditii.html'),
      },
    },
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    open: true,
  },
});
