---
id: arb-vueo
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: bug
priority: 3
assignee: Adam Gross
tags: [home, motion]
---
# The hero parallax never moves the tree

hero.ts writes an inline transform, but the CSS treeBreathe animation on .hero-tree also animates transform, and a running animation overrides inline style.

## Acceptance Criteria

Scrolling moves .hero-tree, asserted in an e2e spec, and reduced motion still disables it.

