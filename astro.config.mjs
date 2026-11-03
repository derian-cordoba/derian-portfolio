import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site:
    process.env.SITE_URL ??
    'https://derian-cordoba-portfolio.partedwave1.chatgpt.site',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
