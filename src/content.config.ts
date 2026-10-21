import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import type { TocItem } from './lib/toc';
import { SKY_ART } from './lib/decks';
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

const deckPassage = z.union([
  z.strictObject({ ref: reference('passages') }),
  z.strictObject({ text: z.string().min(1), attribution: z.string().min(1) }),
]);

const deckPicture = z.strictObject({
  title: z.string().min(1),
  artist: z.string().min(1),
  year: z.string().min(1),
  source: z.string().regex(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:./),
  license: z.enum(['public domain', 'CC0']),
  alt: z.string().min(1),
  trim: z
    .strictObject({
      top: z.number().min(0).max(50).optional(),
      right: z.number().min(0).max(50).optional(),
      bottom: z.number().min(0).max(50).optional(),
      left: z.number().min(0).max(50).optional(),
    })
    .optional(),
});

const woodCard = {
  name: z.string().min(1),
  from: z.string().min(1),
  picture: deckPicture,
  principle: reference('principles'),
  story: z.string().min(1),
  passages: z.array(deckPassage).min(1),
};

const wood = defineCollection({
  loader: yamlListLoader('src/content/decks/wood.yml'),
  schema: z.discriminatedUnion('circle', [
    z.strictObject({ circle: z.literal('Elder'), ...woodCard }),
    z.strictObject({ circle: z.literal('Spirit'), ...woodCard }),
    z.strictObject({
      circle: z.literal('Passage'),
      ...woodCard,
      question: z.string().min(1),
      table: z.string().min(1),
    }),
  ]),
});

const skyPlate = {
  name: z.string().min(1),
  alt: z.string().min(1),
  picture: deckPicture,
  art: z.enum(SKY_ART),
  above: z.string().min(1),
  set: z.string().min(1),
  receive: z.string().min(1),
  passages: z.array(deckPassage).min(1),
  question: z.string().min(1),
};

const sky = defineCollection({
  loader: yamlListLoader('src/content/decks/sky.yml'),
  schema: z.discriminatedUnion('kind', [
    z.strictObject({ kind: z.literal('heaven'), n: z.number().int().min(1).max(7), ...skyPlate }),
    z.strictObject({ kind: z.literal('stars'), ...skyPlate }),
    z.strictObject({ kind: z.literal('beyond'), ...skyPlate }),
  ]),
});

const year = defineCollection({
  loader: yamlListLoader('src/content/decks/year.yml'),
  schema: z.strictObject({
    terms: z
      .array(
        z.strictObject({
          name: z.string().min(1),
          month: z.number().int().min(1).max(12),
          day: z.number().int().min(1).max(31),
        }),
      )
      .length(24),
    windows: z.array(z.string().min(1)).length(72),
    ko: z.array(z.string().min(1)).length(72),
    pictures: z.array(deckPicture).length(72),
    seasons: z
      .array(
        z.strictObject({
          key: z.string().min(1),
          name: z.string().min(1),
          from: z.number().int().min(0).max(71),
          to: z.number().int().min(0).max(71),
          passages: z.array(deckPassage).min(1),
        }),
      )
      .min(1),
  }),
});

export const collections = { passages, invocations, canon, pages, today, principles, wood, sky, year };
