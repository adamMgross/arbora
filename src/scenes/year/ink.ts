import { f } from '../../lib/svg';

export const WASHI = 'var(--art-washi)';
export const SUMI = 'var(--art-sumi)';
export const RED = 'var(--art-red)';
export const SERIF = "'Cormorant Garamond',Georgia,serif";
export const SMALLCAPS = "'Cormorant SC',Georgia,serif";

export const seasonVar = (key: string, part: string) => `var(--art-${key}-${part})`;

export const FRUIT = 'var(--art-fruit)';

export function hillPath(y: number, amp: number, period: number, phase: number): string {
  let d = `M18,${f(y)}`;
  for (let x = 18; x <= 262; x += 8) d += ` L${x},${f(y + Math.sin(x / period + phase) * amp)}`;
  return `${d} L262,${f(y + Math.sin(262 / period + phase) * amp)} V318 H18 Z`;
}

export const sunY = (index: number): number => 128 - 56 * Math.sin((2 * Math.PI * (index - 9)) / 72);
