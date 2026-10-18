import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import type { TocItem } from './lib/toc';
import { yamlListLoader } from './lib/yaml-list-loader';

const passages = defineCollection({
  loader: yamlListLoader('src/content/passages'),
  schema: z.strictObject({
    text: z.string().min(1),
    attribution: z.string().min(1).optional(),
  }),
});

const invocations = defineCollection({
  loader: yamlListLoader('src/content/invocations.yml'),
  schema: z.strictObject({
    label: z.string().min(1),
    text: z.string().min(1),
  }),
});

const tocItem: z.ZodType<TocItem> = z.lazy(() =>
  z.strictObject({
    label: z.string().min(1),
    href: z.string().min(1),
    arrow: z.boolean().optional(),
    children: z.array(tocItem).optional(),
  }),
);

const canon = defineCollection({
  loader: glob({ pattern: '*.mdx', base: 'src/content/canon' }),
  schema: z.strictObject({
    heading: z.string().min(1),
    label: z.string().min(1).optional(),
    subtitle: z.string().min(1),
    description: z.string().min(1),
    ogDescription: z.string().min(1),
    toc: z.array(tocItem).optional(),
    parent: reference('canon').optional(),
    prev: reference('canon').optional(),
    next: reference('canon').optional(),
  }),
});

export const collections = { passages, invocations, canon };
