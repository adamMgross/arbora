---
id: arb-589u
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 3
assignee: Adam Gross
tags: [craft, tests]
---
# Run the e2e specs in Firefox and WebKit

Only Chromium is exercised. The minifier dropped the unprefixed backdrop-filter and Chromium alone caught it. Safari and Firefox behavior is untested.

## Acceptance Criteria

The e2e suite passes in three engines in CI.

