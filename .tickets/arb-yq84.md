---
id: arb-yq84
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: bug
priority: 2
assignee: Adam Gross
tags: [motion, a11y]
---
# Reduced motion may not stop the infinite tree sway

The prefers-reduced-motion block sets animation-duration to 0.01ms with !important but does not set animation-iteration-count, so an infinite animation keeps cycling. Found by reading src/styles/motion.css, not yet observed in a browser.

## Acceptance Criteria

With reducedMotion set, document.getAnimations() reports no running animation on tree.html, asserted in an e2e spec.


## Notes

**2026-10-19T00:10:03Z**

Observed 2026-10-18 in Chromium with reducedMotion=reduce: document.getAnimations() on tree.html still reports a running infinite animation on #arbora-tree (tree-sway, duration 0.01ms). index.html reports none, so only the tree is affected. The block in src/styles/motion.css has no rule for #arbora-tree.
