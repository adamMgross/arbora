---
id: arb-ceno
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: bug
priority: 2
assignee: Adam Gross
tags: [content, today]
---
# Today links 5 readings to a canon page that holds a different page's copy of them, and about 40 to a page that does not contain them

Measured 2026-10-18 by matching a normalized prefix of each of the 90 readings against passages in src/content/passages. Readings 24, 31, 43, 55, 60 appear verbatim on a different canon page than the one they link to. About 40 appear verbatim on no canon page, which may be adaptation or may be a wrong link. The method is a prefix match, so the second number needs human review.

## Acceptance Criteria

Every reading either links to a page that contains it or has no link, and a test fails when a linked reading is absent from its page.

