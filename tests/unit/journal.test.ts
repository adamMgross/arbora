import { describe, expect, it } from 'vitest';
import { EMPTY_JOURNAL, loadJournal, parseJournal, storeJournal, updateEntry, withEntry } from '../../src/lib/journal';

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
  });

  it('round-trips through storage without losing unknown fields', () => {
    const storage = memory();
    const journal = withEntry(EMPTY_JOURNAL, { iso: 'x', text: 'one line', futureField: [1, 2] });
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

describe('entries', () => {
  it('reads a journal written when draws were limited to one a day, keeping every entry', () => {
    const old = parseJournal(
      JSON.stringify({ entries: [{ iso: 'a', line: 'kept' }], lastDay: '2026-10-18', draw: { w: 17 } }),
    );
    expect(old).toEqual({ entries: [{ iso: 'a', line: 'kept' }] });
  });

  it('keeps every entry made on the same day, in order', () => {
    const journal = withEntry(withEntry(withEntry(EMPTY_JOURNAL, { iso: 'a' }), { iso: 'b' }), { iso: 'c' });
    expect(journal.entries.map((e) => e.iso)).toEqual(['a', 'b', 'c']);
  });

  it('patches one entry in place and leaves the others alone', () => {
    const journal = withEntry(withEntry(EMPTY_JOURNAL, { iso: 'a', line: 'first' }), { iso: 'b', line: 'second' });
    const patched = updateEntry(journal, 0, { outcome: 'it passed' });
    expect(patched.entries[0]).toEqual({ iso: 'a', line: 'first', outcome: 'it passed' });
    expect(patched.entries[1]).toEqual({ iso: 'b', line: 'second' });
  });
});
