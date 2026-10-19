import { describe, expect, it } from 'vitest';
import { lastKept, lastWalk, lightSpots, pickFrom, TABLE_ORDER, WALK_ORDER } from '../../src/lib/wood-walk';

describe('the walk', () => {
  it('draws the elder, then the spirit, then the passage, and one passage for the table', () => {
    expect(WALK_ORDER).toEqual(['Elder', 'Spirit', 'Passage']);
    expect(TABLE_ORDER).toEqual(['Passage']);
  });

  it('picks from the whole pool for any random draw', () => {
    const pool = ['a', 'b', 'c'];
    expect(pickFrom(pool, () => 0)).toBe('a');
    expect(pickFrom(pool, () => 0.999)).toBe('c');
  });

  it('returns the last line that was kept, skipping lines left on a branch and empty lines', () => {
    const entries = [
      { iso: '1', cards: { Elder: 'a' }, line: 'first kept', status: 'kept', outcome: '' },
      { iso: '2', cards: { Elder: 'b' }, line: 'hung up', status: 'branch', outcome: '' },
      { iso: '3', cards: { Elder: 'c' }, line: '', status: 'kept', outcome: '' },
      { iso: '4', text: 'not a walk at all' },
    ];
    expect(lastKept(entries)).toEqual({ index: 0, entry: entries[0] });
    expect(lastKept([])).toBeNull();
    expect(lastWalk(entries)).toBeNull();
    expect(lastWalk(entries.slice(0, 3))).toEqual(entries[2]);
  });

  it('places three lights at different spots on each step', () => {
    const steps = [0, 1, 2].map((s) => lightSpots(s, 3));
    expect(new Set(steps.flat().map((p) => p.join(','))).size).toBe(9);
    for (const spots of steps) for (const [x, y] of spots) expect(x > 0 && x < 100 && y > 0 && y < 100).toBe(true);
  });
});
