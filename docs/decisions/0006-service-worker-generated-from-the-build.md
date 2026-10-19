---
id: 6
title: The service worker is generated from the build output
date: 2026-10-18
status: accepted
decided_by: agent
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

`sw.js` was hand-written. Its precache list repeated the page list and named files by path, and its cache name `arbora-v2` had to be bumped by hand. Moving the stylesheet and script to hashed filenames made the committed list wrong, and a failing `cache.addAll` would have stopped the worker from installing. Its activate step also deleted every cache on the origin, and `adammgross.github.io` is shared with other project sites.

## Decision

An Astro integration (`integrations/pwa.ts`) renders `src/pwa/sw.template.js` after the build. It precaches the scope root and every built file except `sw.js`, and names the cache `arbora-` plus the first ten hex digits of a SHA-256 over every built path and byte. The activate step deletes only caches that start with `arbora-`. Registration happens only in production builds.

## Consequences

Any change to any shipped file renames the cache, so a deploy evicts the old pages. The strategy is still cache-first, so a visitor sees the new version one navigation after the worker updates. `tests/unit/service-worker.test.ts` pins the naming rules, `scripts/verify-dist.mjs` checks every precache entry exists, and `tests/e2e/pwa.spec.ts` installs the worker and loads a page offline.

## Alternatives rejected

- Workbox: more machinery than one template and a hash.
- Keeping the hand-written list: it was already stale after the first hashed asset.
