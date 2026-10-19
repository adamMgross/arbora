import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';
import { pwa } from './integrations/pwa.ts';

export default defineConfig({
  site: process.env.SITE ?? 'https://adammgross.github.io',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  compressHTML: false,
  build: { format: 'file' },
  integrations: [mdx(), pwa(new URL('./src/pwa/sw.template.js', import.meta.url).pathname)],
  markdown: { processor: satteri({ features: { smartPunctuation: false, gfm: false } }) },
});
