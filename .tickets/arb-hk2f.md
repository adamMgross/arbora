---
id: arb-hk2f
status: open
deps: [arb-5mng]
links: []
created: 2026-10-19T00:07:49Z
type: owner
priority: 1
assignee: Adam Gross
tags: [hosting]
---
# Set the Pages source to GitHub Actions and approve the first push

The deploy workflow in .github/workflows/deploy.yml has never run. A push to main runs it, and it will fail until Pages is enabled with the Actions source. No push has been made for this restructure.

## Acceptance Criteria

The Deploy workflow is green on main and https://adammgross.github.io/arbora/ serves today.html.


## Notes

**2026-10-19T02:28:40Z**

2026-10-18: owner enabled Pages with build_type=workflow. Remaining: owner approval to push main, and the CHARTER.md exposure decision (it is on the public remote).
