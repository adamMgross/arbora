---
id: 7
title: Personal details are kept out of the repository and its history
date: 2026-10-18
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-19
---

## Context

`CHARTER.md` was the founding document and agent dispatch file. Part 1 and the appendices hold biographical details about the owner and their family. Early site copy drew on the same details: the owner's name beside the family's towns of origin, the owner's neighborhood and streets, a spouse and a pet, a specific tea, and the owner's daily routine. The repository and its legacy Pages site were public from creation on 2026-04-12, so the file and that copy were publicly readable from then until they were removed.

## Decision

Nothing that describes the owner personally is tracked, in any commit.

- `CHARTER.md` lives only on the owner's machine next to the code and is gitignored. It was removed from every commit with `git filter-branch` on 2026-10-18.
- Site copy speaks to the reader's own setting, not the owner's. The current copy was reworded on 2026-10-19, and every older version of each passage was rewritten in history to the same wording with `git filter-repo --replace-text`. The rules file stayed outside the repository.
- Both rewrites were force-pushed. A search over all commits finds no `CHARTER.md` and none of the removed details, apart from quotations and book titles that use the same words.

```
local only:   CHARTER.md (gitignored)
repository:   site copy in the reader's voice, every commit
GitHub cache: orphaned pre-rewrite commits, until purged or the repo is replaced
```

## Consequences

Fresh clones have no `CHARTER.md`, so an agent there cannot read its content rules. `README.md` and `VISION.md` restate the working rules, and `arb-eq17` tracks extracting a public content guide from the non-biographical parts. Commit hashes changed twice, so any link to an old hash breaks.

A force-push does not erase copies that already exist. GitHub keeps unreachable commits and serves them by hash, and anyone who cloned, crawled, or archived the repository or the site between 2026-04-12 and the rewrites may hold the old content. The owner plans to move the code to a new repository with no history and delete this one, which retires the orphaned commits (`arb-54cu`). Until then a GitHub Support request to purge cached objects is the fallback.

## Alternatives rejected

- Leave it public: rejected by the owner once it was noticed.
- Split off only the biographical part of `CHARTER.md` and keep the rest tracked: the owner asked for the whole file out of history. The split remains possible later as a new, reviewed document (`arb-eq17`).
- A private repository with free hosting elsewhere (Cloudflare, Netlify, Vercel): possible, and it would hide the orphaned commits, but the owner chose to stay on GitHub Pages.
- Delete and recreate the repository right away: deferred, not rejected, until the owner moves to a fresh repository.
