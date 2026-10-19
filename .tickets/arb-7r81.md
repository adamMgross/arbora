---
id: arb-7r81
status: closed
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 4
assignee: Adam Gross
tags: [craft, graphics]
---
# Add the graphics layer when the first scene lands

ARCHITECTURE.md records the convention: a custom element that imports its scene code when visible, a theme reader that takes colors from CSS variables, and one reduced-motion signal. None of it exists yet because no scene does.

## Acceptance Criteria

The first scene follows the convention and ARCHITECTURE.md Shape lists its module.


## Notes

**2026-10-19T04:11:40Z**

Landed with the three reflection decks on 2026-10-18. ARCHITECTURE.md Graphics convention and Shape 11 to 14 describe the module (src/scripts/scenes.ts plus src/scenes/).
