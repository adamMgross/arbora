---
id: 3
title: Migrate in refactor commits behind a parity gate, then fix behavior separately
date: 2026-10-18
status: accepted
decided_by: agent
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

The migration touches every page, the whole stylesheet, and all behavior. Mixing restructure with fixes would make each hunk unreviewable. The site also carries known defects: five wrong canon links on Today, two disconnected canon prev/next chains, a dead hero parallax, and a copy button lost on shuffle.

## Decision

Phases P0 to P5 are refactors. Each commit must pass `npm run parity -- --base HEAD~1` with zero differences in normalized visible text, head tags, element ids, and link targets, and screenshots within tolerance across 21 pages, three widths, and both color schemes. The harness freezes the clock, seeds `Math.random`, replays recorded Google Fonts, and disables animations. Known defects survive the refactor on purpose and are fixed afterward, one ticket and one commit each, with parity re-baselined against the previous commit.

The harness proves itself first: the baseline compared against itself shows zero differences on three consecutive runs, and a deliberately altered copy fails on text, title, link, and screenshot changes.

## Consequences

Parity runs take about three minutes with screenshots and seconds without. Screenshot tolerance is `threshold 0.1` and `maxDiffPixels 50`, so a single-unit color change is not detected. Text, head, id, and link checks are exact.

## Alternatives rejected

- Fixing defects as they are found during the move: smaller total diff, but the reviewer cannot tell which hunks were meant to be inert.
- Hand verification in a browser: does not scale to 126 screenshots and a date-dependent page.
