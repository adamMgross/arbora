---
id: arb-54cu
status: open
deps: []
links: []
created: 2026-10-19T13:45:08Z
type: owner
priority: 2
assignee: Adam Gross
tags: [privacy]
---
# Move the code to a new repository with no history and delete this one

Orphaned pre-rewrite commits on GitHub still hold CHARTER.md and the personal site copy and are fetchable by hash (docs/decisions/0007). Copy the clean tree into a new repository as one initial commit, enable Pages with the GitHub Actions source, confirm the Deploy workflow is green, then delete this repository. The site address stays the same if the new repository keeps the name arbora. Until this is done, a GitHub Support request to purge cached objects is the fallback.

