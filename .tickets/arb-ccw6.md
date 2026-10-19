---
id: arb-ccw6
status: open
deps: []
links: []
created: 2026-10-19T04:11:40Z
type: owner
priority: 2
assignee: Adam Gross
tags: [decks, owner]
---
# Decide whether the Sky asks for the reader's location or stays on California

The Sky computes the heavens for a fixed point in central California (CALIFORNIA in src/lib/sky-dome.ts). The alternative is asking the browser for geolocation on first use, with California as the fallback. Decision 0009 records the current choice.

