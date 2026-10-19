import { describe, expect, it } from 'vitest';
import {
  CALIFORNIA,
  DOME,
  drawPlate,
  FIGURES,
  HEAVENS,
  landing,
  project,
  skyState,
  standings,
} from '../../src/lib/sky-dome';

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

describe('placing a drawn plate', () => {
  const lights = [...HEAVENS, ...Object.keys(FIGURES), 'milkyway'];

  it('knows where every heaven, figure, and the Milky Way stands by day and by night', () => {
    for (const date of [NIGHT, NOON]) {
      const st = skyState(date, CALIFORNIA);
      for (const id of lights)
        expect(st.places[id as keyof typeof st.places], `${id} at ${date.toISOString()}`).toBeDefined();
    }
  });

  it('lands on a light that has risen where the dome draws it', () => {
    const st = skyState(NIGHT, CALIFORNIA);
    const up = st.beacons.find((b) => b.id !== 'milkyway')!;
    expect(landing(st, up.id, [0, 0])).toEqual({ x: up.x, y: up.y, risen: true });
  });

  it("lands on the rim, at the light's bearing, when it is below the horizon", () => {
    const st = skyState(NIGHT, CALIFORNIA);
    const down = lights.find((id) => st.places[id as keyof typeof st.places]!.alt < 0)!;
    const spot = landing(st, down, [0, 0]);
    expect(spot.risen).toBe(false);
    expect(Math.hypot(spot.x - DOME.cx, spot.y - DOME.cy)).toBeCloseTo(DOME.r, 6);
  });

  it('lands where the eye did for a mystery beyond the stars, and for falling stars out of season', () => {
    const st = skyState(NIGHT, CALIFORNIA);
    expect(landing(st, 'silence', [120, 80])).toEqual({ x: 120, y: 80, risen: null });
    expect(landing(st, 'falling', [120, 80])).toEqual({ x: 120, y: 80, risen: null });
  });
});

describe('drawPlate', () => {
  const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  it('reaches every plate in the pool', () => {
    const seen = new Set(Array.from({ length: 30 }, (_, i) => drawPlate(pool, null, () => i / 30).id));
    expect(seen).toEqual(new Set(['a', 'b', 'c']));
  });

  it('never repeats the last plate when another is available', () => {
    for (let i = 0; i < 20; i++) expect(drawPlate(pool, 'b', () => i / 20).id).not.toBe('b');
  });

  it('falls back to the whole pool when it holds one plate', () => {
    expect(drawPlate([{ id: 'only' }], 'only', () => 0.5).id).toBe('only');
  });
});

describe('the fixed stars', () => {
  const ids = (date: Date) => skyState(date, CALIFORNIA).beacons.map((b) => b.id);

  it('raises the summer figures on a July night and the winter figures on a January night', () => {
    const summer = ids(new Date('2026-07-10T22:30:00-07:00'));
    for (const id of ['swan', 'scorpion', 'archer', 'weaver', 'herdsman']) expect(summer).toContain(id);
    for (const id of ['orion', 'bull', 'twins', 'dogstar']) expect(summer).not.toContain(id);
    const winter = ids(new Date('2026-01-15T22:00:00-08:00'));
    for (const id of ['orion', 'bull', 'twins', 'dogstar', 'pleiades']) expect(winter).toContain(id);
    for (const id of ['scorpion', 'archer']) expect(winter).not.toContain(id);
  });

  it('keeps the Queen up all night, since she circles the pole', () => {
    for (const hour of ['18', '21', '00', '03']) {
      const day = hour < '12' ? '16' : '15';
      expect(ids(new Date(`2026-01-${day}T${hour}:00:00-08:00`))).toContain('queen');
    }
  });

  it('shows the falling stars only inside the August and December windows', () => {
    expect(ids(new Date('2026-08-12T23:00:00-07:00'))).toContain('falling');
    expect(ids(new Date('2026-12-14T23:00:00-08:00'))).toContain('falling');
    expect(ids(new Date('2026-10-18T23:00:00-07:00'))).not.toContain('falling');
    expect(ids(new Date('2026-09-01T23:00:00-07:00'))).not.toContain('falling');
  });

  it('places the December radiant in the Twins and the August radiant in the north', () => {
    const dec = skyState(new Date('2026-12-14T23:00:00-08:00'), CALIFORNIA).beacons;
    const twins = dec.find((b) => b.id === 'twins')!;
    const falling = dec.find((b) => b.id === 'falling')!;
    expect(Math.hypot(twins.x - falling.x, twins.y - falling.y)).toBeLessThan(30);
    const aug = skyState(new Date('2026-08-12T23:00:00-07:00'), CALIFORNIA).beacons.find((b) => b.id === 'falling')!;
    expect(aug.az > 300 || aug.az < 90).toBe(true);
  });
});
