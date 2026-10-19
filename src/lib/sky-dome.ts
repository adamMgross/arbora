import {
  altaz,
  angleBetween,
  ecliptic,
  galacticToEquatorial,
  moon,
  moonPhase,
  planet,
  signOf,
  sun,
  type AltAz,
  type MoonPhase,
  type Sign,
  type Wanderer,
} from './sky-math';
import { rng } from './svg';

export interface Place {
  lat: number;
  lon: number;
}

export const CALIFORNIA: Place = { lat: 36.8, lon: -119.4 };

export const DOME = { width: 600, height: 520, cx: 300, cy: 262, r: 240 } as const;

export type HeavenId = 'moon' | 'mercury' | 'venus' | 'sun' | 'mars' | 'jupiter' | 'saturn';
export type FigureId = 'orion' | 'dipper' | 'pleiades';
export type BeaconId = HeavenId | FigureId | 'milkyway';

export const HEAVENS: HeavenId[] = ['moon', 'mercury', 'venus', 'sun', 'mars', 'jupiter', 'saturn'];
export const ORDINALS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'] as const;

interface Figure {
  stars: Array<[ra: number, dec: number]>;
  lines: Array<[number, number]>;
  center: number;
}

export const FIGURES: Record<FigureId, Figure> = {
  orion: {
    stars: [
      [88.79, 7.41],
      [81.28, 6.35],
      [83.0, -0.3],
      [84.05, -1.2],
      [85.19, -1.94],
      [86.94, -9.67],
      [78.63, -8.2],
    ],
    lines: [
      [0, 1],
      [0, 4],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [2, 6],
    ],
    center: 3,
  },
  dipper: {
    stars: [
      [165.93, 61.75],
      [165.46, 56.38],
      [178.46, 53.69],
      [183.86, 57.03],
      [193.51, 55.96],
      [200.98, 54.93],
      [206.89, 49.31],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
    center: 3,
  },
  pleiades: {
    stars: [
      [56.87, 24.11],
      [57.29, 24.05],
      [56.22, 24.11],
      [56.46, 24.37],
      [56.58, 23.95],
      [56.3, 24.47],
    ],
    lines: [],
    center: 0,
  },
};

const FIELD_STARS = (() => {
  const r = rng(99);
  return Array.from({ length: 300 }, () => ({
    ra: r() * 360,
    dec: (Math.asin(2 * r() - 1) * 180) / Math.PI,
    size: 0.4 + r() * r() * 1.5,
    opacity: 0.35 + r() * 0.6,
  }));
})();

export function project(aa: AltAz): [number, number] {
  const rr = (DOME.r * (90 - aa.alt)) / 90;
  const a = (aa.az * Math.PI) / 180;
  return [DOME.cx - rr * Math.sin(a), DOME.cy - rr * Math.cos(a)];
}

export interface Beacon {
  id: BeaconId;
  alt: number;
  az: number;
  x: number;
  y: number;
}

export interface HeavenPosition {
  lon: number;
  alt: number;
  az: number;
}

export interface FieldStar {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface SkyState {
  date: Date;
  day: boolean;
  sign: Sign;
  sunLon: number;
  moon: MoonPhase;
  positions: Record<HeavenId, HeavenPosition>;
  beacons: Beacon[];
  ecliptic: AltAz[];
  milkyWay: AltAz[];
  figures: Partial<Record<FigureId, AltAz[]>>;
  stars: FieldStar[];
}

const WANDERERS: Wanderer[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];

export function skyState(date: Date, place: Place): SkyState {
  const { lat, lon } = place;
  const su = sun(date);
  const sunAA = altaz(su.ra, su.dec, date, lat, lon);
  const mo = moon(date);
  const moonAA = altaz(mo.ra, mo.dec, date, lat, lon);
  const day = sunAA.alt > -6;
  const positions = {
    sun: { lon: su.lon, alt: sunAA.alt, az: sunAA.az },
    moon: { lon: mo.lon, alt: moonAA.alt, az: moonAA.az },
  } as Record<HeavenId, HeavenPosition>;
  const beacons: Beacon[] = [];
  const add = (id: BeaconId, aa: AltAz) => {
    if (aa.alt > 2) {
      const [x, y] = project(aa);
      beacons.push({ id, alt: aa.alt, az: aa.az, x, y });
    }
  };
  add('sun', sunAA);
  if (!day) add('moon', moonAA);
  for (const name of WANDERERS) {
    const q = planet(name, date);
    const aa = altaz(q.ra, q.dec, date, lat, lon);
    positions[name] = { lon: q.lon, alt: aa.alt, az: aa.az };
    if (!day) add(name, aa);
  }
  const eclipticArc: AltAz[] = [];
  for (let L = 0; L < 360; L += 5) {
    const e = ecliptic(L, 0, date);
    eclipticArc.push(altaz(e.ra, e.dec, date, lat, lon));
  }
  const figures: Partial<Record<FigureId, AltAz[]>> = {};
  const milkyWay: AltAz[] = [];
  let stars: FieldStar[] = [];
  if (!day) {
    for (const id of Object.keys(FIGURES) as FigureId[]) {
      const figure = FIGURES[id];
      const pts = figure.stars.map(([ra, dec]) => altaz(ra, dec, date, lat, lon));
      figures[id] = pts;
      add(id, pts[figure.center]!);
    }
    let best: AltAz | null = null;
    for (let l = 0; l < 360; l += 5) {
      const g = galacticToEquatorial(l, 0);
      const aa = altaz(g.ra, g.dec, date, lat, lon);
      milkyWay.push(aa);
      if (aa.alt > 10 && (!best || aa.alt > best.alt)) best = aa;
    }
    if (best) add('milkyway', best);
    stars = FIELD_STARS.flatMap((s) => {
      const aa = altaz(s.ra, s.dec, date, lat, lon);
      if (aa.alt <= 0) return [];
      const [x, y] = project(aa);
      return [{ x, y, size: s.size, opacity: s.opacity }];
    });
  }
  return {
    date,
    day,
    sign: signOf(su.lon),
    sunLon: su.lon,
    moon: moonPhase(date),
    positions,
    beacons,
    ecliptic: eclipticArc,
    milkyWay,
    figures,
    stars,
  };
}

const COMPASS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];

export const compass = (az: number): string => COMPASS[Math.round(az / 45) % 8]!;

export interface HeavenStanding {
  id: HeavenId;
  sign: Sign;
  state: 'above you' | 'below the horizon' | 'with the Sun' | 'risen';
  phase?: string;
}

export function standings(st: SkyState): HeavenStanding[] {
  return HEAVENS.map((id) => {
    const p = st.positions[id];
    let state: HeavenStanding['state'];
    if (id === 'sun') state = st.day ? 'above you' : 'below the horizon';
    else if (id !== 'moon' && angleBetween(p.lon, st.sunLon) < 12) state = 'with the Sun';
    else state = p.alt > 0 ? 'risen' : 'below the horizon';
    return id === 'moon' ? { id, sign: signOf(p.lon), state, phase: st.moon.name } : { id, sign: signOf(p.lon), state };
  });
}

export type Lift = { kind: 'beacon'; beacon: Beacon } | { kind: 'beyond'; x: number; y: number };

const BEACON_REACH = 80;

export function lift(st: SkyState, x: number, y: number): Lift {
  let best: Beacon | null = null;
  let bestDistance = Infinity;
  for (const b of st.beacons) {
    const d = Math.hypot(b.x - x, b.y - y);
    if (d < bestDistance) {
      bestDistance = d;
      best = b;
    }
  }
  if (!best || (bestDistance > BEACON_REACH && !st.day)) return { kind: 'beyond', x, y };
  return { kind: 'beacon', beacon: best };
}

export function pickBeyond<T extends { id: string }>(pool: T[], last: string | null, random: () => number): T {
  const candidates = pool.filter((p) => p.id !== last);
  const from = candidates.length ? candidates : pool;
  return from[Math.floor(random() * from.length)]!;
}
