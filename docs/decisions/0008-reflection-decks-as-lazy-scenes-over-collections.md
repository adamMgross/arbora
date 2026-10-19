---
id: 8
title: The reflection decks are lazy scene modules over validated collections with one journal shape
date: 2026-10-18
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

The owner commissioned three digital oracle decks, the Wood, the Sky, and the Year, and approved a final proposal that audited an earlier draft against a survey of oracle practice across history. The proposal asked for three decks that feel structurally different while sharing the structures those practices have in common: a held question, a threshold, an outcome ceded to chance or to the world, a finite vocabulary read with care, a record the asker returns to, and limits. The decks are the first rich graphics on the site, and `ARCHITECTURE.md` had reserved a shape for them without any code.

## Decision

Each deck is a page served by the pages collection, whose prose carries one `<Deck deck="..." />` component. The component renders an `<arbora-scene>` custom element with the deck's content as one JSON script. `src/scripts/scenes.ts` defines the element, and when it comes near the viewport it imports its scene module, so pages without a deck ship none of the deck code. Scene modules live in `src/scenes/` and own their markup, drawing, and behavior. They receive a clock, a random source, and a storage object from the caller, so tests freeze all three.

Content lives in three collections under `src/content/decks/`, validated by `strictObject` schemas. A card's art is an enum, so a card naming art that is not drawn fails the build. A card quotes passages as a list, each either inline text with an attribution or a `ref` to a canon passage, so a quotation already in the canon has one home. Passage lists grow by appending.

Colors in the drawings are CSS custom properties referenced with `var()` inside the SVG, defined on the deck's stage in `Deck.css`. Script never carries a color. One helper, `src/scenes/motion.ts`, answers `prefers-reduced-motion`.

The three decks keep what the reader writes under one local-storage shape, `{ entries, lastDay, draw }`, one key per deck. Entries carry an ISO stamp and whatever fields the deck adds, the parser keeps fields it does not know, and a missing field reads as null, so the shape grows without breaking what was already written.

The three decks sit at different poles of the design axes on purpose. The Wood is pure chance in three positions with a held, unspoken question. The Sky is read from the computed heavens with no chance except when the eye lands on no light (`docs/decisions/0009`). The Year is given by the calendar with one companion drawn, and keeps a perennial notebook.

## Consequences

Adding a card is a content edit, and a card with a typo in its art or a dangling passage reference fails the build, pinned by `tests/integration/content-integrity.test.ts`. The main script stays near its ceiling and the deck chunks load only on their pages, pinned by the hub test in `tests/e2e/decks.spec.ts`. The journals are per device and per browser, which is the site's existing rule for saved readings, so the Year offers a plain-text copy of its notebook. The drawings are code, which is a usable first edition and a brief for an illustrator, not the final art.

## Alternatives rejected

- One generic deck engine with three skins: rejected by the owner, who wanted the three to feel different in structure, not only in look.
- Rendering card art as static images: the Sky's dome and the Year's ring depend on the clock, and the card faces reference the page's color tokens, so they are drawn at runtime.
- A reader that copies colors from CSS into script for canvas: nothing uses canvas yet, so SVG with `var()` is enough and the browser re-reads the tokens on a color-scheme change for free.
