export const f = (n: number): number => Math.round(n * 10) / 10;

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

export const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ESCAPES[c] ?? c);

export function rng(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let counter = 0;

export const uid = (prefix: string): string => `${prefix}${++counter}`;

export const polar = (cx: number, cy: number, deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [f(cx + Math.sin(a) * r), f(cy - Math.cos(a) * r)];
};
