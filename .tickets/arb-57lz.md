---
id: arb-57lz
status: closed
deps: []
links: []
created: 2026-10-19T06:16:10Z
type: feature
priority: 1
assignee: Adam Gross
tags: [decks, mobile]
---
# Tailor the oracle decks for phones

The owner said the oracle pages are opened almost only on phones, in Safari and Chrome on iOS. Audit the decks at phone sizes in WebKit and Chromium and fix what does not work.

## Acceptance Criteria

At an iPhone 15 viewport each deck runs edge to edge with no side scroll, touch targets are at least 44 px, the result of each tap comes into view, plates and labels are readable, and the landscape dome fits the screen. Pinned by the phone Playwright project.


## Notes

**2026-10-19T06:16:10Z**

Done. Decision 0011, tests/e2e/phone.spec.ts, phone project in playwright.config.ts. Checked by hand in Playwright WebKit on iPhone SE, 15, 15 Pro Max, 15 landscape, and in Chromium on a Galaxy S24.
