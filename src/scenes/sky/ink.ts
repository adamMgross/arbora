import type { MoonPhase } from '../../lib/sky-math';
import { f, rng } from '../../lib/svg';

export const GOLD = 'var(--art-gold)';
export const VERM = 'var(--art-verm)';
export const LAPIS = 'var(--art-lapis)';
export const SHADE = 'var(--art-shade)';
export const CREAM = 'var(--art-cream)';
export const MUTED = 'var(--art-muted)';
export const DAY_INK = 'var(--art-day-ink)';
export const DAY_SKY = 'var(--art-day-sky)';
export const SMALLCAPS = "'Cormorant SC',Georgia,serif";
export const SERIF = "'Cormorant Garamond',Georgia,serif";

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
