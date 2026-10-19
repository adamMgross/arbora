---
id: arb-6dmi
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 3
assignee: Adam Gross
tags: [craft, content]
---
# Move one-off page copy out of the page templates

index.astro, today.astro, tree.astro and canon.astro still hold their prose and card text in markup, so the invariant that src/pages holds no prose only covers the MDX pages.

## Acceptance Criteria

Either the copy moves into content files or ARCHITECTURE.md states why these four stay templates.

