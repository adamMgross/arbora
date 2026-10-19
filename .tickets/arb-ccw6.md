---
id: arb-ccw6
status: closed
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


## Notes

**2026-10-19T04:52:16Z**

Decided 2026-10-18 at the owner's request to finish the open items: California stays the default and a quiet link asks for the reader's location only when tapped, rounded to about ten kilometers and kept on the device. Decision 0010.
