---
id: 4
title: Authored facts live in validated content collections
date: 2026-10-18
status: accepted
decided_by: agent
supersedes: null
superseded_by: null
verified_at: 2026-10-18
---

## Context

Quotations, invocations, principles, Today's rotation pools, and page links were typed into markup and an inline script. Seventeen of 147 canon quotations repeated across pages, Today kept 90 readings plus a parallel array of page links, and the copies had drifted.

## Decision

Every authored fact is a typed entry in an Astro content collection, validated by a Zod `strictObject` at build time.

- `passages` (YAML, one file per page), `invocations`, `principles`, and `today` use `yamlListLoader`, which rejects duplicate ids.
- `canon` and `pages` are MDX. Prose is markdown, headings and tables of contents stay explicit, and quotations are `<Passage id="..." />`.
- A passage keeps its attribution as one raw string rendered as written. Structured author, work, and locator fields are added later beside it.
- Order-sensitive pools (Today picks by `dayOfYear % length`) are arrays inside one `today` entry, so array order is the rotation order.
- Readings reference canon entries with `reference('canon')`, so a dangling link fails the build.
- Prose in `.mdx` and YAML values, never `.md`, because the portfolio prose hook checks added Markdown lines for em dashes and the content uses them as copy.

## Consequences

Adding a canon page or a passage is a content file, not markup. The migration moved text verbatim, so the known drift between copies survives and is ticketed (`arb-g4c9`, `arb-fcfg`). Passage ids are generated from page, section, and position, which is not stable enough to store elsewhere yet.

## Alternatives rejected

- One generic passage with free-form fields: cheaper now, but the five markup shapes in use would have become five different conventions inside strings.
- Normalizing attributions during the move: it changes visible text, so it could not pass the parity gate. It stays a separate ticket (`arb-3xfp`).
- Astro's `file()` loader for YAML: it leaves `id` in the data and does not guarantee duplicate-id detection.
