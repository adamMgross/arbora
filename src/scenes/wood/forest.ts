import { f } from '../../lib/svg';

export const G = 'var(--art-gold)';
export const GP = 'var(--art-gold-pale)';
export const MOON = 'var(--art-moon)';
export const INK = 'var(--art-ink)';

export type Rand = () => number;

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
