# Architecture

A static site built by Astro from validated content files. Facts live in YAML and MDX collections, components render them, a handful of typed browser modules add behavior, and a build step emits plain HTML, one stylesheet, one script, and a generated service worker. GitHub Pages serves the output from a project subpath.

```
 src/content/            canon/*.mdx  pages/*.mdx  passages/*.yml  invocations.yml
                         principles.yml  today.yml
        |   src/content.config.ts: Zod schemas, yamlListLoader, reference() checks
        v
 src/lib/                routes.ts  canon.ts  pages.ts  sitemap.ts  today-pools.ts
        |                (pure: values in, values out)
        v
 src/layouts + components   Base -> ProseLayout -> CanonLayout
        |                   Passage Invocation Breadcrumb CanonNav CanonToc TreeDiagram decor/*
        v
 src/pages/              [slug].astro  index  today  tree  canon  sitemap.xml.ts  robots.txt.ts
        |
        v  astro build  (format: 'file', so today.html stays today.html)
 dist/                   *.html  _astro/<hash>.css  _astro/<hash>.js  sw.js  manifest  icons
        ^                                          ^
        |                                          |
 src/styles/index.css  <- 17 owner files    src/scripts/main.ts <- one module per concern
 (one explicit import order)                 (reads src/lib, touches the DOM)
        |
        v
 .github/workflows/deploy.yml: npm run ci -> upload dist -> deploy to Pages
```

## Modules

| Module | Owns | Must not know about |
|---|---|---|
| `src/content/` | Every authored fact: passages, invocations, principles, Today's rotation pools, canon and prose pages. | Markup, styling, URLs beyond page ids. |
| `src/content.config.ts` | The schema of each collection and the references between them. | Rendering. |
| `src/lib/yaml-list-loader.ts` | Reading YAML lists from disk, rejecting duplicate ids. The only content-side file I/O. | What a passage or invocation is. |
| `src/lib/routes.ts` | The named pages and the nav order. | Content. |
| `src/lib/canon.ts` | Turning a canon entry into layout props: title, breadcrumb, pager, table of contents. | Astro. |
| `src/lib/daily.ts`, `season.ts`, `saved-readings.ts` | Pure Today logic: day number, season, time of day, shuffle, saved-reading storage rules. | The DOM, the clock (callers pass `Date` and `random`). |
| `src/lib/sitemap.ts`, `pages.ts` | Sitemap and robots text, the list of built pages. | The filesystem. |
| `src/layouts/` | The page shell: head, nav, footer, page header, canon frame. | Where content comes from. |
| `src/components/` | One piece of markup each, with a stylesheet of the same name where it has one. | Other components' internals. |
| `src/pages/` | Routes. `[slug].astro` serves every canon and prose page. | Prose. |
| `src/scripts/` | Browser behavior, one file per concern, started in order by `main.ts`. | Astro and the content layer. |
| `src/styles/` | Global tokens, base, layout, prose, shell, motion, print, and page-level styles. | Components' private rules. |
| `integrations/` | Build-time work after Astro finishes: generating `sw.js`. | Page content. |
| `tests/parity/` | Comparing a build to a prior version of the site. A refactoring tool. | The site's source. |

## Data flow

Raw bytes become typed values at two boundaries. At build time `yamlListLoader` and Astro's `glob` loader parse YAML and MDX frontmatter, and the Zod schemas in `src/content.config.ts` validate every field. An unknown field, a duplicate id, or a dangling `reference()` fails the build. In the browser, `parseSaved` in `src/lib/saved-readings.ts` validates what `localStorage` returns before anything uses it, and Today's pools arrive as one JSON script element that `src/scripts/today.ts` parses once.

Typed values become wire format in three places: HTML (rendered by components), the Today pools JSON in `today.html`, and the saved-readings array in `localStorage`.

## External systems

| System | Purpose | Auth | Verified | License |
|---|---|---|---|---|
| GitHub Pages | Hosting, via `actions/deploy-pages` | repo permissions | not yet deployed | n/a |
| Google Fonts | Cormorant Garamond, EB Garamond, Source Sans 3 loaded by the browser at runtime | none | 2026-10-18, recorded in the parity HAR | SIL OFL |

Source Sans 3 and the tree page's Source Code Pro are requested and unused (`arb-7r1s`).

## Storage

| Data | Where | Rule |
|---|---|---|
| Saved readings | `localStorage` key `arbora-saved-readings`, JSON array | Entries are `{text, source}` and may carry more fields. The reader accepts the original shape and keeps unknown fields. A new field is added beside the old ones. |
| Offline cache | Cache Storage, one cache named `arbora-<10 hex>` | Replaced on every deploy. The worker deletes only caches starting with `arbora-` because the origin is shared with other project sites. |

## Build, run, deploy

```bash
npm install
npm run dev            # local server
npm run ci             # everything the workflow runs
npm run parity -- --base <ref>   # compare the build to a git ref, after npm run build:parity
```

The workflow builds twice. `npm run quality` builds for the site root and runs every test. `npm run build:prod` then builds for `/arbora/` with `SITE` and `BASE_PATH` set, `npm run verify:prod` checks every link and the sitemap under that path, `npm run test:e2e:prod` runs the browser tests mounted at `/arbora/`, and that `dist/` is what gets published.

## Graphics convention

No scene exists yet, so no module exists. When the first one lands it follows this shape, and `arb-7r81` tracks it.

- A scene is a custom element (`<arbora-scene>`) in its own module. It calls `import()` for its code when it becomes visible, so pages without a scene ship nothing.
- Colors come from CSS custom properties read at runtime and read again when the color scheme changes. They are never copied into script.
- Motion respects `prefers-reduced-motion` through one shared helper, not a check per scene.
- Layering uses a z-index scale defined next to the tokens, not ad hoc values.

## Shape

Invariants a reviewer can check. Where the code does not hold one yet, the ticket is named.

1. **Pure core.** `src/lib/` imports no DOM and does no I/O, except `yaml-list-loader.ts` (reads files at build time) and `pages.ts` (reads Astro collections). Only `src/scripts/` touches the DOM.
2. **One scroll listener.** `src/scripts/scroll.ts` registers the only `scroll` listener. Handlers register through `onScroll`.
3. **Closed sets are types.** `Season` and `TimeOfDay` are unions, and Today's heading lookup is a record keyed by `TimeOfDay`, so a new value fails the type check.
4. **Content is validated.** Every collection schema is `strictObject`. Passage, invocation, principle, and today ids are unique. Pinned by `tests/integration/content-integrity.test.ts`.
5. **Saved readings accrete.** `parseSaved` accepts the original shape and preserves unknown fields. Pinned by `tests/unit/saved-readings.test.ts`.
6. **URLs are stable.** Every page and asset of the original site is still built. Pinned by the route check in `tests/parity/run.mjs`.
7. **The deployed path works.** Every internal reference resolves under the base path and the sitemap matches the built pages. Pinned by `scripts/verify-dist.mjs` in `npm run ci`.
8. **The cache name tracks the content.** `sw.js` is generated, its name is a hash of every built file, and it precaches exactly those files. Pinned by `tests/unit/service-worker.test.ts`.
9. **CSS has one order.** `src/styles/index.css` is the only importer of stylesheets and lists every owner file in cascade order. There is no `@layer`. `!important` appears only in `motion.css` and `print.css`.
10. **Refactors are inert.** A restructuring commit passes `npm run parity` with zero differences.

Known drift from the Shape:

- About 112 `rgba()` literals copy light-mode palette values and ignore dark mode (`arb-748i`).
- `index.astro`, `today.astro`, `tree.astro`, and `canon.astro` hold their page copy in markup (`arb-6dmi`).
- Canon tables of contents repeat their headings, unchecked (`arb-waph`).
- Passage ids are generated from position, so they are not yet safe to store elsewhere (`arb-fcfg`).
