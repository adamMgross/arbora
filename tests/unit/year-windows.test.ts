import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import {
  formatRange,
  needleAngle,
  pickOtherWindow,
  previousSeason,
  seasonOf,
  windowFor,
  windowRange,
  type SolarTerm,
  type YearSeason,
} from '../../src/lib/year-windows';

process.env.TZ = 'America/Los_Angeles';

const [year] = parse(readFileSync(join(import.meta.dirname, '../../src/content/decks/year.yml'), 'utf8')) as Array<{
  terms: SolarTerm[];
  windows: string[];
  ko: string[];
  seasons: YearSeason[];
}>;
const terms = year!.terms;
const seasons = year!.seasons;

describe('the year content', () => {
  it('holds 24 terms, 72 windows, and 72 old names, and the seasons cover every window once', () => {
    expect(terms).toHaveLength(24);
    expect(year!.windows).toHaveLength(72);
    expect(year!.ko).toHaveLength(72);
    const covered = new Set<number>();
    for (const s of seasons) for (let i = s.from; i <= s.to; i++) covered.add(i);
    expect(covered.size).toBe(72);
    expect(seasons.reduce((n, s) => n + (s.to - s.from + 1), 0)).toBe(72);
  });
});

describe('windowFor', () => {
  it('assigns the first day of a term to its first window and the eleventh day to its third', () => {
    expect(windowFor(new Date(2026, 3, 20, 9), terms)).toBe(15);
    expect(windowFor(new Date(2026, 3, 25, 9), terms)).toBe(16);
    expect(windowFor(new Date(2026, 3, 30, 9), terms)).toBe(17);
    expect(windowFor(new Date(2026, 4, 4, 9), terms)).toBe(17);
    expect(windowFor(new Date(2026, 4, 5, 9), terms)).toBe(18);
  });

  it('crosses the new year inside the winter solstice term', () => {
    expect(windowFor(new Date(2026, 11, 31, 12), terms)).toBe(64);
    expect(windowFor(new Date(2027, 0, 1, 12), terms)).toBe(65);
    expect(windowFor(new Date(2027, 0, 6, 12), terms)).toBe(66);
  });

  it('visits every window in order across a year, each for at least four days', () => {
    const seen: number[] = [];
    const counts = new Map<number, number>();
    let last = -1;
    for (let t = new Date(2026, 1, 4).getTime(); t < new Date(2027, 1, 4).getTime(); t += 86400000) {
      const w = windowFor(new Date(t + 43200000), terms);
      counts.set(w, (counts.get(w) ?? 0) + 1);
      if (w !== last) {
        seen.push(w);
        last = w;
      }
    }
    expect(seen).toEqual(Array.from({ length: 72 }, (_, i) => i));
    for (const n of counts.values()) expect(n).toBeGreaterThanOrEqual(4);
  });

  it('is decided by the local date, not the hour', () => {
    expect(windowFor(new Date(2026, 3, 25, 0, 30), terms)).toBe(windowFor(new Date(2026, 3, 25, 23, 30), terms));
  });
});

describe('windowRange', () => {
  it('spans five days for the first two windows of a term and runs to the next term for the third', () => {
    expect(formatRange(windowRange(15, 2026, terms))).toBe('about Apr 20–24');
    expect(formatRange(windowRange(16, 2026, terms))).toBe('about Apr 25–29');
    expect(formatRange(windowRange(17, 2026, terms))).toBe('about Apr 30–May 4');
  });

  it('runs the last windows of the year into January of the next', () => {
    expect(formatRange(windowRange(65, 2026, terms))).toBe('about Jan 1–5');
    expect(formatRange(windowRange(71, 2026, terms))).toBe('about Jan 30–Feb 3');
  });
});

describe('seasons', () => {
  it('maps each window to one California season and walks back to the season before', () => {
    expect(seasonOf(0, seasons).key).toBe('bloom');
    expect(seasonOf(21, seasons).key).toBe('gold');
    expect(seasonOf(41, seasons).key).toBe('ember');
    expect(seasonOf(52, seasons).key).toBe('rain');
    expect(seasonOf(71, seasons).key).toBe('rain');
    expect(previousSeason(seasonOf(0, seasons), seasons).key).toBe('rain');
    expect(previousSeason(seasonOf(30, seasons), seasons).key).toBe('bloom');
  });
});

describe('the needle', () => {
  it('points at the middle of a window and the other-window pick never lands on today', () => {
    expect(needleAngle(27)).toBeCloseTo(2.5);
    expect(needleAngle(63)).toBeCloseTo(182.5);
    for (let today = 0; today < 72; today++) {
      for (let step = 0; step < 71; step++) {
        const pick = pickOtherWindow(today, () => step / 71);
        expect(pick).not.toBe(today);
        expect(pick).toBeGreaterThanOrEqual(0);
        expect(pick).toBeLessThan(72);
      }
    }
  });
});
