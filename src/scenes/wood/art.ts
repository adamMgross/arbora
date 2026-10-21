import type { WoodCard } from '../../lib/decks';
import { esc, f, rng } from '../../lib/svg';
import { G, GP, MOON, INK, spire, spireRow } from './forest';
import type { Wood } from '../../lib/wood-walk';
import { pictureFace, svgOpen } from '../book';

const FELL_SC = "'IM Fell English SC',Georgia,serif";

export const woodFace = (card: WoodCard): string =>
  pictureFace(
    card.picture,
    `${card.circle}: ${card.name}, ${card.from}`,
    esc(card.name),
    '(max-width: 640px) 82vw, 520px',
  );

export function woodBack(): string {
  const r = rng(3);
  let s = `${svgOpen()}<rect width="280" height="480" rx="14" fill="${INK}"/><rect x="12" y="12" width="256" height="456" rx="8" fill="none" stroke="${G}" stroke-width="1.2"/><rect x="18" y="18" width="244" height="444" rx="5" fill="none" stroke="${G}" stroke-width=".5" opacity=".7"/>`;
  let d = '';
  for (let k = 1; k <= 14; k++) {
    const R = k * 7.2;
    const ph = r() * 6;
    for (let j = 0; j <= 60; j++) {
      const a = (j / 60) * Math.PI * 2;
      const rr = R * (1 + 0.035 * Math.sin(3 * a + ph) + 0.02 * Math.sin(7 * a + k));
      d += `${j ? 'L' : 'M'}${f(140 + k * 0.6 + Math.cos(a) * rr)},${f(236 - k * 0.3 + Math.sin(a) * rr * 1.06)}`;
    }
  }
  s += `<path d="${d}" fill="none" stroke="${G}" stroke-width=".7" opacity=".65"/>`;
  s += spireRow(rng(8), 400, 9, 16, 34, 0.5, INK, 40, 240);
  s += `<path d="M118,236 Q140,218 162,236 Q140,254 118,236Z" fill="${INK}" stroke="${GP}" stroke-width="1"/><circle cx="140" cy="236" r="5" fill="${GP}"/>`;
  s += `<text x="140" y="440" text-anchor="middle" font-family="${FELL_SC}" font-size="11" letter-spacing="7" fill="${G}">ARBORA</text>`;
  return `${s}</svg>`;
}

export function woodScene(kind: Wood): string {
  const r = rng(kind === 'coast' ? 41 : kind === 'mountain' ? 43 : 47);
  const sky = [1, 2, 3].map((i) => `var(--art-${kind}-${i})`);
  let bg = `<defs><linearGradient id="wood-sky-${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".55" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient></defs><rect width="600" height="600" fill="url(#wood-sky-${kind})"/>`;
  if (kind === 'mountain')
    bg += `<path d="M0,250 L90,150 L170,210 L260,110 L350,190 L430,130 L520,200 L600,150 V600 H0Z" fill="var(--art-ridge)" opacity=".7"/>`;
  let far = '';
  let mid = '';
  let near = '';
  for (let i = 0; i < 40; i++) {
    const h = 50 + r() * 70;
    far += spire(r() * 600, 420, h, h * 0.32, 'var(--art-far)', 'var(--art-far-line)', 0.9);
  }
  for (let i = 0; i < 26; i++) {
    const h = 110 + r() * 110;
    mid += spire(r() * 600, 520, h, h * 0.3, 'var(--art-mid)', 'var(--art-mid-line)', 0.95);
  }
  bg += `${far}<ellipse cx="300" cy="430" rx="400" ry="26" fill="${MOON}" opacity="${kind === 'coast' ? 0.09 : 0.05}"/>${mid}`;
  if (kind !== 'coast') {
    for (let i = 0; i < 9; i++) {
      const bx = 20 + r() * 560;
      const bw = 8 + r() * 10;
      bg += `<rect x="${f(bx)}" y="${f(300 + r() * 80)}" width="${f(bw)}" height="400" fill="${MOON}" opacity=".62"/>`;
      for (let y = 330 + r() * 40; y < 600; y += 26 + r() * 30)
        bg += `<rect x="${f(bx)}" y="${f(y)}" width="${f(bw * 0.6)}" height="2.4" fill="var(--art-ink-deep)" opacity=".9"/>`;
    }
  }
  if (kind === 'mountain') {
    for (let i = 0; i < 60; i++)
      bg += `<circle cx="${f(r() * 600)}" cy="${f(240 + r() * 120)}" r="${f(1.5 + r() * 2)}" fill="${G}" opacity="${f(0.2 + r() * 0.4)}"/>`;
  }
  for (let i = 0; i < 9; i++) {
    const h = 260 + r() * 300;
    near += spire(r() * 600, 650, h, h * 0.26, 'var(--art-near)', 'var(--art-near-line)', 1);
  }
  if (kind === 'coast') {
    for (const [x, w] of [
      [-20, 90],
      [540, 100],
    ])
      bg += `<path d="M${x},600 L${x! + w! * 0.15},0 L${x! + w! * 0.85},0 L${x! + w!},600Z" fill="var(--art-ink-deep)"/>`;
  }
  bg += `${near}<ellipse cx="300" cy="590" rx="420" ry="90" fill="${MOON}" opacity=".06"/>`;
  if (kind === 'coast')
    bg += `<ellipse cx="200" cy="470" rx="260" ry="18" fill="${MOON}" opacity=".06"/><ellipse cx="420" cy="520" rx="220" ry="14" fill="${MOON}" opacity=".05"/>`;
  return bg;
}
