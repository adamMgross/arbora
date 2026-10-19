---
id: arb-32io
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: owner
priority: 2
assignee: Adam Gross
tags: [hosting]
---
# Decide the public address: adammgross.github.io/arbora or arbora.site

The old sitemap and og:image pointed at arbora.site, which has no CNAME. The build now defaults to the github.io project path. A custom domain needs DNS, a CNAME file in public/, and SITE and BASE_PATH changed in the workflow.

## Acceptance Criteria

SITE and BASE_PATH in deploy.yml and package.json build:prod match the chosen address, and npm run ci passes.

