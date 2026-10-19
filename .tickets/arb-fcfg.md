---
id: arb-fcfg
status: open
deps: [arb-g4c9]
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 2
assignee: Adam Gross
tags: [craft, content]
---
# Give passages stable ids and let Today reference canon passages

Passage ids are generated from page, section and position, so reordering a section renumbers them. Today stores 90 readings as separate text, and 17 of 147 canon quotes repeat across pages. Saved readings should carry a stable id beside text and source, never in place of them.

## Acceptance Criteria

Ids are semantic and unique, Today readings reference passage ids, saved readings written by the old shape still load, and a test covers both.

