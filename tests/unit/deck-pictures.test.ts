import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deckPictures } from '../../scripts/art-fetch.mjs';

const repo = join(import.meta.dirname, '../..');
const DECKS = ['wood'];

describe.each(DECKS)('the %s pictures', (deck) => {
  const cards = readFileSync(join(repo, `src/content/decks/${deck}.yml`), 'utf8');
  const entries = deckPictures(deck, cards);
  const masters = join(repo, 'src/assets/decks', deck);

  it('cover every card, so no card can ship without its picture', () => {
    const ids = [...cards.matchAll(/^- id: (\S+)$/gm)].map((m) => m[1]);
    expect(entries.map((e) => e.id)).toEqual(ids);
  });

  it('each have a committed master named by the card id, and no stray masters', () => {
    for (const { id } of entries) expect(existsSync(join(masters, `${id}.jpg`)), id).toBe(true);
    expect(readdirSync(masters).sort()).toEqual(entries.map((e) => `${e.id}.jpg`).sort());
  });

  it('never use one work for two cards', () => {
    const sources = entries.map((e) => e.picture.source);
    expect(new Set(sources).size).toBe(sources.length);
  });
});
