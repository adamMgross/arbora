import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { deckPictures, windowId } from '../../scripts/art-fetch.mjs';

const repo = join(import.meta.dirname, '../..');
const DECKS = ['wood', 'sky', 'year'];

const cardIds = (deck: string, entries: Array<{ id: string; windows?: string[] }>) =>
  deck === 'year' ? entries[0]!.windows!.map((_, i) => windowId(i)) : entries.map((e) => e.id);

describe.each(DECKS)('the %s pictures', (deck) => {
  const cards = readFileSync(join(repo, `src/content/decks/${deck}.yml`), 'utf8');
  const entries = deckPictures(deck, cards);
  const masters = join(repo, 'src/assets/decks', deck);

  it('cover every card, so no card can ship without its picture', () => {
    expect(entries.map((e) => e.id)).toEqual(cardIds(deck, parse(cards)));
  });

  it('each have a committed master named by the card id, and no stray masters', () => {
    for (const { id } of entries) expect(existsSync(join(masters, `${id}.jpg`)), id).toBe(true);
    expect(readdirSync(masters).sort()).toEqual(entries.map((e) => `${e.id}.jpg`).sort());
  });

  it('each describe what the picture shows for a screen reader, never a placeholder', () => {
    for (const { id, picture } of entries) expect(picture.alt, id).not.toMatch(/^(none|n\/a|tbd)\b/i);
  });

  it('never use one work for two cards', () => {
    const sources = entries.map((e) => e.picture.source);
    expect(new Set(sources).size).toBe(sources.length);
  });
});

it('no work appears in two decks', () => {
  const sources = DECKS.flatMap((deck) =>
    deckPictures(deck, readFileSync(join(repo, `src/content/decks/${deck}.yml`), 'utf8')).map((e) => e.picture.source),
  );
  expect(new Set(sources).size).toBe(sources.length);
});
