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

const pages = defineCollection({
  loader: glob({ pattern: '*.mdx', base: 'src/content/pages' }),
  schema: z.strictObject({
    heading: z.string().min(1),
    subtitle: z.string().min(1),
    title: z.string().min(1),
    ogTitle: z.string().min(1).optional(),
    description: z.string().min(1),
    ogDescription: z.string().min(1),
    toc: z.array(tocItem).optional(),
  }),
});

const today = defineCollection({
  loader: yamlListLoader('src/content/today.yml'),
  schema: z.strictObject({
    seasonGreetings: z.strictObject({
      spring: z.string().min(1),
      summer: z.string().min(1),
      autumn: z.string().min(1),
      winter: z.string().min(1),
    }),
    morningInvocations: z.array(z.string().min(1)).min(1),
    readings: z
      .array(z.strictObject({ text: z.string().min(1), source: z.string().min(1), tradition: reference('canon') }))
      .min(1),
    traditionLabels: z.record(z.string(), z.string().min(1)),
    eveningReflections: z.array(z.string().min(1)).min(1),
  }),
});

const principles = defineCollection({
  loader: yamlListLoader('src/content/principles.yml'),
  schema: z.strictObject({
    n: z.number().int().min(1),
    title: z.string().min(1),
    tagline: z.string().min(1),
  }),
});

export const collections = { passages, invocations, canon, pages, today, principles };
