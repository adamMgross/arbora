---
id: arb-lj8n
status: open
deps: []
links: []
created: 2026-10-20T23:45:01Z
type: feature
priority: 1
assignee: Adam Gross
tags: [decks, pictures]
---
# Show the Sky's plates as their Doré, Flammarion, and Verne engravings

Repeat the Wood's two commits for the Sky (docs/decisions/0014): picture records and masters with no page change, then the switch that deletes the drawn faces. The approved match for all 62 plates is docs/research/deck-pictures/sky.json (review page https://claude.ai/artifact/UERrRCVV9x393cpgDqXCV4). Eight plates need a trim for a printed caption or inscription (their crop notes say where). Venus, the Sun, Jupiter, and the Old Light are faded scans and the Long Sleep is about 320 px, so each needs a better copy of the same work. Island Three is the one color plate, by the owner's choice.

## Acceptance Criteria

Every Sky plate shows its picture, the drawn plate art and SKY_ART are gone, the book credits each work, tests/unit/deck-pictures.test.ts covers sky, and npm run ci passes.

