---
id: 2
title: Existing page URLs are a wire format and do not change
date: 2026-10-18
status: accepted
decided_by: agent
supersedes: null
superseded_by: null
verified_at: null
---

## Context

The manifest `start_url` is `today.html`, installed PWAs and bookmarks point at `.html` URLs, and the sitemap lists them. A URL is observable by consumers the repo does not control, so it sits below the line where refactoring reaches.

## Decision

Astro builds with `build.format: 'file'` and `trailingSlash: 'ignore'`, so `src/pages/today.astro` emits `today.html` and a `[slug]` route emits `canon-stoics.html`. Nav hrefs stay relative, which is safe because every route is flat. `site` and `base` come from the environment, so the same build serves a project subpath or a custom domain.

## Consequences

A route check compares every page in the baseline against the build and fails if one disappears. A future move to clean URLs is a new decision with redirects, not a side effect of the migration.

## Alternatives rejected

- Clean URLs (`/today/`): nicer, but breaks every existing bookmark and the installed PWA entry point for no user benefit today.
