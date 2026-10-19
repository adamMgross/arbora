---
id: 7
title: CHARTER.md is kept out of the repository and its history
date: 2026-10-18
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

`CHARTER.md` was the founding document and agent dispatch file. Part 1 and the appendices hold biographical details about the owner and their family. The repository was private, and the owner chose to leave the file in place. Then the owner made the repository public to host the site on GitHub Pages, which put the file on a public remote.

## Decision

Remove `CHARTER.md` from every commit, keep a copy on the owner's machine next to the code, and gitignore it. History was rewritten with `git filter-branch` on 2026-10-18 and force-pushed. The rewritten history has no path or object named `CHARTER.md`.

## Consequences

Fresh clones have no `CHARTER.md`, so an agent there cannot read its content rules. `README.md` and `VISION.md` restate the working rules, and `arb-eq17` tracks extracting a public content guide from the non-biographical parts. Commit hashes changed, so any link to an old hash breaks.

A force-push does not erase copies that already exist. GitHub can keep unreachable objects and serve them by hash for a while, and a clone or crawler could have fetched the file during the hours the repository was public. The repository had no forks, stars, or watchers when checked. Full removal from GitHub's side needs a request to GitHub support to purge cached objects, or deleting and recreating the repository.

## Alternatives rejected

- Leave it public: rejected by the owner once it was exposed.
- Split off only the biographical part and keep the rest tracked: the owner asked for the whole file out of history. The split remains possible later as a new, reviewed document (`arb-eq17`).
- Delete and recreate the repository: the strongest removal, but it loses issues, settings, and Pages configuration, so it was not chosen.
