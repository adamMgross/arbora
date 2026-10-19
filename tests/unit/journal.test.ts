import { describe, expect, it } from 'vitest';
import {
  dayKey,
  drewOn,
  EMPTY_JOURNAL,
  loadJournal,
  parseJournal,
  storeJournal,
  updateEntry,
  withDraw,
  withEntry,
  withNote,
} from '../../src/lib/journal';

const memory = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
};

describe('parseJournal', () => {
  it('returns an empty journal for nothing, garbage, and the wrong shape', () => {
    expect(parseJournal(null)).toEqual(EMPTY_JOURNAL);
    expect(parseJournal('not json')).toEqual(EMPTY_JOURNAL);
    expect(parseJournal('[1,2,3]')).toEqual(EMPTY_JOURNAL);
    expect(parseJournal('"text"')).toEqual(EMPTY_JOURNAL);
  });

  it('keeps every field an entry carries, drops entries without an iso stamp, and reads a missing field as null', () => {
    const parsed = parseJournal(
      JSON.stringify({
        entries: [
          { iso: '2026-10-18T04:00:00.000Z', plate: 'saturn', mood: 'quiet', later: { nested: true } },
          { x: 1 },
        ],
      }),
    );
    expect(parsed.entries).toEqual([
      { iso: '2026-10-18T04:00:00.000Z', plate: 'saturn', mood: 'quiet', later: { nested: true } },
    ]);
    expect(parsed.lastDay).toBeNull();
    expect(parsed.draw).toBeNull();
  });

  it('round-trips through storage without losing unknown fields', () => {
    const storage = memory();
    const journal = withEntry(
      withDraw(EMPTY_JOURNAL, { w: 17, extra: 'kept' }, new Date(2026, 3, 22, 9)),
      { iso: 'x', text: 'one line', futureField: [1, 2] },
      new Date(2026, 3, 22, 9),
    );
    storeJournal(storage, 'k', journal);
    expect(loadJournal(storage, 'k')).toEqual(journal);
  });

  it('survives a storage that throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(loadJournal(broken, 'k')).toEqual(EMPTY_JOURNAL);
    expect(() => storeJournal(broken, 'k', EMPTY_JOURNAL)).not.toThrow();
  });
});

describe('one draw a day', () => {
  it('keys the day by the local calendar date with zero padding', () => {
    expect(dayKey(new Date(2026, 0, 5, 0, 10))).toBe('2026-01-05');
    expect(dayKey(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
  });

  it('closes the deck for the rest of the day and reopens it the next morning', () => {
    const drawn = withEntry(EMPTY_JOURNAL, { iso: 'x' }, new Date(2026, 3, 22, 21, 30));
    expect(drewOn(drawn, new Date(2026, 3, 22, 23, 59))).toBe(true);
    expect(drewOn(drawn, new Date(2026, 3, 23, 0, 1))).toBe(false);
    expect(drewOn(EMPTY_JOURNAL, new Date(2026, 3, 22))).toBe(false);
  });

  it('a notebook line does not spend the day', () => {
    const noted = withNote(EMPTY_JOURNAL, { iso: 'x', text: 'saw a newt' });
    expect(drewOn(noted, new Date())).toBe(false);
    expect(noted.entries).toHaveLength(1);
  });

  it('patches one entry in place and leaves the others alone', () => {
    const journal = withNote(withNote(EMPTY_JOURNAL, { iso: 'a', line: 'first' }), { iso: 'b', line: 'second' });
    const patched = updateEntry(journal, 0, { outcome: 'it passed' });
    expect(patched.entries[0]).toEqual({ iso: 'a', line: 'first', outcome: 'it passed' });
    expect(patched.entries[1]).toEqual({ iso: 'b', line: 'second' });
  });
});
