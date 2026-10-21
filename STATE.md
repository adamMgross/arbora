# State

Read Current State first. The Log is append-only, newest last, and is corrected forward with a new entry, never edited. When Current State grows past two screens, rewrite it holistically.

## Current State

**Phase:** Restructure complete and the site is live. The three reflection decks show the picture first, open the book on request, and draw without a daily limit (decision 0012). All three decks show public-domain pictures (decision 0014): the Wood's 52 American landscape paintings, the Sky's 62 Doré, Flammarion, and Verne engravings with NASA's Island Three, and the Year's 72 Hokusai and Hiroshige prints. Each deck's YAML is the record of its pictures. `docs/research/deck-pictures/` keeps the matches as first approved, and 24 cards now show a different work, listed in the Log for the owner's review (`arb-sevh`).

**Deployed vs main:** Deployed. The owner approved the first push on 2026-10-18, and https://adammgross.github.io/arbora/ serves `main` through the Deploy workflow (run 39210926422 green). Every push to `main` deploys.

**What works, verified 2026-10-20:** `npm run ci` passes locally: format check, `astro check` with 0 errors, 136 unit tests, a root-path build of 25 pages plus sitemap, robots, and service worker, `verify:dist` under `/` and `/arbora/`, 8 content-integrity tests, and 60 end-to-end tests at both base paths, across desktop size and the `phone` project at an iPhone 15 viewport. On 2026-10-18 the three decks were walked through in Playwright's WebKit build on iPhone SE, iPhone 15, iPhone 15 Pro Max, and iPhone 15 landscape, and in Chromium on a Galaxy S24, with no console errors, no page errors, and no horizontal overflow.

**Sizes, measured from `dist/`:** main script 4.3 KB gzipped, stylesheet 11,891 bytes gzipped (ceiling 12 KB), scene chunks 4.4 KB (Wood), 9.9 KB (Sky), 3.8 KB (Year) gzipped, loaded only on their pages. The 186 masters are 46 MB in the repository (Wood 8.5, Sky 22, Year 15), and `dist/` is 71 MB with 548 WebP files, largest 508 KB (the Sky's Mars) against the 600 KB budget `verify:dist` enforces. A draw loads one picture, two on the Year.

**Blockers:** none. Orphaned pre-rewrite commits on GitHub still hold personal details until the move to a fresh repository (`arb-54cu`, decision 0007). `arb-32io` decides whether the address stays `adammgross.github.io/arbora` or moves to `arbora.site`. The workflow's action majors target the deprecated Node 20 (`arb-nlmj`).

**Open questions:** Which wording wins where Today and the canon pages disagree (`arb-g4c9`). Whether `arbora.site` should be the address. Two deck items need people rather than code: the owner's read for tone (`arb-y8k3`) and a reading of the Native-sourced cards by Native readers, with a packet on the ticket (`arb-kbpk`). Which Meditations translation the canon's V.24 passage really is (`arb-w81y`).

**Untested assumptions:**

| Assumption | Confidence |
|---|---|
| The Deploy workflow keeps running green as GitHub retires Node 20 actions and moves `ubuntu-latest` to Ubuntu 26 | medium, green on 2026-10-18 with deprecation warnings (`arb-nlmj`) |
| Safari and Firefox render the site as Chromium does, including `var()` inside SVG presentation attributes and `transform-box: fill-box` on the Year's needle | medium for the decks in WebKit, checked by hand on 2026-10-18 with Playwright's WebKit build, low for Firefox and for the other pages (`arb-589u`) |
| A real iPhone behaves like the WebKit build at an iPhone viewport, including `svh` units, the 3D card flip, smooth scrolling, and the tap feedback | medium, not tried on a device |
| Older Safari still gets a nav blur, since the minifier keeps only the unprefixed `backdrop-filter` | medium, depends on the build's browser targets |
| Cache-first HTML shows a new deploy one navigation late | high, read from `src/pwa/sw.template.js` |
| A tall picture fits a phone screen, by the `62svh` cap on the card | medium, seen at 390 by 844, but the drawn card is random, so no test pins the tallest |
| No two cards show two impressions of one design | medium, checked by eye on 2026-10-20, while the test compares only source files |
| Commons keeps serving the recorded sources, which matters only when `npm run art:fetch` reruns | medium, masters are committed so builds never fetch |
| Parity screenshots are stable across machines | medium, shown on this machine with recorded fonts only, and the deck pages differ even against themselves (`arb-0yit`) |
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

### 2026-10-18 (the decks on a phone)

**Done:** the owner said the oracle pages will be opened almost only on phones, in Safari and Chrome on iOS. An audit in WebKit and Chromium on five phone profiles found results landing off screen, plates and labels too small to read, a landscape dome taller than the screen, sticky hover colors, and an orphaned card on the hub. All are fixed and recorded in `docs/decisions/0011`: decks run edge to edge, each tap brings its result into view, the Wood spreads its plates into a sideways row to look at, the Sky's plate and dome labels are larger, the Year's buttons sit between the ring and the pair, and the hub stacks one deck to a row. A `phone` Playwright project now runs the deck spec and a new `tests/e2e/phone.spec.ts` at an iPhone 15 viewport.

**Findings:** long dome labels near the zenith fit on neither side of their star and were placed without checking for overlap. Placement now takes the spot with the least overlap among both sides and a clamped position, which also clears overlaps on desktop. The stylesheet reached exactly 12,000 bytes gzipped and was trimmed to 11,942, so the 12 KB ceiling has almost no room left.

**Left unfinished:** WebKit is not in CI (`arb-589u`), and nothing was tried on a real device. In phone landscape the Wood's walk takes a scroll.

### 2026-10-18 (the site goes live)

**Done:** the owner approved the push and `main` deployed to https://adammgross.github.io/arbora/. The live hub and all three decks load and mount in WebKit at an iPhone viewport with no errors. `arb-hk2f` is closed.

**Findings:** the first run failed one integration test, because Astro colors its errors on GitHub's runner and the test matched plain text. The test now strips terminal color codes from the build output, reproduced locally with `FORCE_COLOR=1`. The run warns that the pinned action majors target Node 20 (`arb-nlmj`).

**Left unfinished:** the address decision (`arb-32io`) and the action version bump (`arb-nlmj`).


### 2026-10-19 (personal details scrubbed from the site and its history)

**Done:** at the owner's request, reworded 21 lines of site copy and `VISION.md` that described the owner's own neighborhood, family places, and daily routine, so each passage speaks to the reader's setting. Then rewrote every commit with `git filter-repo --replace-text` so older versions of the same passages carry the new wording, and force-pushed with the owner's approval. Decision 0007 is rewritten to cover both rewrites and corrects the earlier entry: the repository and its legacy Pages site were public from 2026-04-12, not for a few hours.

**Findings:** a search over every commit finds no `CHARTER.md` and none of the removed details, apart from quotations and Muir's book title. The rewrite left the tip tree byte-identical, and `npm run parity` against the pre-rewrite commit shows differences only on the five reworded pages. GitHub still serves the orphaned pre-rewrite commits by hash.

**Left unfinished:** the owner plans to move to a new repository with no history (`arb-54cu`). All commit hashes changed again, including `baseline/pre-astro`.

### 2026-10-19 (the decks show the picture first and draw without limit)

**Done:** at the owner's direction, after using all three decks, every deck now follows one flow: one line at the threshold, a wordless draw, a card showing only its picture and name, then Read and Again (decision 0012). The daily limit is gone from all three. The Wood draws one card from all fifty-two by default, with three lights and the table as choices at the door. The Sky draws by chance from every plate, and the real sky places it: the halo goes to where its light stands, or to the horizon if it has set, and the book says where. The Year's needle turns as often as asked, and its notebook and season review sit behind a Notebook button. Card faces lost every line but the name (and the Year's number). Each deck page's intro moved below the deck, and the page copy that described one draw a day now describes the new flow. The journal shape is `{ entries }`.

**Findings:** the fixed nav hides when the page scrolls down and comes back when it scrolls up, so Walk again and Look again landed the deck's top under it. A test tap on the second walk hit the nav's home link about one run in three. Revealed deck elements now keep 80 px clear at the top, and `reveal` counts anything under the nav as off screen. The stylesheet went from 11,942 to 11,832 bytes gzipped.

**Left unfinished:** the pictures were drawn to sit beside text and now carry the whole card, and the Year's seventy-two cards share four seasonal landscapes. Deepening them, with a written picture grammar per deck and one test card each for the owner first, is the next step after the Sky's new plates.

### 2026-10-19 (the Sky doubled to sixty-two plates)

**Done:** at the owner's request, so repeated draws stay varied, the Sky went from 31 plates to 62 (decision 0013). Twenty-two fixed-star plates complete the twelve signs and add the Pole Star, the Dragon, the Crown, the Kneeler, the Serpent-Bearer, Berenice's Hair, the Hero, the Winged Horse, the Charioteer, the Crow and the Cup, the River, the Whale, the Dolphin, the Southern Fish, and the Little Cloud, each with real star positions. Nine new mysteries: the World Egg, the Widening, the Great Year, the Long Sleep, the Edge, the Dust and the Stars, the Breath, the Far Traveler, and the Last Light. Research agents drafted the lore and passages and checked each passage word for word on an opened page of a public-domain translation, and three drawing agents drew the plates in `src/scenes/sky/art-zodiac.ts`, `art-figures.ts`, and `art-mysteries.ts`. A preparatory commit moved the Sky's palette and helpers to `ink.ts`, checked by comparing every plate's SVG before and after. The dome now names only the seven heavens.

**Findings:** naming all 36 figures on the dome buried it in labels. The Little Cloud's "candle seen through horn" was cut, because that comparison was made through a telescope. The Orphic tablet's translation is credited to Harrison's book, not to Gilbert Murray, because the page does not name the translator. Three lore claims rest on a single source: the Ram's link to Amun (Wikipedia), the Great Year's Timaeus line number, and "Scots" read as Irishmen in the Far Traveler.

**Left unfinished:** the weakest drawings are the human figures (the Kneeler, the Serpent-Bearer, the Hero, the Maiden), the Whale's body, the Charioteer's horses, and the Great Year, which reads as a diagram. They are first editions for the picture pass. The new plates need the owner's read for tone (`arb-y8k3`).

### 2026-10-19 (a picture language for each deck, with one test card each)

**Done:** at the owner's go-ahead, wrote a picture language for each deck into `DESIGN.md` (Deck Pictures): the Wood's bands of a tree, the Sky's above and below with the pilgrim acting out each plate's set-down and receive, and the Year's window with the season's palette, the sun at the term's height, the place, the named event, and a mark of the old Japanese kō. Redrew one test card per deck to it: the Aspen, Venus, and window 51 (persimmons, with the kō's crickets at the door). The Year's windows can now each carry their own picture (`src/scenes/year/windows.ts`, keyed by window number), falling back to the season landscape, over shared helpers in `src/scenes/year/ink.ts`. A before-and-after page for the owner's phone is at https://claude.ai/artifact/6et9u52aJGVqsjx8HU6U14.

**Findings:** the shared hill shape stopped four pixels short of every Year card's right edge, leaving a sliver of sky. It now reaches the frame. Venus's planet symbol overlay was dropped, since the lit ring marks the heaven and the language carries no glyphs. The stylesheet gained one token, `--art-fruit`.

**Left unfinished:** the owner's read of the three test cards. After that, the rest of each deck gets drawn to its language, the Sky's pilgrim moves into every plate's drawing (`OWN_PILGRIM` in `src/scenes/sky/art.ts` lists the plates that already draw their own), and the Year's windows gain a place each.

### 2026-10-20 (the Wood shows public-domain paintings)

**Done:** after using the decks, the owner found the drawn art too simple and asked for figures a reader can step into, as on a tarot card. Found candidate public-domain art for each deck, and the owner chose a source per deck: American landscape painting of the 1800s for the Wood, Doré with Flammarion, Verne, and NASA's Island Three for the Sky (pulp covers and busy colony art rejected as whimsical), and Hokusai and Hiroshige for the Year. Matched every card of all three decks to a verified Commons image on review pages the owner approved (Wood https://claude.ai/artifact/4H7vC6qYGR81tMjHyPF7JV, Sky https://claude.ai/artifact/UERrRCVV9x393cpgDqXCV4, Year https://claude.ai/artifact/GFrLVY4oNXdj53F8H8boq5). Recorded decision 0014. Built the Wood end to end: a `picture` record on each card, `npm run art:fetch` to make committed masters, WebP widths at build, the painting on a mat at its own shape with the name beneath, the credit in the book, no WebP in the service worker precache, and the drawn Wood faces deleted.

**Findings:** owner rules: no text in a picture (titles, captions, poems, labels), though signatures and seals stay. The whole picture shows and the card takes its shape. A card with no fitting picture leaves the deck, and in the end every card in all three decks found one. The drawn back is tall, and stacked with a wide painting it stretched every card into an empty block, which a phone test now catches. The old SVG face carried the card's circle and origin for screen readers, and the figure keeps that label. One Humbaba scan was 500 px wide and was replaced with a 2,705 px copy of the same painting.

**Left unfinished:** the Sky (`arb-lj8n`) and the Year (`arb-6d4h`), the rewordings the review page flags (`arb-igp1`), frame edges on a few Wood masters (`arb-k1j0`), and deck screenshot parity, which differs even against itself (`arb-0yit`).

### 2026-10-20 (the Sky and the Year show public-domain pictures)

**Done:** at the owner's go-ahead, switched the Sky and the Year the way the Wood went, each as a restructure commit (records and masters, parity clean apart from renamed bundle hashes) and a behavior commit. The Sky shows each engraving on a lapis mat with its name, and its book credits the work. The Year shows each print on a washi mat with the window's number and name, and its book credits both the world's print and the drawn one. The drawn Sky faces (`art-zodiac.ts`, `art-figures.ts`, `art-mysteries.ts`, `SKY_ART`) and the Year's landscapes (`windows.ts` and the season landscape colors) are gone. A workflow of agents fetched every approved picture, set a trim that removes text and scan margins, and a second agent checked each trimmed picture corner by corner for missed text. `verify:dist` now fails on a picture over 600 KB. The dome tests now take their star plates from `sky.yml`, so every fixed-star plate in the deck must have a figure on the dome.

**Findings:** 24 approved files were under 1,000 px or faded, and were replaced with large scans of the same plate or print, mostly the 1871 Berlin Dante, Polona, the Met, and the National Diet Library. 24 cards now show a different work, all checked against the card:
- The Sky: the Big Dipper now has the Mariner's "And I had done a hellish thing", because "So lonely 'twas" exists only at 600 px. The Long Sleep and the Last Light had Flammarion roundels at about 320 px, and the 1894 book scan on Commons is too harsh. They now have Doré's Sleeping Beauty and his Purgatorio Canto I (Dante and Virgil out again under the stars). A Wandering Jew plate was rejected for the legend's antisemitic history.
- The Year, where text could not be cropped without the subject (poems over birds, cartouches over Fuji, lettered umbrellas and stones): p10, p18, p19, p22, p29, p34, p35, p36, p37 (the Eastern Capital design of the same fireworks), p40, p44, p45, p47, p49, p53, p55, p59, p69.
- The Year, where two cards had picked the same design: p14, p15, p28.

Three pairs of Year cards had picked one print, and two more impressions of one design (Returning Geese at Katada) were caught only by eye. The source test cannot catch two impressions of one design. Wrapping the Year's cards in plain `div`s dropped the 12 px scroll margin every deck `figure` gets, so the drawn card stopped a fraction of a pixel short of the screen edge on a phone, failing about one run in three. The wrappers now get the margin.

**Left unfinished:** the owner's review of the 24 different works (`arb-sevh`). On desktop the Year's two cards beside the ring are about 150 px wide, small for prints. The rewordings (`arb-igp1`), the Wood's frame edges (`arb-k1j0`), and the parity flake (`arb-0yit`), which showed again once on the Sky's cue.

