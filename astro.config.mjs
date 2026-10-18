import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE,
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  compressHTML: false,
  build: { format: 'file' },
  integrations: [mdx()],
  markdown: { processor: satteri({ features: { smartPunctuation: false, gfm: false } }) },
});
