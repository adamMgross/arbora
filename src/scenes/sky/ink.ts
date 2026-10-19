import type { SkyState } from '../../lib/sky-dome';
import type { MoonPhase } from '../../lib/sky-math';
import { f, rng } from '../../lib/svg';

export const GOLD = 'var(--art-gold)';
export const VERM = 'var(--art-verm)';
export const TEAL = 'var(--art-teal)';
export const LAPIS = 'var(--art-lapis)';
export const SHADE = 'var(--art-shade)';
export const CREAM = 'var(--art-cream)';
export const MUTED = 'var(--art-muted)';
export const DAY_INK = 'var(--art-day-ink)';
export const DAY_SKY = 'var(--art-day-sky)';
export const SMALLCAPS = "'Cormorant SC',Georgia,serif";
export const SERIF = "'Cormorant Garamond',Georgia,serif";

export type Drawer = (cx: number, cy: number, st: SkyState | null) => string;

export function moonDisc(cx: number, cy: number, r: number, ph: MoonPhase, lit: string, dark: string): string {
  const theta = (2 * Math.PI * ph.age) / 29.530588853;
  const rx = Math.abs(Math.cos(theta)) * r;
  const top = `${cx},${cy - r}`;
  const bottom = `${cx},${cy + r}`;
  const d = ph.waxing
    ? `M${top} A${r},${r} 0 0 1 ${bottom} A${f(rx)},${r} 0 0 ${ph.pct < 50 ? 0 : 1} ${top}Z`
    : `M${top} A${r},${r} 0 0 0 ${bottom} A${f(rx)},${r} 0 0 ${ph.pct < 50 ? 1 : 0} ${top}Z`;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${dark}"/><path d="${d}" fill="${lit}"/>`;
}

export const pilgrim = (x: number, y: number, color: string, s = 1) =>
  `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><circle cx="0" cy="-10" r="2.4" fill="${color}"/><path d="M-1.9,-7 Q0,-8.4 1.9,-7 L3,0 L-3,0Z" fill="${color}"/></g>`;

export const sparkle = (x: number, y: number, r: number, fill: string) =>
  `<path d="M${f(x)},${f(y - r)} L${f(x + r * 0.22)},${f(y - r * 0.22)} L${f(x + r)},${f(y)} L${f(x + r * 0.22)},${f(y + r * 0.22)} L${f(x)},${f(y + r)} L${f(x - r * 0.22)},${f(y + r * 0.22)} L${f(x - r)},${f(y)} L${f(x - r * 0.22)},${f(y - r * 0.22)}Z" fill="${fill}"/>`;

export function dust(cx: number, cy: number, seed: number, n: number): string {
  const r = rng(seed);
  let o = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 92;
    o += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(0.3 + r() * r() * 1.4)}" fill="${CREAM}" opacity="${f(0.3 + r() * 0.6)}"/>`;
  }
  return o;
}

export function constellation(
  cx: number,
  cy: number,
  stars: Array<[number, number, number]>,
  lines: Array<[number, number]>,
  accent: number[] = [],
): string {
  let o = '';
  for (const [a, b] of lines)
    o += `<path d="M${f(cx + stars[a]![0])},${f(cy + stars[a]![1])} L${f(cx + stars[b]![0])},${f(cy + stars[b]![1])}" stroke="${CREAM}" stroke-width=".6" stroke-dasharray="2 3" opacity=".55"/>`;
  stars.forEach(([x, y, r], i) => {
    o += accent.includes(i) ? sparkle(cx + x, cy + y, r * 2.2, VERM) : sparkle(cx + x, cy + y, r * 1.6, CREAM);
  });
  return o;
}
