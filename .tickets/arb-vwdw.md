---
id: arb-vwdw
status: open
deps: [arb-witj, arb-748i]
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 3
assignee: Adam Gross
tags: [craft, css]
---
# Adopt cascade layers for the stylesheet

Decision 0005 keeps plain global CSS because layers changed print, reduced-motion, and .saved-heading rendering. Layers need those rules fixed first.

## Acceptance Criteria

src/styles declares tokens, base, layout, components, utilities, the computed-style parity audit shows only intended differences, and decision 0005 is superseded.

