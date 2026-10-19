import { f } from '../../lib/svg';

export const G = 'var(--art-gold)';
export const GP = 'var(--art-gold-pale)';
export const MOON = 'var(--art-moon)';
export const INK = 'var(--art-ink)';
export const INK_DEEP = 'var(--art-ink-deep)';
export const INK_LIGHT = 'var(--art-ink-light)';
export const GLOW = 'var(--art-glow)';

export type Rand = () => number;

export const figure = (x: number, y: number, s: number, fill: string) =>
  `<circle cx="${f(x)}" cy="${f(y - 22 * s)}" r="${f(3.4 * s)}" fill="${fill}"/><path d="M${f(x - 2.8 * s)},${f(y - 17.5 * s)} Q${f(x)},${f(y - 20.5 * s)} ${f(x + 2.8 * s)},${f(y - 17.5 * s)} L${f(x + 5.2 * s)},${f(y)} L${f(x - 5.2 * s)},${f(y)} Z" fill="${fill}"/>`;

export const leafAt = (x: number, y: number, ang: number, len: number, w: number, op = 0.14) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})"><path d="M0,0 Q${f(len / 2)},${f(-w)} ${len},0 Q${f(len / 2)},${w} 0,0Z" fill="${G}" fill-opacity="${op}" stroke="${G}" stroke-width=".9"/><path d="M2,0 L${f(len - 3)},0" stroke="${G}" stroke-width=".5" opacity=".8"/></g>`;

export function fireflies(r: Rand, n: number, x0: number, x1: number, y0: number, y1: number): string {
  let o = '';
  for (let i = 0; i < n; i++)
    o += `<circle cx="${f(x0 + r() * (x1 - x0))}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(0.8 + r() * 1.2)}" fill="${GP}" opacity="${f(0.4 + r() * 0.6)}"/>`;
  return o;
}

export function spire(x: number, base: number, h: number, w: number, fill: string, stroke: string, op: number): string {
  let d = `M${f(x)},${f(base - h)}`;
  let y = base - h;
  while (y < base - 6) {
    const t = (y - (base - h)) / h;
    const hw = w * (0.15 + 0.85 * t);
    y += h / 7;
    d += ` L${f(x + hw)},${f(y)} L${f(x + hw * 0.55)},${f(y + 2)}`;
  }
  d += ` L${f(x + w * 0.5)},${f(base)} L${f(x - w * 0.5)},${f(base)}`;
  const left: Array<[number, number]> = [];
  let yy = base - h;
  while (yy < base - 6) {
    const t = (yy - (base - h)) / h;
    const hw = w * (0.15 + 0.85 * t);
    yy += h / 7;
    left.push([f(x - hw), f(yy)], [f(x - hw * 0.55), f(yy + 2)]);
  }
  for (const [px, py] of left.reverse()) d += ` L${px},${py}`;
  return `<path d="${d}Z" fill="${fill}" stroke="${stroke}" stroke-width=".7" opacity="${op}"/>`;
}

export function spireRow(
  r: Rand,
  base: number,
  n: number,
  hmin: number,
  hmax: number,
  op: number,
  fill: string,
  x0 = 24,
  x1 = 256,
): string {
  let o = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + (i + r() * 0.8) * ((x1 - x0) / n);
    const h = hmin + r() * (hmax - hmin);
    o += spire(x, base, h, h * 0.34, fill, G, op);
  }
  return o;
}

export function birch(x: number, y0: number, y1: number, w: number): string {
  let o = `<path d="M${f(x - w / 2)},${f(y1)} L${f(x - w / 2 + 1)},${f(y0)} L${f(x + w / 2 - 1)},${f(y0)} L${f(x + w / 2)},${f(y1)}Z" fill="${MOON}" opacity=".82"/>`;
  for (let y = y0 + 8; y < y1 - 6; y += 9 + ((y * 7) % 6))
    o += `<path d="M${f(x - w / 2)},${f(y)} h${f(w * (0.3 + ((y * 13) % 5) / 10))}" stroke="${INK}" stroke-width="1.6" opacity=".85"/>`;
  return `${o}<ellipse cx="${f(x + w * 0.15)}" cy="${f(y0 + (y1 - y0) * 0.55)}" rx="${f(w * 0.22)}" ry="${f(w * 0.5)}" fill="${INK}" opacity=".7"/>`;
}

export function sprig(x: number, y: number, ang: number, len: number, op = 0.9): string {
  let o = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" stroke="${G}" fill="none" stroke-width=".8" opacity="${op}"><path d="M0,0 L${len},0"/>`;
  for (let i = 3; i < len - 1; i += 3.2) {
    const n = 4 + i * 0.08;
    o += `<path d="M${f(i)},0 l-1.6,-${f(n)} M${f(i)},0 l-1.6,${f(n)}"/>`;
  }
  return `${o}</g>`;
}

export function cedarFan(x: number, y: number, ang: number, len: number): string {
  let o = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" stroke="${G}" fill="none" stroke-width=".8"><path d="M0,0 Q${f(len * 0.6)},2 ${len},${f(len * 0.35)}"/>`;
  for (let i = 4; i < len; i += 5) {
    const t = i / len;
    const yy = t * t * len * 0.35;
    o += `<path d="M${f(i)},${f(yy)} q3,-5 7,-6 M${f(i)},${f(yy)} q2,4 6,6"/>`;
  }
  return `${o}</g>`;
}

export const mapleLeaf = (x: number, y: number, ang: number, s: number) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) scale(${s})"><path d="M0,0 L-2,-6 L-7,-5 L-5,-9 L-9,-13 L-4,-13 L-3,-18 L0,-14 L3,-18 L4,-13 L9,-13 L5,-9 L7,-5 L2,-6 Z" fill="${G}" fill-opacity=".16" stroke="${G}" stroke-width=".9"/><path d="M0,0 L0,-14 M0,-6 L-5,-9 M0,-6 L5,-9" stroke="${G}" stroke-width=".5"/></g>`;

export const mist = (x: number, y: number, rx: number, ry: number, op: number) =>
  `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="${ry}" fill="${MOON}" opacity="${op}"/>`;
