---
id: arb-6d4h
status: closed
deps: []
links: []
created: 2026-10-20T23:45:01Z
type: feature
priority: 1
assignee: Adam Gross
tags: [decks, pictures]
---
# Show the Year's windows as Hokusai and Hiroshige prints

Repeat the Wood's two commits for the Year (docs/decisions/0014). The approved match for all 72 windows is docs/research/deck-pictures/year.json (review page https://claude.ai/artifact/GFrLVY4oNXdj53F8H8boq5). The Year holds its windows as arrays in one entry, so the picture records need a home aligned to the windows, such as a pictures list keyed by window. Nearly every print needs a trim for its title box. Ten cannot be cleaned without losing part of the scene, so each needs digital removal of the text or a different print. Signatures and seals stay.

## Acceptance Criteria

Every Year window shows its print with no title, caption, or poem in it, the drawn window art is gone, the book credits each work, and npm run ci passes.

