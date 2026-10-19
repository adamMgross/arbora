---
id: arb-nlmj
status: open
deps: [arb-hk2f]
links: []
created: 2026-10-19T00:07:49Z
type: chore
priority: 3
assignee: Adam Gross
tags: [ci]
---
# Confirm the workflow's action versions and run it once in CI

deploy.yml pins checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v3 and deploy-pages@v4 from memory. The workflow and playwright install --with-deps have never run on GitHub.

## Acceptance Criteria

A run on GitHub is green and the versions are current majors.

