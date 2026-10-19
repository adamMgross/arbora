import { describe, expect, it } from 'vitest';
import { CALIFORNIA, DOME, lift, pickBeyond, project, skyState, standings } from '../../src/lib/sky-dome';

const NIGHT = new Date('2026-10-18T21:00:00-07:00');
const NOON = new Date('2026-10-18T12:00:00-07:00');

describe('skyState', () => {
  it('is night at nine in the evening and day at noon in California', () => {
    expect(skyState(NIGHT, CALIFORNIA).day).toBe(false);
    expect(skyState(NOON, CALIFORNIA).day).toBe(true);
  });

  it('by day shows the Sun alone, even with a daytime Moon up, and no field stars or figures', () => {
    const st = skyState(NOON, CALIFORNIA);
    expect(st.beacons.map((b) => b.id)).toEqual(['sun']);
    expect(st.stars).toHaveLength(0);
    expect(Object.keys(st.figures)).toHaveLength(0);
    const quarterMoonNoon = skyState(new Date('2026-04-22T12:00:00-07:00'), CALIFORNIA);
    expect(quarterMoonNoon.positions.moon.alt).toBeGreaterThan(0);
    expect(quarterMoonNoon.beacons.map((b) => b.id)).toEqual(['sun']);
  });

  it('by night lists only lights above the horizon, each projected inside the dome', () => {
    const st = skyState(NIGHT, CALIFORNIA);
    expect(st.beacons.length).toBeGreaterThan(1);
    for (const b of st.beacons) {
      expect(b.alt).toBeGreaterThan(2);
      expect(Math.hypot(b.x - DOME.cx, b.y - DOME.cy)).toBeLessThanOrEqual(DOME.r + 0.01);
    }
    expect(st.beacons.some((b) => b.id === 'sun')).toBe(false);
  });

  it('records a longitude and sign for all seven heavens whether or not they are up', () => {
    const st = skyState(NIGHT, CALIFORNIA);
    const lines = standings(st);
    expect(lines.map((l) => l.id)).toEqual(['moon', 'mercury', 'venus', 'sun', 'mars', 'jupiter', 'saturn']);
    expect(lines.find((l) => l.id === 'sun')?.state).toBe('below the horizon');
    expect(lines.find((l) => l.id === 'moon')?.phase).toBeTruthy();
  });
});

describe('project', () => {
  it('puts the zenith at the center and the horizon on the rim', () => {
    expect(project({ alt: 90, az: 0 })).toEqual([DOME.cx, DOME.cy]);
    const [x, y] = project({ alt: 0, az: 90 });
    expect(Math.round(x)).toBe(DOME.cx - DOME.r);
    expect(Math.round(y)).toBe(DOME.cy);
  });
});

describe('lift', () => {
  it('opens the nearest light when the eye lands within reach of it', () => {
    const st = skyState(NIGHT, CALIFORNIA);
    const target = st.beacons[0]!;
    const result = lift(st, target.x + 10, target.y - 10);
    expect(result).toEqual({ kind: 'beacon', beacon: target });
  });

  it('looks past the stars when no light is within reach at night', () => {
    const st = skyState(NIGHT, CALIFORNIA);
    const far = st.beacons.reduce(
      (best, b) => {
        const candidates: Array<[number, number]> = [
          [DOME.cx, DOME.cy],
          [DOME.cx + 120, DOME.cy + 120],
          [DOME.cx - 120, DOME.cy - 120],
          [DOME.cx + 120, DOME.cy - 120],
          [DOME.cx - 120, DOME.cy + 120],
        ];
        return candidates.find(([x, y]) => st.beacons.every((bb) => Math.hypot(bb.x - x, bb.y - y) > 80)) ?? best;
      },
      null as [number, number] | null,
    );
    if (!far) return;
    expect(lift(st, far[0], far[1]).kind).toBe('beyond');
  });

  it('by day always opens the Sun, however far the eye lands from it', () => {
    const st = skyState(NOON, CALIFORNIA);
    expect(lift(st, 20, 20)).toMatchObject({ kind: 'beacon', beacon: { id: 'sun' } });
  });
});

describe('pickBeyond', () => {
  const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  it('never repeats the last mystery when another is available', () => {
    for (let i = 0; i < 20; i++) expect(pickBeyond(pool, 'b', () => i / 20).id).not.toBe('b');
  });

  it('falls back to the whole pool when it holds one plate', () => {
    expect(pickBeyond([{ id: 'only' }], 'only', () => 0.5).id).toBe('only');
  });
});
