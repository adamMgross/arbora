# State

Read Current State first. The Log is append-only, newest last, and is corrected forward with a new entry, never edited. When Current State grows past two screens, rewrite it holistically.

## Current State

**Phase:** Restructure complete locally, not pushed. Hosting is the next step and is owner-blocked.

**Deployed vs main:** Nothing is deployed. The repository is private and Pages is not enabled (`gh api repos/adamMgross/arbora/pages` returned 404 on 2026-10-18). `main` is 13 commits ahead of `origin/main` before the onboarding commit and has not been pushed, because a push runs the deploy workflow, which fails until Pages is enabled.

**What works, verified 2026-10-18:** `npm run ci` passes locally: format check, `astro check` with 0 errors, 68 unit tests, a root-path build of 21 pages plus sitemap, robots, and service worker, `verify:dist` under `/` and `/arbora/`, 5 content-integrity tests, and 16 end-to-end tests at both base paths. `npm run parity -- --base baseline/pre-astro` reports 0 failures across 21 pages and 9 configurations (205 captures, 189 screenshots). The harness was shown to detect text, title, link, route, and screenshot changes by editing a copy of the baseline.

**Blockers:** `arb-5mng` and `arb-hk2f`, the owner steps that enable Pages. `arb-32io` decides the public address.

**Open questions:** Which wording wins where Today and the canon pages disagree (`arb-g4c9`). Whether `arbora.site` should be the address.

**Untested assumptions:**

| Assumption | Confidence |
|---|---|
| The Deploy workflow runs green on GitHub, including `playwright install --with-deps` and the pinned action majors | low, it has never run (`arb-nlmj`) |
| Safari and Firefox render the site as Chromium does | low, only Chromium is exercised (`arb-589u`) |
| Older Safari still gets a nav blur, since the minifier keeps only the unprefixed `backdrop-filter` | medium, depends on the build's browser targets |
| Cache-first HTML shows a new deploy one navigation late | high, read from `src/pwa/sw.template.js` |
| Parity screenshots are stable across machines | medium, shown on this machine with recorded fonts only |
| The `adammgross.github.io` user site does not register a worker that collides with `/arbora/` | low, not inspected |

## Log

### 2026-04-12

**Done:** First version: 21 hand-written pages, one stylesheet, `CHARTER.md`, `DESIGN.md`. Seeded from git history, which has five commits this day.

### 2026-04-14 to 2026-04-15

**Done:** Added the Today page, reoriented the canon toward ancient traditions, generalized personal references, split the canon into a library index with sub-pages, improved tree legibility, switched `--font-ui` from Source Sans to EB Garamond.

### 2026-04-17

**Done:** Expanded Today's pools, added shuffle buttons, split classical philosophy into six sub-pages, added the PWA, new sections, and more content.

### 2026-04-19

**Done:** Added prayers and the Upanishads page, then a site-wide pass for dark mode, SEO, accessibility, and content.

### 2026-04-22

**Done:** Fixed the mobile nav overlay, added saved readings and canon links to Today. Last commit before the restructure, tagged `baseline/pre-astro`.

### 2026-10-18

**Done:** Restructured the site onto Astro in 13 commits, each gated by `npm run parity` against the baseline tag.

1. Parity harness and tooling, with decisions 0001 to 0003.
2. Every page onto one layout with shared nav and footer.
3. Layouts, structural components, decor SVGs, and the tree diagram extracted.
4. 239 quotations, 15 invocations, 13 canon pages, 4 prose pages, 8 principles, and Today's pools moved into validated collections.
5. End-to-end specs written against the original site first, then the behavior ported to typed modules with unit tests.
6. The stylesheet moved through the Astro pipeline, dead rules removed, and the file split by owner.
7. Sitemap, robots, and service worker generated at build time, the Pages workflow added, and the base path verified.

Then onboarded to the portfolio layout in one more commit: VISION, ARCHITECTURE, STATE, decisions 0004 to 0006, 23 tickets, the README, DESIGN.md, and CLAUDE.md.

**Decisions:** Astro over Eleventy and over staying build-free (0001). URLs preserved (0002). Refactor and behavior commits kept separate (0003). Content in collections, attributions raw (0004). Cascade layers tried and rejected because layer order beats specificity and changed print, reduced-motion, and `.saved-heading` rendering, so CSS stays plain and globally ordered (0005). Service worker generated and scoped to `arbora-` caches (0006). The plan's MDX conversion kept headings as JSX because markdown headings would have added ids and failed id parity. `Passage` and `Invocation` were built with the content model in P3 rather than P2, because inline-prop components would have been rewritten immediately. The planned `lib/theme.ts` and `lib/motion.ts` were not built, since nothing would use them, and the convention is written in `ARCHITECTURE.md` instead. The planned semantic-token pass was deferred to `arb-748i` because it changes dark-mode rendering.

**Findings:** The minifier dropped the unprefixed `backdrop-filter`, removing the nav blur in Chromium. Screenshots at scroll zero could not show it, the computed-style comparison did, and an e2e spec now pins it. Of Today's 90 readings, 5 appear verbatim on a different canon page than they link to and about 40 on none (`arb-ceno`). `dayOfYear` is off by one for the first hour of each day under daylight saving time (`arb-65hn`). The print block's heading and link rules lose to screen rules (`arb-witj`). With reduced motion on, `tree.html` still runs its infinite sway, observed in Chromium (`arb-yq84`).

**Left unfinished:** Nothing is pushed. The README, DESIGN.md, and CLAUDE.md were updated in the onboarding commit. The known defects above are ticketed, not fixed, by design.
