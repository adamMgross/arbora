---
id: arb-waph
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 3
assignee: Adam Gross
tags: [craft, tests]
---
# Check canon tables of contents against their headings

Each canon entry lists toc items with #ids that must match heading ids in its MDX body, and nothing verifies it.

## Acceptance Criteria

A test fails when a toc fragment has no matching id in the rendered page.

