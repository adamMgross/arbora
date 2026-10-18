import { describe, expect, it } from 'vitest';
import { dayOfYear, pickIndex, shuffledIndex } from '../../src/lib/daily';
import { seasonOf, timeOfDay } from '../../src/lib/season';

process.env.TZ = 'America/Los_Angeles';

// Oracle: the day-number formula kept verbatim, so any change in dayOfYear output is detected, including the DST hour.
const legacyDayOfYear = (now: Date) =>
  Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

describe('dayOfYear', () => {
  it('matches the legacy inline formula at every 97 minutes across two years, including every DST boundary', () => {
    const start = new Date('2025-12-30T00:00:00-08:00').getTime();
    const end = new Date('2027-01-02T00:00:00-08:00').getTime();
    for (let t = start; t < end; t += 97 * 60_000) {
      const now = new Date(t);
      expect(dayOfYear(now), now.toISOString()).toBe(legacyDayOfYear(now));
    }
  });

  it('counts local noon on January 1 as day 1 and advances by one each day', () => {
    expect(dayOfYear(new Date('2026-01-01T12:00:00-08:00'))).toBe(1);
    expect(dayOfYear(new Date('2026-01-02T12:00:00-08:00'))).toBe(2);
    expect(dayOfYear(new Date('2026-12-31T12:00:00-08:00'))).toBe(365);
  });
});

describe('pickIndex', () => {
  it('cycles through a pool by day number', () => {
    expect([0, 1, 2, 3, 4, 5].map((day) => pickIndex(day, 3))).toEqual([0, 1, 2, 0, 1, 2]);
  });
});

describe('shuffledIndex', () => {
  it('never returns the current index when the pool has more than one entry, for any random draw', () => {
    for (const length of [2, 3, 19, 90]) {
      for (let current = 0; current < length; current++) {
        for (let step = 0; step < 50; step++) {
          const picked = shuffledIndex(current, length, () => step / 50);
          expect(picked).not.toBe(current);
          expect(picked).toBeGreaterThanOrEqual(0);
          expect(picked).toBeLessThan(length);
        }
      }
    }
  });

  it('reaches every other index exactly once as the random draw sweeps from 0 up to 1', () => {
    const length = 5;
    const current = 2;
    const seen = new Set<number>();
    for (let step = 0; step < length - 1; step++) seen.add(shuffledIndex(current, length, () => step / (length - 1)));
    expect([...seen].sort()).toEqual([0, 1, 3, 4]);
  });

  it('returns the only index of a single-entry pool', () => {
    expect(shuffledIndex(0, 1, () => 0.9)).toBe(0);
  });
});

describe('seasonOf', () => {
  it.each([
    [11, 'winter'],
    [0, 'winter'],
    [1, 'winter'],
    [2, 'spring'],
    [3, 'spring'],
    [4, 'spring'],
    [5, 'summer'],
    [6, 'summer'],
    [7, 'summer'],
    [8, 'autumn'],
    [9, 'autumn'],
    [10, 'autumn'],
  ])('maps zero-based month %i to %s', (month, season) => {
    expect(seasonOf(month)).toBe(season);
  });
});

describe('timeOfDay', () => {
  it.each([
    [0, 'morning'],
    [11, 'morning'],
    [12, 'afternoon'],
    [17, 'afternoon'],
    [18, 'evening'],
    [23, 'evening'],
  ])('maps hour %i to %s', (hour, period) => {
    expect(timeOfDay(hour)).toBe(period);
  });
});
