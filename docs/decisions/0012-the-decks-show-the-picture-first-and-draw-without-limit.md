---
id: 12
title: The decks show the picture first, open the book on request, and draw without a daily limit
date: 2026-10-19
status: accepted
decided_by: human
supersedes: null
superseded_by: null
verified_at: 2026-10-19
---

## Context

After using all three decks, the owner asked for two changes, measured against a tarot deck. First, a drawn card should show its picture and its name and nothing else, so interpretation starts in the reader, with the explanations kept like a guidebook beside the deck, read only if chosen. Second, nothing about the day should stop the reader from drawing again. Every deck had closed after one draw a day, and the Sky let the reader choose a plate by tapping a light, so only lights above the horizon that night could answer.

The decks had words at every step: instructions at the door, narration during the draw, a line naming every planet's sign under the dome, and each card face carried a circle, origin, epithet, set-down and receive lines, solar term, or dates beside its name.

## Decision

Every deck follows one flow.

```
threshold        draw             card                  only if asked
one line    ->   no words    ->   picture + name   ->   [Read]   the book, unchanged
or none          (walk, look,     (+ a number on        [Again]  -> back to the threshold
                 turn)            the Year)
```

- Card faces carry the picture and the name. The Year keeps its window number. Everything else moved to the book or the page sections below the deck. Each page's intro paragraph now sits below the deck.
- The book opens only on Read. Past lines sit behind their own control: the Wood's last kept line under the deck, the Sky's line for a plate inside that plate's book, and the Year's notebook and season review behind Notebook.
- There is no daily limit. Again goes back through the threshold rather than reshuffling in place, so each draw still starts with its small rite. The journal shape is now `{ entries }`. Older journals with `lastDay` and `draw` still read, and those fields are dropped.
- The Wood draws one card from all fifty-two by default. Three lights and the table draw are choices at the door.
- The Sky draws by chance from every plate. The real sky then places the plate: the halo travels to where its light stands tonight, or rests on the horizon at its bearing if it has set, and a mystery beyond the stars rests where the reader looked. The book's first line says where the light stands. This amends `docs/decisions/0009`, whose line under the dome is gone. It is still recorded with each kept entry.

## Consequences

The book's contents did not change, and no content was reworded. Page copy that described one draw a day was rewritten to describe the new flow. A plate below the horizon is placed but given no reversed meaning, because writing a second meaning for every plate would be invention rather than curation. Many of the pictures were drawn to sit beside text, and the Year's seventy-two cards share four seasonal landscapes, so the pictures now carry more than they were drawn for. Deepening them is the next piece of work. The stylesheet went from 11,942 to 11,831 bytes gzipped.

## Alternatives rejected

- Keeping the daily limit as the research's guard against asking again (I Ching hexagram 4). The owner's direction is explicit, and returning through the threshold keeps the rite without the lock.
- A full-screen book over the card: it adds a modal layer and focus handling to the stylesheet's last bytes, and opening the book below the card on request is already opt-in.
- Keeping the Sky's tap-a-light draw and only removing the limit: the reader would still choose the outcome, and the reachable plates would still change with the night.
