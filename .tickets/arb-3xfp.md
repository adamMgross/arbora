---
id: arb-3xfp
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: craft
priority: 3
assignee: Adam Gross
tags: [craft, content]
---
# Render passage attributions from structured fields

Attributions are one free-text string that mixes locator, translator, adaptation notes and paraphrase flags. The schema in src/content.config.ts can accrete optional author, work, locator, translator and fidelity fields beside attribution.

## Acceptance Criteria

Fields are optional in the schema, populated for the Stoics page, and the page renders from them with the same visible text.

