export interface EqPos {
  ra: number;
  dec: number;
  lon: number;
  dist: number;
}

export interface AltAz {
  alt: number;
  az: number;
}

export interface MoonPhase {
  age: number;
  name: string;
  pct: number;
  waxing: boolean;
}

export type Wanderer = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';

export const SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const;

export type Sign = (typeof SIGNS)[number];

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const J2000 = 2451545;

const julianDay = (date: Date) => date.getTime() / 86400000 + 2440587.5;
const centuries = (date: Date) => (julianDay(date) - J2000) / 36525;
const norm = (a: number) => ((a % 360) + 360) % 360;

type Elements = [base: number[], rate: number[]];

const ELEMENTS: Record<Wanderer | 'earth', Elements> = {
  mercury: [
    [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593],
    [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
  ],
  venus: [
    [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255],
    [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418],
  ],
  earth: [
    [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0],
    [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0],
  ],
  mars: [
    [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
    [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
  ],
  jupiter: [
    [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
    [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
  ],
  saturn: [
    [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
    [-0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
  ],
};

function heliocentric(name: Wanderer | 'earth', T: number): [number, number, number] {
  const [b, r] = ELEMENTS[name];
  const a = b[0]! + r[0]! * T;
  const e = b[1]! + r[1]! * T;
  const I = (b[2]! + r[2]! * T) * D2R;
  const L = b[3]! + r[3]! * T;
  const wBar = b[4]! + r[4]! * T;
  const omegaDeg = b[5]! + r[5]! * T;
  const omega = omegaDeg * D2R;
  const w = (wBar - omegaDeg) * D2R;
  let M = norm(L - wBar) * D2R;
  if (M > Math.PI) M -= 2 * Math.PI;
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 10; i++) E += (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cw = Math.cos(w);
  const sw = Math.sin(w);
  const cO = Math.cos(omega);
  const sO = Math.sin(omega);
  const cI = Math.cos(I);
  const sI = Math.sin(I);
  return [
    (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
    sw * sI * xp + cw * sI * yp,
  ];
}

function eclipticToEquatorial(x: number, y: number, z: number, T: number): EqPos {
  const eps = (23.439291 - 0.0130042 * T) * D2R;
  const ye = y * Math.cos(eps) - z * Math.sin(eps);
  const ze = y * Math.sin(eps) + z * Math.cos(eps);
  return {
    ra: norm(Math.atan2(ye, x) * R2D),
    dec: Math.atan2(ze, Math.hypot(x, ye)) * R2D,
    lon: norm(Math.atan2(y, x) * R2D),
    dist: Math.hypot(x, y, z),
  };
}

export function planet(name: Wanderer, date: Date): EqPos {
  const T = centuries(date);
  const p = heliocentric(name, T);
  const e = heliocentric('earth', T);
  return eclipticToEquatorial(p[0] - e[0], p[1] - e[1], p[2] - e[2], T);
}

export function sun(date: Date): EqPos {
  const T = centuries(date);
  const e = heliocentric('earth', T);
  return eclipticToEquatorial(-e[0], -e[1], -e[2], T);
}

export function moon(date: Date): EqPos {
  const n = julianDay(date) - J2000;
  const L = norm(218.316 + 13.176396 * n);
  const M = norm(134.963 + 13.064993 * n);
  const F = norm(93.272 + 13.22935 * n);
  const lambda = (L + 6.289 * Math.sin(M * D2R)) * D2R;
  const beta = 5.128 * Math.sin(F * D2R) * D2R;
  return eclipticToEquatorial(
    Math.cos(beta) * Math.cos(lambda),
    Math.cos(beta) * Math.sin(lambda),
    Math.sin(beta),
    n / 36525,
  );
}

const SYNODIC_MONTH = 29.530588853;
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
const PHASE_NAMES: Array<[until: number, name: string]> = [
  [1.85, 'new moon'],
  [5.54, 'waxing crescent'],
  [9.23, 'first quarter'],
  [12.92, 'waxing gibbous'],
  [16.61, 'full moon'],
  [20.3, 'waning gibbous'],
  [23.99, 'last quarter'],
  [27.68, 'waning crescent'],
  [SYNODIC_MONTH, 'new moon'],
];

export function moonPhase(date: Date): MoonPhase {
  let age = ((date.getTime() - REFERENCE_NEW_MOON) / 86400000) % SYNODIC_MONTH;
  if (age < 0) age += SYNODIC_MONTH;
  const illuminated = (1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2;
  const [, name] = PHASE_NAMES.find(([until]) => age < until) ?? PHASE_NAMES[PHASE_NAMES.length - 1]!;
  return { age, name, pct: Math.round(illuminated * 100), waxing: age < SYNODIC_MONTH / 2 };
}

export const signOf = (lon: number): Sign => SIGNS[Math.floor(norm(lon) / 30) % 12]!;

export function localSiderealTime(date: Date, lon: number): number {
  return norm(280.46061837 + 360.98564736629 * (julianDay(date) - J2000) + lon);
}

export function altaz(ra: number, dec: number, date: Date, lat: number, lon: number): AltAz {
  const H = (localSiderealTime(date, lon) - ra) * D2R;
  const phi = lat * D2R;
  const de = dec * D2R;
  const sinAlt = Math.sin(phi) * Math.sin(de) + Math.cos(phi) * Math.cos(de) * Math.cos(H);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const az = Math.atan2(
    -Math.cos(de) * Math.sin(H),
    Math.sin(de) * Math.cos(phi) - Math.cos(de) * Math.sin(phi) * Math.cos(H),
  );
  return { alt: alt * R2D, az: norm(az * R2D) };
}

export function separation(a: { ra: number; dec: number }, b: { ra: number; dec: number }): number {
  const cosD =
    Math.sin(a.dec * D2R) * Math.sin(b.dec * D2R) +
    Math.cos(a.dec * D2R) * Math.cos(b.dec * D2R) * Math.cos((a.ra - b.ra) * D2R);
  return Math.acos(Math.max(-1, Math.min(1, cosD))) * R2D;
}

export function ecliptic(lon: number, lat: number, date: Date): EqPos {
  return eclipticToEquatorial(
    Math.cos(lat * D2R) * Math.cos(lon * D2R),
    Math.cos(lat * D2R) * Math.sin(lon * D2R),
    Math.sin(lat * D2R),
    centuries(date),
  );
}

const GALACTIC = [
  [-0.0548755604, -0.8734370902, -0.4838350155],
  [0.4941094279, -0.44482963, 0.7469822445],
  [-0.867666149, -0.1980763734, 0.4559837762],
] as const;

export function galacticToEquatorial(l: number, b: number): { ra: number; dec: number } {
  const x = Math.cos(b * D2R) * Math.cos(l * D2R);
  const y = Math.cos(b * D2R) * Math.sin(l * D2R);
  const z = Math.sin(b * D2R);
  const ex = GALACTIC[0][0] * x + GALACTIC[1][0] * y + GALACTIC[2][0] * z;
  const ey = GALACTIC[0][1] * x + GALACTIC[1][1] * y + GALACTIC[2][1] * z;
  const ez = GALACTIC[0][2] * x + GALACTIC[1][2] * y + GALACTIC[2][2] * z;
  return { ra: norm(Math.atan2(ey, ex) * R2D), dec: Math.atan2(ez, Math.hypot(ex, ey)) * R2D };
}

export const angleBetween = (a: number, b: number): number => Math.abs(((a - b + 540) % 360) - 180);
