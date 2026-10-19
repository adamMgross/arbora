# Vision

## Problem

Arbora is a syncretic, non-theistic religion of interconnection, deep time, and presence, built by curating existing ancient traditions rather than inventing new text. It needs a home that can be read daily on a phone, that grows without its structure decaying, and that costs nothing to host. The founding context and the content rules live in the owner's local `CHARTER.md`, which is not in this repository (`docs/decisions/0007`). The rules that matter for content are restated below and in the README.

The first version proved the ideas as 21 hand-written pages. Its structure did not scale: the shell was copied into every page, the same quotation and invocation text existed in several places and had drifted, and the page list was kept by hand in four files. The restructure recorded in `STATE.md` fixes the structure and leaves the content and the look as they were.

## Who it is for

The owner, reading mostly on a phone in the spare minutes of an ordinary day, and anyone the owner chooses to share it with. Future agents extend the canon and the code, so the repository has to orient them without a conversation.

## Utility goals

1. Every page is readable and navigable on a phone. Touch targets are at least 44 px and typography holds at mobile sizes. Not yet pinned by a test.
2. Today shows a morning invocation, a reading, and an evening reflection that are the same for a given day and different on the next, and can be shuffled and saved. Pinned by `tests/e2e/behavior.spec.ts` and `tests/unit/daily.test.ts`.
3. The site works offline after the first visit. Pinned by `tests/e2e/pwa.spec.ts`.
4. The site is static files on GitHub Pages with no server. Pinned by `npm run ci`, which builds and verifies the deployed base path.
5. Every URL that existed before the restructure still exists. Pinned by the route check in `npm run parity`.
6. The canon never closes, but stays lean: three tiers, curated not invented, ancient traditions primary. Reviewed by the owner, not by a test.

## Craft goals

The owner's portfolio treats beauty and economy as deliverables (`~/projects/portfolio/decisions/0004-craft-is-a-goal.md`). This codebase exists to exemplify four things.

1. **One source for every fact.** A quotation, invocation, principle, or page link is stored once and rendered by a component. Where it is still stored twice, a ticket says so.
2. **Refactors that prove themselves.** A restructuring commit must pass `npm run parity` against the previous version: identical visible text, head tags, ids, links, computed styles, and screenshots across nine configurations. Behavior changes are separate commits.
3. **Components that own their styles and logic.** Each concern has one file with a stated owner, pure logic sits apart from DOM code, and the cascade order is written down in one place.
4. **Room for rich graphics.** New canvas, WebGL, or SVG scenes can be added without reworking the shell, the styles, or the build.

Performance targets. Measured 2026-10-18 from `dist/`: stylesheet 41.5 KB raw and 8.3 KB gzipped, script 7.6 KB raw and 3.1 KB gzipped, heaviest page `today.html` 40.7 KB raw and 14.0 KB gzipped with HTML only. The agent proposes, and the owner has not confirmed, these ceilings: script stays under 10 KB gzipped with no runtime dependency, and the stylesheet stays under 10 KB gzipped. A graphics scene loads only on the pages that use it.

## Non-goals

- No new features during the restructure. The owner has none queued.
- No server code, accounts, or database. Saved readings live in the reader's browser only.
- No legalistic or prescriptive content. Practices stay loose and invocational.
- No secular-naturalism framing. Ancient traditions are primary and modern writers are secondary.

## Success criteria

- `npm run ci` passes: format, type check, unit, build, root and deployed-path verification, content integrity, and end-to-end tests.
- The Deploy workflow is green and the site serves from `adammgross.github.io/arbora/`. Blocked on the owner tickets tagged `hosting`.
- The remaining tickets marked `craft` are closed or deliberately declined with a decision record.

## Horizon

1. **Restructure.** Done locally 2026-10-18, not pushed.
2. **Hosting.** The owner enables Pages and confirms the address. The first deploy runs.
3. **Behavior and content.** Fix the known defects and reconcile drifted text, one ticket and one commit each, with the owner choosing the winning wording.
4. **Graphics.** Add the first rich scene following the convention in `ARCHITECTURE.md`.

## Settled scope

- Astro on GitHub Pages (`docs/decisions/0001`).
- Page URLs do not change (`docs/decisions/0002`).
- Refactors are gated by parity (`docs/decisions/0003`).
- Content lives in collections validated at build time (`docs/decisions/0004`).
- The stylesheet is plain global CSS from owner files in one order (`docs/decisions/0005`).
- The service worker is generated at build time (`docs/decisions/0006`).
- `CHARTER.md` is a local, gitignored file. It is never committed, and it is absent from the repository and its history (`docs/decisions/0007`).
