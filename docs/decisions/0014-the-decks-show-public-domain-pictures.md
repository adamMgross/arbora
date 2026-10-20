---
id: 14
title: The decks show public-domain pictures, committed as cropped masters and sized at build
date: 2026-10-20
status: proposed
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-20
---

## Context

After using the decks, the owner found the drawn art too simple to move anyone, and noticed that a tarot card works because the reader steps into the figure on it. The drawings are SVG written in code, which cannot carry that. The owner chose real public-domain art with a person in it, one source per deck: American landscape painting of the 1800s for the Wood, Doré's engravings with Flammarion, Verne, and NASA's Island Three for the Sky, and Hokusai and Hiroshige prints for the Year. Every card was matched to a verified image (Wood 47 of 52, Sky 59 of 62, Year 72 of 72), and the owner approved the matches on the review pages.

Two owner rules bind the images. No image may contain text such as titles, captions, poems, or labels, though artists' signatures and seals may stay. The whole picture shows, and each card takes its picture's shape rather than cropping the artwork to one card shape.

Three facts of the current code shape the choice. The service worker precaches every built file at install. Card faces are SVG strings from `art.ts`, while the card backs on the hub are rendered from the same module at build. The stylesheet sits near its 12 KB ceiling.

## Decision

```
deck YAML: picture {file, title, artist, year, source, license, crop}
        |
        |  npm run art:fetch   (by hand, never in CI)
        v
source page on Commons or a museum -> original -> crop text away -> master
        |
        v
src/assets/decks/<deck>/<card-id>.jpg   (committed, 1200 px long edge)
        |
        |  astro build, astro:assets with sharp
        v
webp at 480, 800, 1200 wide -> srcset, width, height in the scene's JSON
        |
        v
card face: mat + <img> at its own aspect + name   (backs stay drawn)
```

- Each card's entry gains a `picture` record: the master's file name, title, artist, year, the source page URL, the license, and the crop box in source pixels when text has to go. It lives in the deck's YAML collection and is validated there (`docs/decisions/0004`).
- `npm run art:fetch` turns the records into masters. It downloads the original from the source page, applies the crop, and writes a 1200 px JPEG. It is run by hand when a record changes and never in CI, so builds need no network. The masters are committed. Measured on nineteen of the chosen images, a master runs 85 to 630 KB with a median near 270 KB, so about 48 MB for all 178.
- The build sizes each master with `astro:assets` into WebP at three widths. The scene receives `src`, `srcset`, `width`, and `height` as values, so it computes no paths. A draw loads one picture. A sharp phone screen picks the 1200 px width, measured at 75 to 520 KB with a median near 250 KB, and the engravings run largest because fine lines compress poorly.
- A card face becomes a figure: a mat, the picture at its own aspect, and the name beneath, with the Year keeping its number. Height is capped to the viewport so a tall, narrow print still fits a phone screen. The backs, the Wood's forest, the Sky's dome, and the Year's ring stay drawn.
- The book ends with the credit: title, artist, year, and a link to the source.
- The service worker no longer precaches the deck pictures. Its existing cache-first handler keeps each one after its first view.
- The drawn faces, their `art-*.ts` drawings, and the `art` enum are deleted deck by deck as each switches over.

### Rollout

Each deck is one tracer slice, the Wood first. Within each deck, the schema and the masters land first as a commit that changes nothing on the page. A parity run shows zero differences. The switch to pictures and the deletion of the drawings follow as one behavior change. A deck ships only once every card has a picture. Rewording a card to fit its picture is the owner's call, and each rewording is its own commit (`arb-g4c9`).

### Failure cases, written as tests first

- Every card has a picture whose master exists, whose license is public domain or CC0, and whose source is an https page. No two cards share a source.
- Each built picture has all three widths, and the 1200 px WebP stays under a pinned budget of 600 KB, against a measured maximum of 516 KB.
- The service worker's precache list contains no deck picture and still contains every page.
- End to end, at phone and desktop size: a drawn card shows a loaded image with width and height set and alt text naming the work. The card fits within the viewport, and the book shows the credit link.
- Pages outside the decks pass parity with zero differences.
- Whether a crop really removed all text cannot be tested automatically. `art:fetch` writes a contact sheet of the masters for the owner to check by eye.

## Consequences

The repository grows by about 48 MB of masters, and the built site by about 80 MB of WebP. Both are well inside GitHub's limits, and git history keeps every replaced master. Pictures follow the reader's color scheme only through their mat, because the artwork itself does not change color. Cards in one deck differ in shape. The hub's card backs keep their drawn look, so each deck's back no longer matches its faces in style.

Several owner calls stay open: the Wood's five missing cards and the Sky's three, the card texts the review pages flag for rewording, three Wood paintings of Native people by white painters of the 1800s, the Crown's nude etching, the late copy of the persimmon print, and the faded Sky scans that need better copies.

## Alternatives rejected

- Linking to the images on Commons at runtime adds no weight to the repository. But every draw would send the reader's address to a third party, the deck would stop working offline, URLs can move, and Commons cannot crop text away.
- Fetching the images during the build would put the network and Commons rate limits in every CI run.
- Git LFS spends a bandwidth quota on every Actions checkout and adds tooling for files this small.
- Committing only finished WebP files under `public/` skips build processing. But a change of widths or format would rewrite every file in history.
- One shape per deck, or a tall tarot shape with cropping, was the owner's choice to reject. Most Wood paintings and Year prints are wide and most Sky plates are tall, so either would cut away much of the artwork.
