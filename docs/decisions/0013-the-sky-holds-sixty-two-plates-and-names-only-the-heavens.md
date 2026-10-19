---
id: 13
title: The Sky holds sixty-two plates, and its dome names only the seven heavens
date: 2026-10-19
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-19
---

## Context

With unlimited draws (`docs/decisions/0012`), the owner asked for at least twice as many Sky plates so repeated draws stay varied. The deck had 31: seven heavens, sixteen fixed-star plates, and eight mysteries beyond the stars.

## Decision

The Sky now has 62 plates. Twenty-two new fixed-star plates complete the twelve signs (the Ram, the Crab, the Maiden, the Scales, the Goat-Fish, the Water-Bearer, the Fishes) and add the Pole Star, the Dragon, the Crown, the Kneeler, the Serpent-Bearer, Berenice's Hair, the Hero, the Winged Horse, the Charioteer, the Crow and the Cup, the River, the Whale, the Dolphin, the Southern Fish, and the Little Cloud. Nine new mysteries are the World Egg, the Widening, the Great Year, the Long Sleep, the Edge, the Dust and the Stars, the Breath, the Far Traveler, and the Last Light. Each has a verified passage from a public-domain translation, lore confirmed on a page that was opened, and its own drawing. Each new figure carries real star positions, so it is drawn on the dome and a draw of it lands where it stands.

```
dome before:  36 figures drawn, 36 names   ->  a wall of small caps
dome now:     36 figures drawn, the seven heavens named, N E S W
```

With 36 figures, naming every one buried the dome in labels. The dome now names only the Sun, the Moon, and the five planets. Each figure's name is on its plate.

## Consequences

The drawings live in `src/scenes/sky/art-zodiac.ts`, `art-figures.ts`, and `art-mysteries.ts`, over shared helpers in `ink.ts`, the way the Wood splits its plates. Tests pin that every new figure has well-formed star data and rises at least fifteen degrees over California at some hour of the year. The new plates still need the owner's read for tone (`arb-y8k3`).

## Alternatives rejected

- The twenty-eight lunar mansions as a new kind of plate: a real tradition across Arabic, Indian, and Chinese astronomy, but it would add a fourth structure to the deck and dominate it.
- Planets beyond Saturn and comets: the first needs instruments, which the owner ruled out for this deck, and the second has no position to place a draw.
- Keeping every name on the dome at a smaller size: it is still a wall of text, and on a phone the labels fall below a readable size.
