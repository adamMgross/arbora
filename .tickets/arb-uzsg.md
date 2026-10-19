---
id: arb-uzsg
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: bug
priority: 3
assignee: Adam Gross
tags: [today]
---
# Shuffling the reading on Today deletes its copy button

setReading assigns textContent on the blockquote, which removes the button copy.ts appended. The e2e spec asserts the button exists after load only.

## Acceptance Criteria

An e2e spec asserts the copy button is present after a shuffle.

