---
id: arb-witj
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: bug
priority: 3
assignee: Adam Gross
tags: [print]
---
# Print rules for headings and links lose to screen rules

Observed 2026-10-18 while trying cascade layers: in print emulation h1 stays 50.4px and links keep screen colors, because the print block uses low-specificity selectors that .page-header h1 and similar beat.

## Acceptance Criteria

A parity-style check of print emulation shows the intended print sizes and colors.

