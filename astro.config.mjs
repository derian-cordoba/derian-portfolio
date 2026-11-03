import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://derian-cordoba.me',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(?:404|thanks)\/$/u.test(page),
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
