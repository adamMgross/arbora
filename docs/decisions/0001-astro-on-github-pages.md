---
id: 1
title: Build the site with Astro and deploy it with a GitHub Action
date: 2026-10-18
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: null
---

## Context

The site is 21 hand-written HTML pages. The head, nav, and footer are copied into every page, the page list is kept by hand in four files, and content such as the 90 daily readings is duplicated and has drifted. The owner wants a maintainable, extensible architecture that stays deployable on GitHub Pages and can host richer graphics later.

## Decision

Build with Astro 7, using content collections with Zod schemas for every structured fact and MDX for authored prose. A GitHub Action runs the quality gate, then publishes `dist/` with `actions/deploy-pages`. The same stack serves adammgross.github.io, so one set of conventions covers both.

## Consequences

Pushing no longer serves raw files. The build needs Node 22.22 or newer. Content is validated at build time. Islands and custom elements give a path to canvas or WebGL without shipping JS to every page.

## Alternatives rejected

- Eleventy: lighter, but graphics later would mean hand-wiring a bundler per page, and it gives no typed content layer.
- Staying build-free with Web Components and runtime JSON: no toolchain, but the shell would be injected by JS, which hurts first paint and no-JS reading, and nothing validates content before it ships.
