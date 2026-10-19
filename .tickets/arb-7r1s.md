---
id: arb-7r1s
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 2
assignee: Adam Gross
tags: [craft, perf, pwa]
---
# Stop loading unused fonts and self-host the rest

Every page requests Source Sans 3, which no rule uses since --font-ui became EB Garamond, and tree.html requests Source Code Pro, which nothing uses. Fonts load from Google at runtime, so they are not precached and offline pages fall back.

## Acceptance Criteria

No unused family is requested, fonts ship from the site, and the offline e2e spec renders with the real fonts.

