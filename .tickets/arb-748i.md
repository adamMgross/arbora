---
id: arb-748i
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 2
assignee: Adam Gross
tags: [craft, css]
---
# Dark mode should remap semantic tokens instead of redefining the palette

src/styles/tokens.css redefines the palette in dark mode with inverted meanings, so --earth becomes a light color and the footer needs a literal override. About 112 rgba() literals copy light-mode palette values and ignore dark mode.

## Acceptance Criteria

Dark mode changes only semantic tokens, palette colors are referenced through color-mix or tokens, and a check forbids palette rgba literals.

