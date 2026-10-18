import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE,
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  compressHTML: false,
  build: { format: 'file' },
});
