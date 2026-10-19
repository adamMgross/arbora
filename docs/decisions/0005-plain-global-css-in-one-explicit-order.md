---
id: 5
title: The stylesheet is plain global CSS from owner files in one explicit order
date: 2026-10-18
status: accepted
decided_by: agent
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

The original 2,937-line stylesheet scattered one component's rules across up to five places. The plan was to split it by owner and put each part in a cascade layer (`tokens, base, layout, components, utilities`) so bundle order could not matter.

Trying that broke parity in ways screenshots at scroll position zero could not see. Layer order beats specificity, so rules that used to lose now win: the print block overrode screen headings, the reduced-motion block overrode transforms, and `.saved-heading` lost its margin to a component rule. A computed-style comparison of every element on every page found them.

## Decision

Split the stylesheet by owner, one file each, as plain CSS with no `@layer`. `src/styles/index.css` is the only importer and lists the files in an order that keeps the original relative precedence. Specificity and source order decide the cascade, as they always did. Component files sit beside their component (`src/components/SiteNav.css`), page and shared files in `src/styles/`.

The harness now compares computed styles for every element, plus `::before` and `::after`, in nine configurations including print, reduced motion, and touch. That check is what makes a split provably inert.

## Consequences

Every page ships the whole 41 KB stylesheet, which is 8 KB gzipped and cached across pages. Adding a component with styles means adding one line to `index.css`. The cascade stays fragile in the way the original was, and `arb-vwdw` tracks adopting layers once print, dark mode, and `.saved-heading` are fixed.

The minifier drops the unprefixed `backdrop-filter` when `-webkit-backdrop-filter` follows it, which silently removed the nav blur in Chromium. The prefixed declaration must come first. `tests/e2e/behavior.spec.ts` pins it.

## Alternatives rejected

- Cascade layers now: not behavior-preserving, as observed.
- Scoped Astro styles: selectors such as `.page-content blockquote` cross component boundaries and would need `:global()` everywhere.
- Importing each component's CSS from the component for per-page delivery: the bundle order then varies by page, so ties between equal-specificity rules would flip silently.
