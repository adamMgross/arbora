---
id: arb-65hn
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: bug
priority: 3
assignee: Adam Gross
tags: [today]
---
# Today shows the previous day's content between midnight and 1 AM during daylight saving time

dayOfYear subtracts local midnight of Dec 31 in standard time, so during DST the first hour of each day counts as the day before. 2026-04-22 00:30 gives 111 and 01:30 gives 112. tests/unit/daily.test.ts keeps the original formula as an oracle that locks this in.

## Acceptance Criteria

dayOfYear returns the same number for every instant of one local calendar day, and the oracle test is replaced by that invariant.

