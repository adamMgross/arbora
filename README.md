# Arbora

A syncretic, non-theistic religion of interconnection, deep time, and presence. This is a living project and the canon is never closed.

The site is static, built with Astro, and published to GitHub Pages. Content lives in `src/content/` as YAML and MDX, validated at build time.

## Run it

```bash
npm install
npm run dev     # local server
npm run ci      # everything the deploy workflow runs
```

Node 22.22 or newer. `npm run build` writes `dist/`. `npm run build:prod` builds for the `/arbora/` path that Pages serves.

## Layout

```
src/content/    canon, prose pages, quotations, invocations, principles, Today's pools, the decks' cards
src/pages/      routes ([slug].astro serves every canon and prose page)
src/layouts/    page shells
src/components/ markup pieces, with a stylesheet of the same name where they have one
src/lib/        pure logic, including the sky math and the window calendar
src/scripts/    browser behavior, one module per concern
src/scenes/     the three reflection decks, loaded only on their pages
src/styles/     tokens, base, layout, prose, and page-level styles, imported by index.css
integrations/   build-time generation of the service worker
tests/          unit, integration, end-to-end, and the parity harness
docs/decisions/ why things are the way they are
```

## For agents and collaborators

Read `CLAUDE.md` first. It gives the reading order, the commands, and the traps. The owner keeps a founding document, `CHARTER.md`, locally and out of the repository. If it is present on your machine, read it before touching content. If not, the rules below are the working summary.

Key rules for content:

- Curate, don't invent. Pull from existing traditions.
- The canon is never closed, but it stays lean. Use the three-tier system.
- Ancient traditions are primary. Modern writers are secondary.
- Multiple genres, not one voice. Loose practices, not rigid prescriptions.

## Deployment

A push to `main` runs `.github/workflows/deploy.yml`, which runs `npm run ci` and publishes `dist/`. Pages must be enabled with the GitHub Actions source first. See the tickets tagged `hosting`.
