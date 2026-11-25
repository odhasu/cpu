import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        ['home', 'models', 'pricing', 'gpu', 'docs'].map((page) => [
          page,
          resolve(import.meta.dirname, page === 'home' ? 'index.html' : `${page}/index.html`),
        ]),
      ),
    },
  },
});
