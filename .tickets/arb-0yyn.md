---
id: arb-0yyn
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 3
assignee: Adam Gross
tags: [craft, css]
---
# Write the media queries mobile-first

DESIGN.md says mobile-first, the CSS is desktop-first with max-width queries at 900, 640 and 380 px.

## Acceptance Criteria

Base rules target phones and min-width queries add the larger layouts, with parity showing no visual change.


## Notes

**2026-10-19T06:16:10Z**

2026-10-18: the phone rules for the decks (docs/decisions/0011) were added to the existing 640 px max-width query at the end of Deck.css, following the current convention. They move with the rest when this restructure lands.
