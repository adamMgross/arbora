# Arbora

A syncretic, non-theistic religion of interconnection, deep time, and presence, published as a static site on GitHub Pages. The one rule that matters most: curate from existing traditions, never invent. Read `CHARTER.md` Part 0 before touching any content.

This repo follows `~/.claude/CLAUDE.md` in full. This file adds only what is specific to this repo and not derivable from the code.

The site is mid-migration from hand-written HTML to Astro. The plan is in `docs/decisions/0003-two-hats-migration-with-a-parity-gate.md`. Until the migration lands, the pages in the repo root are the source of truth and `baseline/pre-astro` is the tag every parity run compares against.

## Reading order

1. `CHARTER.md` Part 0 and Part 2: content principles and the eight religious functions.
2. `docs/decisions/README.md`: index of decision records. Read one before revisiting the choice it records.
3. `DESIGN.md`: the design language. Tokens in `src/css/style.css` win where the two disagree.

## Commands

```bash
npm install
npm test                          # vitest unit
npm run parity -- --base <ref>    # compare dist (or --candidate <ref|dir>) against a git ref, about 3 minutes
npm run parity -- --base <ref> --no-screenshots   # text, head, id, and link parity only, seconds
```

## Invariants

Breaking one of these is a defect, not a tradeoff.

- A migration commit is a refactor: `npm run parity` against the previous commit must show zero text, head, id, or link differences. Behavior changes are their own commits.
- Every URL that exists today keeps its name: `today.html`, `canon-stoics.html`, and the rest (decision 0002).
- Content (YAML values and `.mdx`) is never rewritten for style while it moves. Move it verbatim, fix it in a separate commit.

## Traps

- `.parity/` holds the recorded Google Fonts HAR and built baseline sites. It is gitignored. Delete `.parity/fonts.har` to re-record, which changes every screenshot, so re-run the self-comparison afterward.
- `today.html` output depends on the local date, time of day, and `Math.random`. The parity harness freezes all three. Do not compare it by hand.
- The prose pre-commit hook rejects em dashes and semicolons in added Markdown lines and in comments. Rendered copy in HTML, YAML values, and `.mdx` is exempt.
