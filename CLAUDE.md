# Arbora

A syncretic, non-theistic religion of interconnection, deep time, and presence, published as a static Astro site on GitHub Pages. The one rule that matters most: curate from existing traditions, never invent. If the owner's local `CHARTER.md` exists, read its Part 0 and Part 2 before touching any content. It is gitignored and absent from fresh clones, so otherwise work from the content rules in `README.md` and `VISION.md`.

This repo follows `~/.claude/CLAUDE.md` in full. This file adds only what is specific to this repo and not derivable from the code.

## Reading order

1. `VISION.md`: problem, utility and craft goals, non-goals, settled scope.
2. `ARCHITECTURE.md`: modules, data flow, the graphics convention, and the Shape the code holds to.
3. `STATE.md`: Current State, then the newest Log entries.
4. `docs/decisions/README.md`: index of decision records. Read one before revisiting the choice it records.
5. `tk ready`: what to work on.

Also: `DESIGN.md` (design language, where `src/styles/tokens.css` wins on any value) and `docs/research/mirrors-for-the-mind.md` (the survey of oracle traditions the decks are built on: the seven-part anatomy, where traditions diverge, why they work, failure modes, and design principles). Read the research before designing or extending a deck.

## Commands

```bash
npm install
npm run dev                  # local server
npm run ci                   # the whole gate, same as the Deploy workflow
npm test                     # unit tests
npm run test:integration     # builds temp copies with injected content defects
npm run test:e2e             # Playwright against dist/, after npm run build
npm run build:parity         # build with the original site's SITE and base, for parity
npm run parity -- --base <ref> [--no-screenshots] [--allow-missing a,b]
```

`npm run parity` compares `dist/` to a git ref (default `HEAD~1`) and reports differences in text, head tags, ids, links, computed styles, routes, and screenshots across 9 configurations. It takes about 4 minutes with screenshots and seconds with `--no-screenshots`. `baseline/pre-astro` is the tag of the original hand-written site.

## Session protocol

Start: read `STATE.md` Current State, run `tk ready`, `tk start <id>`. `tk ready` lists `type: owner` tickets too. Those are the owner's to resolve, so skip them and pick the next one down.

End: `tk close <id>` (or `tk add-note <id>` with what remains), append a dated entry to the `STATE.md` Log, refresh Current State, commit. A non-trivial decision gets a record in `docs/decisions/` in the same commit. Anything only the owner can resolve becomes `tk create ... -t owner`.

A push to `main` runs the Deploy workflow, which runs `npm run ci` and publishes the site to https://adammgross.github.io/arbora/. Push only after `npm run ci` passes locally.

## Invariants

Breaking one of these is a defect, not a tradeoff.

- A restructuring commit passes `npm run parity` against the previous version with zero differences. A behavior change is its own commit, and the parity run then shows only the intended differences.
- Every URL that exists keeps its name (`docs/decisions/0002`).
- Content moves verbatim. Rewording, deduplicating, or normalizing a quotation is a separate commit and, where two copies disagree, the owner's call (`arb-g4c9`).
- Facts have one home. Adding a quotation, invocation, principle, or Today reading means editing a content file, not markup.
- Content goes in YAML values and `.mdx`, never `.md`, so the prose hook does not reject its em dashes.
- `src/styles/index.css` is the only importer of stylesheets and no CSS uses `@layer` (`docs/decisions/0005`).
- Write `-webkit-backdrop-filter` before `backdrop-filter`. The minifier drops the unprefixed one otherwise.

## Recipes

- **Add a quotation:** append `{id, text, attribution}` to `src/content/passages/<page>.yml`, then add `<Passage id="..." />` where it belongs in `src/content/canon/<page>.mdx`. Text uses `*em*` for italics, `[text](url)` for links, and newlines for verse breaks.
- **Add a canon page:** create `src/content/canon/<id>.mdx` with the frontmatter in `src/content.config.ts`. It is served at `canon-<id>.html`, so add its link to `canon.astro`. `npm run verify:dist` fails if the sitemap and the pages disagree.
- **Add Today content:** edit `src/content/today.yml`. The pick is `dayOfYear % length`, so adding or removing an entry changes which entry every day maps to.
- **Add a styled component:** put its CSS beside it and add one `@import` line to `src/styles/index.css` in cascade order.
- **Add browser behavior:** one file in `src/scripts/`, started from `main.ts`. Put any logic worth testing in `src/lib/` first.
- **Add a deck card:** append an entry to `src/content/decks/wood.yml` or `sky.yml`. `art` must name a drawing in that deck's `src/scenes/<deck>/art.ts` (add the drawing and its name in `src/lib/decks.ts` first). A passage is `{text, attribution}` or `{ref: <canon passage id>}` when the canon already holds it. Wood cards in the Passage circle also need `question` and `table`.
- **Add a scene:** a directory under `src/scenes/` with `index.ts` exporting `mount(root, env)`, a loader line in `src/scripts/scenes.ts`, colors as `var()` tokens defined in `src/components/Deck.css`, and `env` for the clock, random, and storage. See `ARCHITECTURE.md`, Graphics convention.

## Traps

- `CHARTER.md` holds personal details about the owner. It is gitignored and was purged from history on 2026-10-18 (`docs/decisions/0007`). Never track it, stage it with `git add -f`, or copy biographical details from it into site content, commits, tickets, or docs.
- `.parity/` holds the recorded font HAR and built copies of old refs. It is gitignored. Delete `.parity/fonts.har` to re-record, then rerun the baseline self-comparison before trusting any result.
- Parity candidates must be built with `npm run build:parity`. A different `SITE` changes the `og:image` and fails the head check.
- Today's output depends on the local date, the hour, and `Math.random`. The harness freezes all three. Do not compare it by hand.
- `tests/unit/daily.test.ts` keeps the original day-number formula as an oracle, including its off-by-one in the first hour of each day under daylight saving time (`arb-65hn`). Fixing the bug means replacing that test.
- Only Chromium is tested (`arb-589u`). The `phone` Playwright project is Chromium at an iPhone viewport with touch, not WebKit, though iOS Safari and iOS Chrome both run WebKit.
- The prose pre-commit hook rejects em dashes and semicolons in added Markdown lines and in comments. Rendered copy in HTML, YAML values, and `.mdx` is exempt.
- Deck elements toggled with the `hidden` attribute also carry `display` rules, so `Deck.css` ends with a doubled-class `[hidden]` rule. Keep it last in that file.
- The deck end-to-end tests install a fake clock. The Sky's dark adaptation starts from an IntersectionObserver, so a test scrolls the dome into view and waits for the `adapting` class before advancing the clock.
