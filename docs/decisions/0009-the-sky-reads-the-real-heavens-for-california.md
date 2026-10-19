---
id: 9
title: The Sky deck reads the real heavens for a fixed California location and shows no numbers
date: 2026-10-18
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

The earlier proposal drew the Sky by shuffling cards and showed the night sky as a footnote. The survey of oracle practice put reading from the world (the flight of birds, the liver, the stars) at the older pole opposite chance, and the three decks needed to occupy different poles. Two drafts of a sky that computed real positions were rejected by the owner as too scientific and too much like a story, and the approved version reads the same positions as symbol.

## Decision

The Sky computes where the Sun, Moon, and five naked-eye planets stand, which fixed-star figures have risen, and where the ecliptic and the Milky Way run, from an approximate model in `src/lib/sky-math.ts`: the JPL approximate Keplerian elements for the planets, a short series for the Moon, and a plain sidereal-time conversion to altitude and azimuth. The place is fixed at the center of California (`CALIFORNIA` in `src/lib/sky-dome.ts`) and the time is the reader's clock. Whichever light stands nearest where the reader looks opens its plate. When no light stands within reach, one of the eight mysteries beyond the stars answers by chance.

The plates never print a number. The dome is drawn as an atlas, the sentence under it names each heaven's tropical zodiac sign and whether it has risen, and every plate is read above (what the light has meant across traditions) and below (one thing to set down, one to receive). The page says once that the deck predicts nothing.

## Consequences

The model is good to about a degree in the current decades, enough to say what is above the horizon and in which sign. `tests/unit/sky-math.test.ts` pins it against the 2020 great conjunction, the 2020 Mars opposition, the 2026 equinox, and a reference new moon. Variety is lower than a shuffle, since the same heavens stand open for weeks, which suits a deck about patience but means each plate must be deep. A reader outside California sees California's sky, and `arb-` tickets record the owner's open choice of asking for location instead.

## Alternatives rejected

- Shuffling the plates and showing the sky as decoration: it makes the Sky a second Wood with a different palette, and loses the one pole of the design axes that the other two decks cannot hold.
- A full ephemeris library: hundreds of kilobytes for precision the deck never shows.
- Asking for the browser's geolocation on first use: a permission prompt at the door of a quiet page, deferred to the owner.
