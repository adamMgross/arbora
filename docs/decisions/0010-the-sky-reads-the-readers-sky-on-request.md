---
id: 10
title: The Sky reads the sky over the reader on request, and California by default
date: 2026-10-18
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

Decision 0009 fixed the Sky's place at the center of California and left asking for the reader's location to the owner. The owner asked for the open items to be finished, which included this choice. A permission prompt on arrival would break the quiet threshold the deck is built around, and a reader in Seattle or Sydney sees a sky that is not theirs.

## Decision

California stays the default. Under the line that names where the heavens stand, one quiet link reads "Read the sky over where you are". Only a tap on it asks the browser for a location. The answer is rounded to a tenth of a degree, about ten kilometers, and kept in `localStorage` under `arbora-place` on that device, and the same link then offers to return to the California sky. A refusal leaves the sky over California and says so in one line. The scene receives the lookup as `env.locate`, like its clock and storage, so the tests drive it through Playwright's geolocation.

## Consequences

No permission prompt appears unless the reader asks for one, and nothing about the place leaves the device. `src/lib/place.ts` validates what storage returns, pinned by `tests/unit/place.test.ts`, and the round trip and the refusal are pinned in `tests/e2e/decks.spec.ts`. The plates and the heavens line need no change, because the dome projection works at any latitude.

## Alternatives rejected

- Prompting for location on first visit: it puts a browser dialog at the door of a page that begins by asking you to let your eyes adjust.
- Typing a city: it needs a place-name lookup, which means a service or a bundled gazetteer, for a choice a single tap can make.
