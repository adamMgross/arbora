---
id: arb-5mng
status: closed
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: owner
priority: 1
assignee: Adam Gross
tags: [hosting]
---
# Make the repo public or move to a plan that serves Pages from a private repo

gh api shows the repo is private and Pages is not enabled. Pages from a private repo needs a paid plan, and the published site is public either way.

## Acceptance Criteria

gh api repos/adamMgross/arbora/pages no longer returns 404 once Pages is enabled.

