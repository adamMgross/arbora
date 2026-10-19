---
id: 11
title: The decks are designed for phones first
date: 2026-10-18
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

The owner said the oracle pages will be opened almost only on phones, in Safari and Chrome on iOS, both of which run WebKit. The decks had been laid out at desktop width and checked at one narrow width. An audit on iPhone SE, iPhone 15, iPhone 15 Pro Max, iPhone 15 in landscape, and a Galaxy S24 found the result of a tap landing off screen (the Sky's plate about 390 px below, the Year's needle above the button that turns it), the Wood's plates about 100 px wide at the step that asks the reader to look at them, dome and ring labels at 6 to 8 px, a dome twice the height of a landscape screen, hover colors that stuck after a tap, and an orphaned card on the hub.

## Decision

The phone is the design target and the desktop layout is the variant. At 640 px and below, which is also where the site's root type drops to 16 px:

```
 desktop                         phone
 +--------------------+          +----------+
 | ring  |  pair      |          | ring     |
 | actions            |          | actions  |
 +--------------------+          | pair     |
                                 +----------+
 Wood look step: triptych   ->   plates ~70% wide, swiped sideways
 Sky plate: 210 px          ->   up to 300 px
 dome labels: 10 units      ->   15 units, placed by least overlap
```

- A deck runs edge to edge, cancelling the page gutter.
- After each tap, the scene brings what it produced into view with `reveal` in `src/scenes/motion.ts`, which scrolls only when the element is not already on screen and does so instantly under reduced motion.
- The Wood keeps the lights and the small triptych on one screen during the walk, then spreads the plates into a sideways row sized by both screen width and height, so a plate and the Open button fit together.
- The Year puts its buttons between the ring and the pair, so the needle and the drawn card are both next to the button that turns it.
- The dome is capped at the screen's height in landscape.
- Hover colors apply only on devices that hover. Taps give feedback through `:active`, and the gray tap flash and double-tap zoom are switched off inside a deck.

## Consequences

`playwright.config.ts` has a `phone` project, an iPhone 15 viewport with touch on Chromium. It runs the whole deck spec plus `tests/e2e/phone.spec.ts`, which pins edge-to-edge width, no side scroll, 44 px touch targets, each result coming into view, plate and label sizes, and the landscape dome. CI still runs only Chromium (`arb-589u`), so WebKit was checked by hand with Playwright's WebKit build. Phone landscape works, but the Wood's walk does not fit on one screen there and the reader scrolls. The dome placement change also moves some labels on desktop, where it removes overlaps that were there before.

## Alternatives rejected

- A tap-to-enlarge lightbox for the Wood's plates: it adds a modal layer and a close gesture to a step that only needs the plates to be large.
- Stacking the three plates vertically: it pushes the Open button three screens down and loses the sense of a triptych.
- Shortening dome labels on phones by dropping "The": the plates and the heavens line use the full names, and least-overlap placement fixed the crowding without it.
