# Architecture

A static site built by Astro from validated content files. Facts live in YAML and MDX collections, components render them, a handful of typed browser modules add behavior, three lazily loaded scene modules draw the reflection decks, and a build step emits plain HTML, one stylesheet, one script plus one chunk per scene, and a generated service worker. GitHub Pages serves the output from a project subpath.

```
 src/content/            canon/*.mdx  pages/*.mdx  passages/*.yml  invocations.yml
                         principles.yml  today.yml  decks/{wood,sky,year}.yml
        |   src/content.config.ts: Zod schemas, yamlListLoader, reference() checks
        v
 src/lib/                routes.ts  canon.ts  pages.ts  sitemap.ts  today-pools.ts
        |                sky-math.ts  sky-dome.ts  year-windows.ts  journal.ts  wood-walk.ts
        |                (pure: values in, values out)
        v
 src/layouts + components   Base -> ProseLayout -> CanonLayout
        |                   Passage Invocation Breadcrumb CanonNav CanonToc TreeDiagram decor/*
        |                   Deck (renders <arbora-scene> with the deck's JSON)  DeckBacks
        v
 src/pages/              [slug].astro  index  today  tree  canon  sitemap.xml.ts  robots.txt.ts
        |
        v  astro build  (format: 'file', so today.html stays today.html)
 dist/                   *.html  _astro/<hash>.css  _astro/<hash>.js  _astro/{wood,sky,year}.<hash>.js
        ^                                          ^                  sw.js  manifest  icons
        |                                          |
 src/styles/index.css  <- 18 owner files    src/scripts/main.ts <- one module per concern
 (one explicit import order)                 (reads src/lib, touches the DOM)
                                             src/scripts/scenes.ts -> import('../scenes/<deck>')
                                             src/scenes/<deck>/{art,index}.ts  (markup, drawing, behavior)
        |
        v
 .github/workflows/deploy.yml: npm run ci -> upload dist -> deploy to Pages
```

## Modules

| Module | Owns | Must not know about |
|---|---|---|
| `src/content/` | Every authored fact: passages, invocations, principles, Today's rotation pools, canon and prose pages, and the three decks' cards under `decks/`. | Markup, styling, URLs beyond page ids. |
| `src/content.config.ts` | The schema of each collection and the references between them. | Rendering. |
| `src/lib/yaml-list-loader.ts` | Reading YAML lists from disk, rejecting duplicate ids. The only content-side file I/O. | What a passage or invocation is. |
| `src/lib/routes.ts` | The named pages and the nav order. | Content. |
| `src/lib/canon.ts` | Turning a canon entry into layout props: title, breadcrumb, pager, table of contents. | Astro. |
| `src/lib/daily.ts`, `season.ts`, `saved-readings.ts` | Pure Today logic: day number, season, time of day, shuffle, saved-reading storage rules. | The DOM, the clock (callers pass `Date` and `random`). |
| `src/lib/sitemap.ts`, `pages.ts` | Sitemap and robots text, the list of built pages. | The filesystem. |
| `src/lib/sky-math.ts`, `sky-dome.ts` | Approximate positions of the Sun, Moon, and planets, their altitude over a place, and the dome's state: which lights are up, where the eye landed, what the heavens line says. | The DOM, the clock (callers pass `Date`), drawing. |
| `src/lib/year-windows.ts`, `wood-walk.ts` | The 72-window calendar math and the walk's rules: order of positions, the last kept line, light positions. | The DOM, content. |
| `src/lib/journal.ts` | The one storage shape every deck keeps, its tolerant parser, and the one-draw-a-day rule. | Which deck is writing. |
| `src/lib/decks.ts` | The data contract between `Deck.astro` and the scenes, and the art enums the schemas validate against. | Rendering. |
| `src/scenes/` | One directory per deck with `art.ts` (pure SVG strings) and `index.ts` (markup and behavior, mounted with a clock, a random source, and a storage), plus the shared `motion.ts`, `book.ts`, and `env.ts`. | Astro, the content layer, and the other decks. |
| `src/layouts/` | The page shell: head, nav, footer, page header, canon frame. | Where content comes from. |
| `src/components/` | One piece of markup each, with a stylesheet of the same name where it has one. | Other components' internals. |
| `src/pages/` | Routes. `[slug].astro` serves every canon and prose page. | Prose. |
| `src/scripts/` | Browser behavior, one file per concern, started in order by `main.ts`. `scenes.ts` defines `<arbora-scene>` and imports a scene module when the element nears the viewport. | Astro and the content layer. |
| `src/styles/` | Global tokens, base, layout, prose, shell, motion, print, and page-level styles. | Components' private rules. |
| `integrations/` | Build-time work after Astro finishes: generating `sw.js`. | Page content. |
| `tests/parity/` | Comparing a build to a prior version of the site. A refactoring tool. | The site's source. |

## Data flow

Raw bytes become typed values at two boundaries. At build time `yamlListLoader` and Astro's `glob` loader parse YAML and MDX frontmatter, and the Zod schemas in `src/content.config.ts` validate every field. An unknown field, a duplicate id, a dangling `reference()`, or a deck card naming art that is not drawn fails the build. `Deck.astro` resolves a card's passage references against the canon and fails the build on a missing one. In the browser, `parseSaved` in `src/lib/saved-readings.ts` and `parseJournal` in `src/lib/journal.ts` validate what `localStorage` returns before anything uses it. Today's pools and each deck's cards arrive as one JSON script element that the page's script parses once.

Typed values become wire format in four places: HTML (rendered by components), the Today pools and deck JSON in their pages, the saved-readings array in `localStorage`, and the three deck journals in `localStorage`.

## External systems

| System | Purpose | Auth | Verified | License |
|---|---|---|---|---|
| GitHub Pages | Hosting, via `actions/deploy-pages` | repo permissions | not yet deployed | n/a |
| Browser geolocation | The Sky's optional reading of the sky over the reader, asked only on a tap | browser permission | 2026-10-18, through Playwright's emulated geolocation | n/a |
| Google Fonts | Cormorant Garamond, EB Garamond, Source Sans 3 loaded by the browser at runtime. The deck pages add Cormorant SC (Sky, Year) and IM Fell English (Wood) through a link `Deck.astro` renders | none | 2026-10-18, recorded in the parity HAR | SIL OFL |

Source Sans 3 and the tree page's Source Code Pro are requested and unused (`arb-7r1s`).

## Storage

| Data | Where | Rule |
|---|---|---|
| Saved readings | `localStorage` key `arbora-saved-readings`, JSON array | Entries are `{text, source}` and may carry more fields. The reader accepts the original shape and keeps unknown fields. A new field is added beside the old ones. |
| The Wood's walks | `localStorage` key `arbora-wood`, one journal object | Entries are `{iso, cards, line, status, outcome}` with `status` kept or branch. `lastDay` is the local date of the last walk. |
| The Sky's ascents | `localStorage` key `arbora-sky`, one journal object | Entries are `{iso, plate, heavens, line, status}` with `status` kept or set. |
| The reader's place | `localStorage` key `arbora-place`, `{lat, lon}` | Written only when the reader taps "Read the sky over where you are", rounded to a tenth of a degree. An empty value means the California default (`docs/decisions/0010`). |
| The Year's notebook | `localStorage` key `arbora-year`, one journal object | Entries are `{iso, w, y, text}`, one line per window per year. `draw` is `{w}` for the day's companion and `lastDay` the day it was drawn. |
| Offline cache | Cache Storage, one cache named `arbora-<10 hex>` | Replaced on every deploy. The worker deletes only caches starting with `arbora-` because the origin is shared with other project sites. |

A journal is `{entries, lastDay, draw}`. `parseJournal` keeps every field an entry carries, reads a missing field as null, and returns an empty journal for anything it cannot read, so a new field is added beside the old ones and an older page still reads a newer record.

## Build, run, deploy

```bash
npm install
npm run dev            # local server
npm run ci             # everything the workflow runs
npm run parity -- --base <ref>   # compare the build to a git ref, after npm run build:parity
```

The workflow builds twice. `npm run quality` builds for the site root and runs every test. `npm run build:prod` then builds for `/arbora/` with `SITE` and `BASE_PATH` set, `npm run verify:prod` checks every link and the sitemap under that path, `npm run test:e2e:prod` runs the browser tests mounted at `/arbora/`, and that `dist/` is what gets published.

## Graphics convention

The three decks are the first scenes, and they set the shape (`docs/decisions/0008`).

- A scene is a custom element (`<arbora-scene data-scene="...">`) defined once in `src/scripts/scenes.ts`. When the element comes within 400 px of the viewport it imports its module from `src/scenes/<name>/index.ts` and calls `mount(root, env)`. Pages without a scene ship none of the scene code, and each scene is its own chunk.
- A scene reads its content from the JSON script `Deck.astro` renders inside the element, and builds its own markup. Astro renders no deck markup beyond the element and a `<noscript>` line.
- `env` carries the clock, the random source, the storage, and the location lookup. Nothing in a scene calls `new Date()`, `Math.random`, or `localStorage` directly, so the end-to-end tests install a clock and a seeded random.
- Colors are CSS custom properties referenced with `var()` inside the SVG strings and defined per deck in `Deck.css`. Script never carries a color, and a color-scheme change re-resolves them without script.
- Motion respects `prefers-reduced-motion` through `src/scenes/motion.ts` (`wait`, `animate`, `reducedMotion`). CSS animations for the decks are switched off under the same query in `Deck.css`.
- Phones are the design target and the desktop layout is the variant (`docs/decisions/0011`). The phone rules sit in the 640 px query at the end of `Deck.css`. After each tap a scene brings what it produced into view with `reveal` from `motion.ts`, which scrolls only when the element is off screen.
- Drawing is pure: `art.ts` turns values into SVG strings and is also imported at build time by `DeckBacks.astro` to render the card backs on the hub.

## Shape

Invariants a reviewer can check. Where the code does not hold one yet, the ticket is named.

1. **Pure core.** `src/lib/` imports no DOM and does no I/O, except `yaml-list-loader.ts` (reads files at build time) and `pages.ts` (reads Astro collections). Only `src/scripts/` and `src/scenes/*/index.ts` touch the DOM.
2. **One scroll listener.** `src/scripts/scroll.ts` registers the only `scroll` listener. Handlers register through `onScroll`.
3. **Closed sets are types.** `Season` and `TimeOfDay` are unions, and Today's heading lookup is a record keyed by `TimeOfDay`, so a new value fails the type check.
4. **Content is validated.** Every collection schema is `strictObject`. Passage, invocation, principle, and today ids are unique. Pinned by `tests/integration/content-integrity.test.ts`.
5. **Saved readings accrete.** `parseSaved` accepts the original shape and preserves unknown fields. Pinned by `tests/unit/saved-readings.test.ts`.
6. **URLs are stable.** Every page and asset of the original site is still built. Pinned by the route check in `tests/parity/run.mjs`.
7. **The deployed path works.** Every internal reference resolves under the base path and the sitemap matches the built pages. Pinned by `scripts/verify-dist.mjs` in `npm run ci`.
8. **The cache name tracks the content.** `sw.js` is generated, its name is a hash of every built file, and it precaches exactly those files. Pinned by `tests/unit/service-worker.test.ts`.
9. **CSS has one order.** `src/styles/index.css` is the only importer of stylesheets and lists every owner file in cascade order. There is no `@layer`. `!important` appears only in `motion.css` and `print.css`.
10. **Refactors are inert.** A restructuring commit passes `npm run parity` with zero differences.
11. **Scenes load only where they are used.** A page without an `<arbora-scene>` requests no scene chunk, and a deck page requests only its own. Pinned by the hub test in `tests/e2e/decks.spec.ts`.
12. **Journals accrete.** `parseJournal` keeps unknown fields and reads missing ones as null. Pinned by `tests/unit/journal.test.ts`.
13. **A card's art and quotations exist.** The art enum and the passage references are validated at build time. Pinned by `tests/integration/content-integrity.test.ts`.
14. **One draw a day, per deck, per device.** A second walk, ascent, or needle turn on the same local date is refused, and the deck reopens the next day. Pinned by `tests/e2e/decks.spec.ts`.
15. **The decks work on a phone.** At an iPhone 15 viewport every deck runs edge to edge with no side scroll, touch targets are at least 44 px, and the result of each tap comes into view. Pinned by the `phone` project, which runs `tests/e2e/decks.spec.ts` and `tests/e2e/phone.spec.ts`.

Known drift from the Shape:

- About 112 `rgba()` literals copy light-mode palette values and ignore dark mode (`arb-748i`).
- `index.astro`, `today.astro`, `tree.astro`, and `canon.astro` hold their page copy in markup (`arb-6dmi`).
- Canon tables of contents repeat their headings, unchecked (`arb-waph`).
- Passage ids are generated from position, so they are not yet safe to store elsewhere (`arb-fcfg`).
