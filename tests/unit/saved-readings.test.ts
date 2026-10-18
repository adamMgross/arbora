import { describe, expect, it } from 'vitest';
import {
  isSaved,
  loadSaved,
  parseSaved,
  removeAt,
  storeSaved,
  toggleSaved,
  type SavedReading,
  type SavedStorage,
} from '../../src/lib/saved-readings';

const stoic: SavedReading = { text: 'You have power over your mind.', source: 'Marcus Aurelius' };
const daoist: SavedReading = { text: 'The Tao that can be told.', source: 'Tao Te Ching 1' };

describe('parseSaved', () => {
  it('reads the original {text, source} shape written by the first version of the site', () => {
    expect(parseSaved(JSON.stringify([stoic]))).toEqual([stoic]);
  });

  it('keeps fields it does not know about so a later version can add an id beside the stored value', () => {
    const withId = { ...stoic, id: 'stoics-marcus-aurelius-4' };
    expect(parseSaved(JSON.stringify([withId]))).toEqual([withId]);
  });

  it.each([null, '', 'not json', '{"text":"x"}', '"a string"', '42'])('treats %j as an empty list', (raw) => {
    expect(parseSaved(raw)).toEqual([]);
  });

  it('drops entries that lack a text or a source and keeps the valid ones', () => {
    const raw = JSON.stringify([stoic, { text: 'no source' }, null, 7, { source: 'no text' }, daoist]);
    expect(parseSaved(raw)).toEqual([stoic, daoist]);
  });
});

describe('isSaved and toggleSaved', () => {
  it('identifies a saved reading by both text and source', () => {
    expect(isSaved([stoic], stoic)).toBe(true);
    expect(isSaved([stoic], { ...stoic, source: 'Someone else' })).toBe(false);
  });

  it('adds an unsaved reading as {text, source} and removes a saved one', () => {
    const added = toggleSaved([stoic], daoist);
    expect(added).toEqual([stoic, daoist]);
    expect(toggleSaved(added, stoic)).toEqual([daoist]);
  });

  it('removes every stored copy of a reading, matching the original filter', () => {
    expect(toggleSaved([stoic, daoist, stoic], stoic)).toEqual([daoist]);
  });
});

describe('removeAt', () => {
  it('drops one entry by position without mutating the input', () => {
    const list = [stoic, daoist];
    expect(removeAt(list, 0)).toEqual([daoist]);
    expect(list).toEqual([stoic, daoist]);
  });
});

describe('storage', () => {
  const memory = (): SavedStorage & { data: Map<string, string> } => {
    const data = new Map<string, string>();
    return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
  };

  it('round-trips through the arbora-saved-readings key', () => {
    const storage = memory();
    storeSaved(storage, [stoic]);
    expect(storage.data.get('arbora-saved-readings')).toBe(JSON.stringify([stoic]));
    expect(loadSaved(storage)).toEqual([stoic]);
  });

  it('survives a storage that throws, as in a private window', () => {
    const broken: SavedStorage = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    };
    expect(loadSaved(broken)).toEqual([]);
    expect(() => storeSaved(broken, [stoic])).not.toThrow();
  });
});
