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


## Notes

**2026-10-19T06:14:49Z**

2026-10-18: the decks were checked by hand in Playwright's WebKit build (webkit-2370) on iPhone SE, 15, 15 Pro Max, and 15 landscape profiles. On Arch it needs libicu74, libxml2, libflite1, and libbacktrace0 from Ubuntu noble placed in the browser's minibrowser-wpe/sys/lib, a libjxl.so.0.8 link to the system libjxl, and PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1. The phone Playwright project is Chromium at an iPhone viewport. Adding WebKit to CI on ubuntu-latest would cover iOS Safari and iOS Chrome directly.
