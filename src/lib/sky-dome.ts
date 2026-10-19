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
export type FigureId =
  | 'orion'
  | 'dipper'
  | 'pleiades'
  | 'dogstar'
  | 'scorpion'
  | 'swan'
  | 'weaver'
  | 'lion'
  | 'bull'
  | 'twins'
  | 'queen'
  | 'herdsman'
  | 'chained'
  | 'archer';
export type BeaconId = HeavenId | FigureId | 'milkyway' | 'falling';

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
  dogstar: {
    stars: [
      [101.29, -16.72],
      [95.68, -17.96],
      [107.1, -26.39],
      [104.66, -28.97],
      [111.02, -29.3],
      [95.08, -30.06],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [2, 3],
      [2, 4],
      [3, 5],
    ],
    center: 0,
  },
  scorpion: {
    stars: [
      [247.35, -26.43],
      [241.36, -19.81],
      [240.08, -22.62],
      [239.71, -26.11],
      [245.3, -25.59],
      [248.97, -28.22],
      [252.54, -34.29],
      [252.97, -38.05],
      [254.66, -42.36],
      [258.04, -43.24],
      [264.33, -43.0],
      [265.62, -39.03],
      [263.4, -37.1],
    ],
    lines: [
      [1, 2],
      [2, 3],
      [2, 4],
      [4, 0],
      [0, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
      [9, 10],
      [10, 11],
      [11, 12],
    ],
    center: 0,
  },
  swan: {
    stars: [
      [310.36, 45.28],
      [305.56, 40.26],
      [311.55, 33.97],
      [296.24, 45.13],
      [292.68, 27.96],
      [299.08, 35.08],
    ],
    lines: [
      [0, 1],
      [1, 5],
      [5, 4],
      [3, 1],
      [1, 2],
    ],
    center: 1,
  },
  weaver: {
    stars: [
      [279.23, 38.78],
      [281.19, 37.61],
      [283.63, 36.9],
      [284.74, 32.69],
      [282.52, 33.36],
      [297.7, 8.87],
      [296.57, 10.61],
      [298.83, 6.41],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [6, 5],
      [5, 7],
    ],
    center: 0,
  },
  lion: {
    stars: [
      [152.09, 11.97],
      [151.83, 16.76],
      [154.99, 19.84],
      [154.17, 23.42],
      [148.19, 26.01],
      [146.46, 23.77],
      [168.53, 20.52],
      [168.56, 15.43],
      [177.27, 14.57],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [2, 6],
      [6, 8],
      [8, 7],
      [7, 0],
    ],
    center: 0,
  },
  bull: {
    stars: [
      [68.98, 16.51],
      [81.57, 28.61],
      [84.41, 21.14],
      [64.95, 15.63],
      [65.73, 17.54],
      [67.15, 19.18],
      [67.17, 15.87],
    ],
    lines: [
      [3, 4],
      [4, 5],
      [5, 1],
      [3, 6],
      [6, 0],
      [0, 2],
    ],
    center: 0,
  },
  twins: {
    stars: [
      [113.65, 31.89],
      [116.33, 28.03],
      [100.98, 25.13],
      [95.74, 22.51],
      [110.03, 21.98],
      [99.43, 16.4],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [2, 3],
      [1, 4],
      [4, 5],
    ],
    center: 0,
  },
  queen: {
    stars: [
      [2.29, 59.15],
      [10.13, 56.54],
      [14.18, 60.72],
      [21.45, 60.24],
      [28.6, 63.67],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    center: 2,
  },
  herdsman: {
    stars: [
      [213.92, 19.18],
      [217.96, 30.37],
      [218.02, 38.31],
      [225.49, 40.39],
      [228.88, 33.32],
      [221.25, 27.07],
      [208.67, 18.4],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [0, 6],
    ],
    center: 0,
  },
  chained: {
    stars: [
      [2.1, 29.09],
      [9.83, 30.86],
      [17.43, 35.62],
      [30.97, 42.33],
      [14.19, 38.5],
      [12.45, 41.08],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [4, 5],
    ],
    center: 2,
  },
  archer: {
    stars: [
      [276.04, -34.38],
      [275.25, -29.83],
      [276.99, -25.42],
      [283.82, -26.3],
      [285.65, -29.88],
      [271.45, -30.42],
      [281.41, -26.99],
      [286.74, -27.67],
    ],
    lines: [
      [5, 1],
      [1, 0],
      [0, 5],
      [1, 2],
      [2, 6],
      [6, 1],
      [6, 3],
      [3, 7],
      [7, 4],
      [4, 6],
      [4, 0],
    ],
    center: 6,
  },
};

interface Shower {
  ra: number;
  dec: number;
  from: [month: number, day: number];
  to: [month: number, day: number];
}

export const SHOWERS: Shower[] = [
  { ra: 48, dec: 58, from: [7, 17], to: [8, 24] },
  { ra: 112, dec: 33, from: [12, 4], to: [12, 20] },
];

const monthDay = (date: Date) => (date.getMonth() + 1) * 100 + date.getDate();

export function activeShower(date: Date): Shower | null {
  const md = monthDay(date);
  return SHOWERS.find((s) => md >= s.from[0] * 100 + s.from[1] && md <= s.to[0] * 100 + s.to[1]) ?? null;
}

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
  places: Partial<Record<BeaconId, AltAz>>;
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
  const places: Partial<Record<BeaconId, AltAz>> = { sun: sunAA, moon: moonAA };
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
    places[name] = aa;
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
  for (const id of Object.keys(FIGURES) as FigureId[]) {
    const figure = FIGURES[id];
    const pts = figure.stars.map(([ra, dec]) => altaz(ra, dec, date, lat, lon));
    places[id] = pts[figure.center]!;
    if (day) continue;
    figures[id] = pts;
    add(id, pts[figure.center]!);
  }
  let highest: AltAz | null = null;
  for (let l = 0; l < 360; l += 5) {
    const g = galacticToEquatorial(l, 0);
    const aa = altaz(g.ra, g.dec, date, lat, lon);
    if (!day) milkyWay.push(aa);
    if (!highest || aa.alt > highest.alt) highest = aa;
  }
  places.milkyway = highest!;
  if (!day && highest!.alt > 10) add('milkyway', highest!);
  const shower = activeShower(date);
  if (shower) {
    const radiant = altaz(shower.ra, shower.dec, date, lat, lon);
    places.falling = radiant;
    if (!day) add('falling', radiant);
  }
  if (!day) {
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
    places,
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

export interface Landing {
  x: number;
  y: number;
  risen: boolean | null;
}

export function landing(st: SkyState, id: string, tap: [number, number]): Landing {
  const aa = st.places[id as BeaconId];
  if (!aa) return { x: tap[0], y: tap[1], risen: null };
  const [x, y] = project(aa.alt > 0 ? aa : { alt: 0, az: aa.az });
  return { x, y, risen: aa.alt > 0 };
}

export function drawPlate<T extends { id: string }>(pool: T[], last: string | null, random: () => number): T {
  const candidates = pool.filter((p) => p.id !== last);
  const from = candidates.length ? candidates : pool;
  return from[Math.floor(random() * from.length)]!;
}
