# State

Read Current State first. The Log is append-only, newest last, and is corrected forward with a new entry, never edited. When Current State grows past two screens, rewrite it holistically.

## Current State

**Phase:** Restructure complete and the three reflection decks finished locally, not pushed. Hosting is the next step and is owner-blocked.

**Deployed vs main:** Nothing is deployed. The owner made the repository public on 2026-10-18 (`arb-5mng` closed). Pages is not enabled. `main` is ahead of `origin/main` by the restructure, the onboarding, the CHARTER removal, and the decks, and has not been pushed, because a push runs the deploy workflow, which fails until Pages is enabled.

**What works, verified 2026-10-18:** `npm run ci` passes locally: format check, `astro check` with 0 errors, 114 unit tests, a root-path build of 25 pages plus sitemap, robots, and service worker, `verify:dist` under `/` and `/arbora/`, 7 content-integrity tests, and 32 end-to-end tests at both base paths. The three decks run in headless Chromium at 1280 and 400 px wide in both color schemes with no console errors, no page errors, and no horizontal overflow.

**Sizes, measured 2026-10-18 from `dist/`:** main script 4.3 KB gzipped, stylesheet 11.6 KB gzipped (accepted by the owner, ceiling now 12 KB), scene chunks 19.9 KB (Wood, 52 drawings), 14.2 KB (Sky), 4.8 KB (Year) gzipped, loaded only on their pages.

**Blockers:** `arb-hk2f`, the owner step that enables Pages and approves the first push. `arb-32io` decides the public address.

**Open questions:** Which wording wins where Today and the canon pages disagree (`arb-g4c9`). Whether `arbora.site` should be the address. Two deck items need people rather than code: the owner's read for tone (`arb-y8k3`) and a reading of the Native-sourced cards by Native readers, with a packet on the ticket (`arb-kbpk`). Which Meditations translation the canon's V.24 passage really is (`arb-w81y`).

**Untested assumptions:**

| Assumption | Confidence |
|---|---|
| The Deploy workflow runs green on GitHub, including `playwright install --with-deps` and the pinned action majors | low, it has never run (`arb-nlmj`) |
| Safari and Firefox render the site as Chromium does, including `var()` inside SVG presentation attributes and `transform-box: fill-box` on the Year's needle | low, only Chromium is exercised (`arb-589u`) |
| Older Safari still gets a nav blur, since the minifier keeps only the unprefixed `backdrop-filter` | medium, depends on the build's browser targets |
| Cache-first HTML shows a new deploy one navigation late | high, read from `src/pwa/sw.template.js` |
| Parity screenshots are stable across machines | medium, shown on this machine with recorded fonts only |
| The `adammgross.github.io` user site does not register a worker that collides with `/arbora/` | low, not inspected |
| The sky model stays within a degree for the current decades | medium, checked against four recorded events in 2000, 2020, and 2026 (`tests/unit/sky-math.test.ts`), not against a full ephemeris |
| The fixed solar-term dates in `year.yml` are within a day of the true terms every year | medium, true for 2026 by inspection, not computed |
| The 72 California window names are right for their dates | medium, checked against phenology sources on 2026-10-18, 15 moved or renamed (`arb-skse`) |
| The quoted translations match their named editions word for word | high, 87 checked against the editions on 2026-10-18, 15 corrected, one Legge capitalization unconfirmed (`arb-hlt9`) |

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

### 2026-10-18 (repository made public)

**Done:** the owner made the repository public, closing `arb-5mng`. Verified with `gh repo view`. `origin/main` is still at `1920c5a`, so the public remote holds the original site, including `CHARTER.md` at the root.

**Left unfinished:** Pages is not enabled and nothing is pushed.

### 2026-10-18 (CHARTER.md purged from history)

**Done:** at the owner's request, removed `CHARTER.md` from every commit with `git filter-branch`, kept a copy on the owner's machine, and gitignored it (decision 0007). A bundle of the pre-rewrite history is outside the repository on this machine only. All commit hashes changed, including the `baseline/pre-astro` tag, so hashes quoted in earlier entries no longer resolve. The rewritten `main` was force-pushed with `[skip ci]` so the site did not deploy.

**Findings:** older site copy in history, and two lines in the current content (`src/content/canon/ancestral.mdx` and `src/content/today.yml`), name the family's towns of origin, and one old version of `rituals.html` names the owner's neighborhood. Whether to reword them is the owner's call.

**Left unfinished:** the Deploy workflow has not run. `arb-hk2f` stays open until the first deploy is green. `arb-eq17` tracks a public content guide.

### 2026-10-18 (the three reflection decks)

**Done:** built the owner's approved proposal for the three oracle decks into the site in one feature commit: the Wood (`wood.html`), the Sky (`sky.html`), the Year (`year.html`), and a hub (`oracles.html`) in the nav. Each deck is a page in the pages collection carrying a `<Deck>` component, which renders an `<arbora-scene>` element with the deck's content as JSON. `src/scripts/scenes.ts` defines the element and imports the scene module from `src/scenes/<deck>/` when it nears the viewport, so the three chunks load only on their pages. Content lives in `src/content/decks/` as three validated collections: 11 Wood cards, 19 Sky plates, and the Year's 24 terms, 72 windows, 72 old Japanese names, and 4 California seasons. Pure logic sits in `src/lib/`: an approximate sky model checked against the 2020 great conjunction, the 2020 Mars opposition, the 2026 equinox, and a reference new moon, the 72-window calendar, one journal shape for all three decks, and the walk's rules. The scenes take a clock, a random source, and a storage from the caller. 40 unit tests, 2 integration cases, and 14 end-to-end tests cover them. Decisions 0008 and 0009 record the shape and the real-sky choice. `arb-7r81` (the graphics layer) is closed.

**Decisions:** one feature commit rather than one per deck, because the hub, the shared component, the content config, and the end-to-end spec span all three and would have needed staged variants to build at each step. Colors are `var()` tokens inside the SVG strings, defined per deck in `Deck.css`, so no color reader exists and a color-scheme change needs no script. The Sky shows the Sun alone by day even when the Moon is up, as the proposal said. Deck passages are lists, each entry inline or a `ref` to a canon passage, so a quotation already in the canon has one home (the Net plate quotes the canon's Indra's net). The Year offers a plain-text copy of its notebook because a notebook on one device is fragile over years.

**Findings:** `Deck.css` display rules cancelled the `hidden` attribute on the deck's toggled elements, which the first headless run showed as a door that never closed, so the file ends with a doubled-class `[hidden]` rule. Playwright's installed clock fakes `requestAnimationFrame` and timers but not IntersectionObserver delivery, so the Sky tests scroll the dome into view and wait for the `adapting` class before advancing the clock. The stylesheet grew past the proposed, unconfirmed 10 KB gzipped ceiling to 11.6 KB.

**Left unfinished:** nothing is pushed. The remaining 41 Wood cards (`arb-3enk`) and the fixed-star plates (`arb-smpw`) are content tasks. The window names (`arb-skse`) and the quoted editions (`arb-hlt9`) need checking. The owner decides location, illustration, the Rituals table switch, tone, and Native-reader review (`arb-ccw6`, `arb-4ajl`, `arb-r5bw`, `arb-y8k3`, `arb-kbpk`).

### 2026-10-18 (the decks finished)

**Done:** at the owner's request finished every open deck item. The Wood has all 52 cards: 8 new Elders (white pine, sugar maple, paper birch, redwood, oak, Bodhi tree, ceiba, Honi's carob), 10 new Spirits, and 23 new Passages, each with a story, a sourced passage, and a code-drawn plate in `src/scenes/wood/art-*.ts`. The Sky has 31 plates with twelve fixed-star figures that rise on the dome from real star positions, and the two meteor showers appear only in season. The Sky reads the sky over the reader when asked, California otherwise (`docs/decisions/0010`). The Rituals page links to a table draw. The window names were checked against phenology (15 changed) and all 87 passages against their editions (15 corrected). Tickets `arb-ccw6`, `arb-4ajl`, `arb-r5bw`, `arb-3enk`, `arb-smpw`, `arb-skse`, and `arb-hlt9` are closed.

**Decisions:** the code-drawn gold line ships as the first edition of the Wood's plates, replaceable plate by plate because art is keyed by name. The table draw stays at the Wood's door and is linked from Rituals with `wood.html#table`. The owner accepted the 11.6 KB gzipped stylesheet. The drawing and research were split across five parallel agents, each scoped to separate files, then reviewed by rendering every plate.

**Findings:** the Sky's reach for a look shrank from 80 to 64 dome units so that, with sixteen figures up, the dark between them still answers with a mystery. The canon's Marcus Aurelius passage cites V.24 for what Long numbers XII.32 (`arb-w81y`).

**Left unfinished:** nothing is pushed. The owner's tone read (`arb-y8k3`) and the Native-reader review (`arb-kbpk`) are for people, not code.
