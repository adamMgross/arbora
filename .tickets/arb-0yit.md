---
id: arb-0yit
status: open
deps: []
links: []
created: 2026-10-20T23:45:01Z
type: bug
priority: 3
assignee: Adam Gross
tags: [craft, parity]
---
# Deck page screenshots differ when parity compares a ref with itself

On 2026-10-20 npm run parity --base HEAD against a build of HEAD reported screenshot failures on wood.html and year.html (about 60 to 210 px), and the Sky's adaptation class differed between runs. The text, style, id, and link checks were clean. Animation timing on the deck pages is not frozen by the harness, so screenshot parity cannot gate a deck change.

