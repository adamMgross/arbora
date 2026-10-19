import type { SkyArt, SkyPlate } from '../../lib/decks';
import { DOME, FIGURES, HEAVENS, ORDINALS, project, type FigureId, type SkyState } from '../../lib/sky-dome';
import type { MoonPhase } from '../../lib/sky-math';
import { esc, f, rng, uid } from '../../lib/svg';
import { svgOpen } from '../book';

const GOLD = 'var(--art-gold)';
const VERM = 'var(--art-verm)';
const TEAL = 'var(--art-teal)';
const LAPIS = 'var(--art-lapis)';
const SHADE = 'var(--art-shade)';
const CREAM = 'var(--art-cream)';
const MUTED = 'var(--art-muted)';
const DAY_INK = 'var(--art-day-ink)';
const DAY_SKY = 'var(--art-day-sky)';
const SMALLCAPS = "'Cormorant SC',Georgia,serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

type Drawer = (cx: number, cy: number, st: SkyState | null) => string;

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

const pilgrim = (x: number, y: number, color: string, s = 1) =>
  `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><circle cx="0" cy="-10" r="2.4" fill="${color}"/><path d="M-1.9,-7 Q0,-8.4 1.9,-7 L3,0 L-3,0Z" fill="${color}"/></g>`;

const sparkle = (x: number, y: number, r: number, fill: string) =>
  `<path d="M${f(x)},${f(y - r)} L${f(x + r * 0.22)},${f(y - r * 0.22)} L${f(x + r)},${f(y)} L${f(x + r * 0.22)},${f(y + r * 0.22)} L${f(x)},${f(y + r)} L${f(x - r * 0.22)},${f(y + r * 0.22)} L${f(x - r)},${f(y)} L${f(x - r * 0.22)},${f(y - r * 0.22)}Z" fill="${fill}"/>`;

function dust(cx: number, cy: number, seed: number, n: number): string {
  const r = rng(seed);
  let o = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 92;
    o += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(0.3 + r() * r() * 1.4)}" fill="${CREAM}" opacity="${f(0.3 + r() * 0.6)}"/>`;
  }
  return o;
}

const ART: Record<SkyArt, Drawer> = {
  sun(cx, cy) {
    let o = '';
    for (let i = 0; i < 24; i++) {
      const a = (i * 15 * Math.PI) / 180;
      const r2 = i % 2 ? 76 : 90;
      o += `<path d="M${f(cx + Math.cos(a) * 62)},${f(cy + Math.sin(a) * 62)}L${f(cx + Math.cos(a) * r2)},${f(cy + Math.sin(a) * r2)}" stroke="${GOLD}" stroke-width="1" opacity=".85"/>`;
    }
    o += `<circle cx="${cx}" cy="${cy}" r="50" fill="${VERM}"/><circle cx="${cx}" cy="${cy}" r="50" fill="none" stroke="${GOLD}" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="22" fill="none" stroke="${GOLD}" stroke-width=".7" opacity=".7"/>`;
    return o;
  },
  moon(cx, cy, st) {
    const ph = st?.moon ?? { age: 7.4, pct: 50, waxing: true, name: 'first quarter' };
    let o = moonDisc(cx, cy, 54, ph, CREAM, SHADE);
    for (const [dx, dy, r] of [
      [-14, -20, 9],
      [10, -28, 6],
      [20, 12, 11],
      [-22, 18, 7],
      [2, 30, 5],
    ])
      o += `<circle cx="${cx + dx!}" cy="${cy + dy!}" r="${r}" fill="none" stroke="${MUTED}" stroke-width=".7" opacity=".5"/>`;
    return `${o}<circle cx="${cx}" cy="${cy}" r="54" fill="none" stroke="${GOLD}" stroke-width="1.1"/>`;
  },
  mercury(cx, cy) {
    let o = `<path d="M${cx - 100},${cy + 100} A140,140 0 0 1 ${cx + 100},${cy + 100}" fill="${VERM}" opacity=".55"/><path d="M${cx - 100},${cy + 100} A140,140 0 0 1 ${cx + 100},${cy + 100}" fill="none" stroke="${GOLD}" stroke-width="1"/>`;
    o += `<circle cx="${cx + 10}" cy="${cy - 30}" r="24" fill="${CREAM}"/>`;
    for (const [dx, dy, r] of [
      [-8, -6, 5],
      [6, 8, 4],
      [9, -10, 3],
    ])
      o += `<circle cx="${cx + 10 + dx!}" cy="${cy - 30 + dy!}" r="${r}" fill="none" stroke="${MUTED}" stroke-width=".7"/>`;
    return `${o}<circle cx="${cx + 10}" cy="${cy - 30}" r="24" fill="none" stroke="${GOLD}" stroke-width="1"/>`;
  },
  venus(cx, cy) {
    let o = `<circle cx="${cx}" cy="${cy}" r="52" fill="${CREAM}"/>`;
    for (let i = -3; i <= 3; i++)
      o += `<path d="M${cx - 50},${cy + i * 13} Q${cx},${cy + i * 13 + (i % 2 ? 6 : -6)} ${cx + 50},${cy + i * 13}" fill="none" stroke="${MUTED}" stroke-width="3" opacity=".4"/>`;
    o += `<path d="M${cx},${cy - 52} A52,52 0 0 0 ${cx},${cy + 52} A28,52 0 0 1 ${cx},${cy - 52}Z" fill="${LAPIS}" opacity=".88"/><circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="${GOLD}" stroke-width="1.1"/>`;
    for (let g = 0; g < 7; g++) {
      const gx = cx - 84 + g * 28;
      o += `<path d="M${gx},${cy + 96} V${cy + 78} A6,6 0 0 1 ${gx + 12},${cy + 78} V${cy + 96}" fill="none" stroke="${GOLD}" stroke-width=".8" opacity=".8"/>`;
    }
    return o;
  },
  mars(cx, cy) {
    let o = `<circle cx="${cx}" cy="${cy}" r="48" fill="${VERM}"/>`;
    o += `<path d="M${cx - 48},${cy - 4} Q${cx - 20},${cy - 30} ${cx + 6},${cy - 8} Q${cx + 22},${cy + 10} ${cx + 2},${cy + 26} Q${cx - 24},${cy + 30} ${cx - 48},${cy + 4}Z" fill="${LAPIS}" opacity=".5"/>`;
    o += `<ellipse cx="${cx}" cy="${cy - 42}" rx="18" ry="6" fill="${CREAM}"/><circle cx="${cx}" cy="${cy}" r="48" fill="none" stroke="${GOLD}" stroke-width="1.1"/>`;
    o += `<path d="M${cx - 96},${cy + 70} C${cx - 40},${cy + 40} ${cx - 20},${cy + 100} ${cx + 30},${cy + 76} S${cx + 80},${cy + 50} ${cx + 98},${cy + 66}" fill="none" stroke="${GOLD}" stroke-width=".8" stroke-dasharray="3 3" opacity=".8"/>`;
    return o;
  },
  jupiter(cx, cy) {
    const id = uid('jv');
    let o = `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="56"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="56" fill="${CREAM}"/><g clip-path="url(#${id})">`;
    for (const [dy, h, op] of [
      [-44, 8, 0.5],
      [-28, 6, 0.25],
      [-14, 10, 0.6],
      [4, 8, 0.3],
      [18, 12, 0.55],
      [34, 6, 0.3],
      [46, 8, 0.5],
    ])
      o += `<rect x="${cx - 58}" y="${cy + dy!}" width="116" height="${h}" fill="${LAPIS}" opacity="${op}"/>`;
    o += `<ellipse cx="${cx + 20}" cy="${cy + 18}" rx="13" ry="6.5" fill="${VERM}"/></g><circle cx="${cx}" cy="${cy}" r="56" fill="none" stroke="${GOLD}" stroke-width="1.1"/>`;
    [-90, -74, 72, 88].forEach((dx, i) => {
      o += `<circle cx="${cx + dx}" cy="${cy - 2 + i}" r="2.2" fill="${GOLD}"/>`;
    });
    return o;
  },
  saturn(cx, cy) {
    const id = uid('sat');
    let o = `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="44"/></clipPath></defs>`;
    o += `<ellipse cx="${cx}" cy="${cy}" rx="126" ry="46" fill="none" stroke="${GOLD}" stroke-width=".6" stroke-dasharray="2 4" opacity=".6" transform="rotate(-16 ${cx} ${cy})"/>`;
    o += `<g transform="rotate(-16 ${cx} ${cy})"><path d="M${cx - 92},${cy} A92,22 0 0 1 ${cx + 92},${cy}" fill="none" stroke="${GOLD}" stroke-width="1.3"/><path d="M${cx - 76},${cy} A76,17 0 0 1 ${cx + 76},${cy}" fill="none" stroke="${TEAL}" stroke-width="6" stroke-opacity=".55"/></g>`;
    o += `<circle cx="${cx}" cy="${cy}" r="44" fill="${VERM}"/><g clip-path="url(#${id})" transform="rotate(-16 ${cx} ${cy})">`;
    [-24, -10, 6, 22].forEach((dy, i) => {
      o += `<rect x="${cx - 50}" y="${cy + dy}" width="100" height="${4 + i}" fill="${i % 2 ? GOLD : LAPIS}" opacity=".22"/>`;
    });
    o += `</g><circle cx="${cx}" cy="${cy}" r="44" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`;
    o += `<g transform="rotate(-16 ${cx} ${cy})"><path d="M${cx - 92},${cy} A92,22 0 0 0 ${cx + 92},${cy}" fill="none" stroke="${GOLD}" stroke-width="1.3"/><path d="M${cx - 76},${cy} A76,17 0 0 0 ${cx + 76},${cy}" fill="none" stroke="${TEAL}" stroke-width="6" stroke-opacity=".8"/></g>`;
    o += `<circle cx="${cx + 104}" cy="${cy - 52}" r="4" fill="${GOLD}"/><circle cx="${cx - 112}" cy="${cy + 20}" r="3" fill="${GOLD}"/><circle cx="${cx + 36}" cy="${cy + 60}" r="2.5" fill="${GOLD}"/>`;
    return o;
  },
  pleiades(cx, cy) {
    const id = uid('ple');
    const gid = uid('neb');
    let o = `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="96"/></clipPath><radialGradient id="${gid}"><stop offset="0" stop-color="${TEAL}" stop-opacity=".55"/><stop offset="1" stop-color="${TEAL}" stop-opacity="0"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="96" fill="${LAPIS}"/><g clip-path="url(#${id})">${dust(cx, cy, 7, 70)}`;
    o += `<circle cx="${cx}" cy="${cy - 6}" r="80" fill="url(#${gid})"/>`;
    const S: Array<[number, number, number]> = [
      [0, 0, 9],
      [62, -8, 7],
      [66, -34, 2.6],
      [-22, 26, 7],
      [-56, -6, 7.5],
      [-36, -34, 7],
      [-26, -64, 6],
    ];
    o += `<path d="M${S.map((s) => `${f(cx + s[0])},${f(cy + s[1])}`).join(' L')}" fill="none" stroke="${CREAM}" stroke-width=".5" stroke-dasharray="2 3" opacity=".5"/>`;
    S.forEach((s, i) => {
      o += sparkle(cx + s[0], cy + s[1], s[2], i === 2 ? MUTED : CREAM);
    });
    o += `<circle cx="${cx + 66}" cy="${cy - 34}" r="9" fill="none" stroke="${GOLD}" stroke-width="1"/>`;
    return `${o}</g>`;
  },
  orion(cx, cy) {
    const S: Array<[number, number, number, string]> = [
      [-34, -62, 4.8, VERM],
      [28, -58, 3.6, GOLD],
      [-4, -86, 2.2, GOLD],
      [-12, -2, 3.4, GOLD],
      [0, 4, 3.6, GOLD],
      [12, 10, 3.4, GOLD],
      [-38, 66, 3.2, GOLD],
      [28, 68, 4.8, GOLD],
    ];
    let o = `<circle cx="${cx + 2}" cy="${cy + 30}" r="9" fill="${TEAL}" opacity=".35"/>`;
    for (const s of S) o += `<circle cx="${cx + s[0]}" cy="${cy + s[1]}" r="${s[2]}" fill="${s[3]}"/>`;
    return o;
  },
  dipper(cx, cy) {
    const D: Array<[number, number]> = [
      [-92, 22],
      [-62, 8],
      [-34, -4],
      [-8, -18],
      [26, -26],
      [44, -2],
      [14, 16],
    ];
    let o = '';
    for (const d of D) o += `<circle cx="${cx + d[0]}" cy="${cy + d[1]}" r="3.2" fill="${CREAM}"/>`;
    o += `<path d="M${f(cx + 44)},${f(cy - 2)} L${f(cx + 74)},${f(cy - 92)}" stroke="${GOLD}" stroke-width=".8" stroke-dasharray="3 3"/><circle cx="${cx + 74}" cy="${cy - 92}" r="4" fill="${CREAM}"/>`;
    return o;
  },
  milkyway(cx, cy) {
    const r = rng(23);
    let o = `<path d="M${cx - 130},${cy + 70} Q${cx},${cy - 40} ${cx + 130},${cy - 78}" fill="none" stroke="${CREAM}" stroke-width="54" opacity=".1"/>`;
    for (let i = 0; i < 420; i++) {
      const t = r();
      const x = cx - 130 + t * 260;
      const y = cy + 70 + -110 * t * (1 - t) * 2 + -148 * t + (r() - 0.5) * 44;
      o += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.4 + r() * 1.1)}" fill="${CREAM}" opacity="${f(0.3 + r() * 0.6)}"/>`;
    }
    return o;
  },
  silence(cx, cy) {
    let o = '';
    for (let k = 1; k <= 6; k++) {
      const R = 18 + k * 15;
      o += `<path d="M${f(cx - R * 0.8)},${f(cy + 40 - R * 0.6)} A${R},${R} 0 0 1 ${f(cx + R * 0.8)},${f(cy + 40 - R * 0.6)}" fill="none" stroke="${GOLD}" stroke-width="${f(1.2 - k * 0.15)}" opacity="${f(0.9 - k * 0.13)}"/>`;
    }
    return `${o}<circle cx="${cx}" cy="${cy - 70}" r="2.2" fill="${CREAM}"/>`;
  },
  oldlight(cx, cy) {
    let o = '';
    for (let i = 0; i < 16; i++) {
      const a = (i * 22.5 * Math.PI) / 180;
      o += `<path d="M${f(cx - 50 + Math.cos(a) * 10)},${f(cy - 50 + Math.sin(a) * 10)}L${f(cx - 50 + Math.cos(a) * (i % 2 ? 22 : 30))},${f(cy - 50 + Math.sin(a) * (i % 2 ? 22 : 30))}" stroke="${CREAM}" stroke-width="1"/>`;
    }
    o += `<circle cx="${cx - 50}" cy="${cy - 50}" r="7" fill="${CREAM}"/>`;
    o += `<circle cx="${cx + 52}" cy="${cy - 50}" r="7" fill="none" stroke="${MUTED}" stroke-width=".8" stroke-dasharray="2 2"/><path d="M${cx + 44},${cy - 58} L${cx + 60},${cy - 42} M${cx + 60},${cy - 58} L${cx + 44},${cy - 42}" stroke="${MUTED}" stroke-width=".7" opacity=".7"/>`;
    o += `<path d="M${cx - 46},${cy - 44} L${cx - 6},${cy + 84}" stroke="${GOLD}" stroke-width=".9" stroke-dasharray="4 3" opacity=".9"/>`;
    return o;
  },
  mirror(cx, cy) {
    const r = rng(77);
    const pts: Array<[number, number, number]> = [];
    for (let i = 0; i < 40; i++) pts.push([cx - 96 + r() * 192, cy - 92 + r() * 84, 0.6 + r() * 1.6]);
    let o = '';
    for (const s of pts) o += `<circle cx="${f(s[0])}" cy="${f(s[1])}" r="${f(s[2])}" fill="${CREAM}"/>`;
    o += `<path d="M${cx - 110},${cy} H${cx + 110}" stroke="${GOLD}" stroke-width="1"/>`;
    for (const s of pts)
      o += `<circle cx="${f(s[0])}" cy="${f(2 * cy - s[1])}" r="${f(s[2] * 0.9)}" fill="${CREAM}" opacity=".4"/>`;
    for (let i = 1; i < 5; i++)
      o += `<path d="M${cx - 100},${cy + i * 18} q20,-3 40,0 t40,0 t40,0 t40,0 t40,0" fill="none" stroke="${MUTED}" stroke-width=".5" opacity=".5"/>`;
    return o;
  },
  message(cx, cy) {
    let o = `<path d="M${cx + 6},${cy - 20} Q${cx - 10},${cy + 30} ${cx - 30},${cy + 96}" fill="none" stroke="${GOLD}" stroke-width=".8" opacity=".8"/>`;
    o += `<circle cx="${cx + 6}" cy="${cy - 36}" r="26" fill="${VERM}" opacity=".25"/><path d="M${cx - 8},${cy - 56} L${cx + 20},${cy - 56} L${cx + 16},${cy - 20} L${cx - 4},${cy - 20}Z" fill="${VERM}" opacity=".9" stroke="${GOLD}" stroke-width=".8"/><circle cx="${cx + 6}" cy="${cy - 38}" r="4" fill="${CREAM}"/>`;
    for (let i = 0; i < 9; i++)
      o += `<circle cx="${f(cx - 60 + i * 15)}" cy="${f(cy + 70 + Math.sin(i) * 6)}" r="1.2" fill="${CREAM}" opacity=".6"/>`;
    return o;
  },
  stranger(cx, cy) {
    let o = `<path d="M${cx - 30},${cy + 90} V${cy - 10} A30,30 0 0 1 ${cx + 30},${cy - 10} V${cy + 90}Z" fill="${VERM}" opacity=".55"/><path d="M${cx - 30},${cy + 90} V${cy - 10} A30,30 0 0 1 ${cx + 30},${cy - 10} V${cy + 90}" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`;
    o += `<path d="M${cx - 96},${cy + 90} H${cx + 96}" stroke="${GOLD}" stroke-width=".8"/>`;
    o += `${pilgrim(cx + 2, cy + 90, LAPIS, 2.2)}<path d="M${cx},${cy - 84} l2.5,7 7,0 -5.6,4.4 2.1,7 -6,-4.3 -6,4.3 2.1,-7 -5.6,-4.4 7,0z" fill="${CREAM}"/>`;
    o += `<path d="M${cx - 70},${cy - 60} Q${cx - 60},${cy - 80} ${cx - 50},${cy - 60} M${cx + 56},${cy - 40} Q${cx + 66},${cy - 60} ${cx + 76},${cy - 40}" fill="none" stroke="${GOLD}" stroke-width=".7" opacity=".6"/>`;
    return o;
  },
  view(cx, cy) {
    let o = '';
    for (let i = 1; i <= 5; i++)
      o += `<circle cx="${cx}" cy="${cy + 120}" r="${i * 30}" fill="none" stroke="${GOLD}" stroke-width=".6" opacity="${f(0.8 - i * 0.1)}"/>`;
    o += `<circle cx="${cx}" cy="${cy + 120}" r="16" fill="${TEAL}"/><path d="M${cx - 10},${cy + 112} q6,6 2,12 q8,-2 12,4" fill="none" stroke="${CREAM}" stroke-width="1.4" opacity=".8"/>`;
    return o + pilgrim(cx + 40, cy - 50, CREAM, 1.6);
  },
  net(cx, cy) {
    let o = '';
    for (let i = -3; i <= 3; i++) {
      o += `<path d="M${cx - 110},${cy + i * 26 - 60} L${cx + 110},${cy + i * 26 + 60}" stroke="${GOLD}" stroke-width=".6" opacity=".7"/><path d="M${cx - 110},${cy + i * 26 + 60} L${cx + 110},${cy + i * 26 - 60}" stroke="${GOLD}" stroke-width=".6" opacity=".7"/>`;
    }
    for (let i = -3; i <= 3; i++)
      for (let j = -3; j <= 3; j++) {
        if ((i + j) % 2) continue;
        const x = cx + (i + j) * 13 * 1.6;
        const y = cy + (i - j) * 13;
        if (Math.hypot(x - cx, y - cy) > 94) continue;
        o += `<circle cx="${f(x)}" cy="${f(y)}" r="4" fill="${CREAM}"/><circle cx="${f(x - 1.2)}" cy="${f(y - 1.2)}" r="1.1" fill="${GOLD}"/>`;
      }
    return o;
  },
  deep(cx, cy) {
    let o = '';
    for (let i = 1; i <= 7; i++)
      o += `<circle cx="${cx}" cy="${cy}" r="${i * 13}" fill="none" stroke="${MUTED}" stroke-width=".5" opacity="${f(0.5 - i * 0.06)}"/>`;
    return `${o}<circle cx="${cx + 18}" cy="${cy - 24}" r="1.8" fill="${CREAM}"/>`;
  },
};

const OVERLAY: Partial<Record<SkyArt, (cx: number, cy: number) => string>> = {
  sun: (cx, cy) =>
    `<path d="M${cx - 78},${cy + 62} Q${cx},${cy + 96} ${cx + 78},${cy + 62} L${cx + 92},${cy + 42} M${cx - 78},${cy + 62} L${cx - 92},${cy + 42}" fill="none" stroke="${GOLD}" stroke-width="1.6"/>`,
  moon: (cx, cy) =>
    `<path d="M${cx - 10},${cy - 98} A86,86 0 0 1 ${cx + 92},${cy - 14}" fill="none" stroke="${GOLD}" stroke-width="1.6"/><circle cx="${cx + 92}" cy="${cy - 14}" r="3" fill="${GOLD}"/>`,
  mercury: (cx, cy) =>
    `<g transform="translate(${cx - 70} ${cy - 66})" fill="none" stroke="${GOLD}" stroke-width="1.5"><path d="M0,-26 V40 M-10,-30 q10,8 20,0 M-8,-8 q8,10 16,0 q-8,10 -16,20 q8,10 16,0"/><circle cy="-30" r="4"/></g>`,
  venus: (cx, cy) =>
    `<g transform="translate(${cx + 78} ${cy - 70})" fill="none" stroke="${GOLD}" stroke-width="1.8"><circle r="14"/><path d="M0,14V40M-12,28H12"/></g>`,
  mars: (cx, cy) =>
    `<g transform="translate(${cx + 70} ${cy - 62})" fill="none" stroke="${GOLD}" stroke-width="1.8"><circle r="14"/><path d="M10,-10L30,-30M30,-30H14M30,-30V-14"/></g>`,
  jupiter: (cx, cy) =>
    `<path d="M${cx - 92},${cy - 100} l14,34 l-16,-6 l20,42 l-18,-10 l16,40" fill="none" stroke="${GOLD}" stroke-width="1.8" stroke-linejoin="round"/>`,
  saturn: (cx, cy) =>
    `<path d="M${cx + 60},${cy - 104} A52,52 0 0 1 ${cx + 112},${cy - 50} M${cx + 60},${cy - 104} A44,44 0 0 0 ${cx + 106},${cy - 54} M${cx + 60},${cy - 104} L${cx + 44},${cy - 70}" fill="none" stroke="${GOLD}" stroke-width="1.6"/>`,
  pleiades: (cx, cy) => {
    let o = '';
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 - 0.4;
      o += `<circle cx="${f(cx + Math.cos(a) * 86)}" cy="${f(cy + Math.sin(a) * 86)}" r="3" fill="none" stroke="${GOLD}" stroke-width="1.1"/>`;
    }
    return o;
  },
  orion: (cx, cy) =>
    `<path d="M${cx - 34},${cy - 62} L${cx + 28},${cy - 58} L${cx + 12},${cy + 10} L${cx + 28},${cy + 68} M${cx - 34},${cy - 62} L${cx - 12},${cy - 2} L${cx - 38},${cy + 66} M${cx - 34},${cy - 62} Q${cx - 70},${cy - 60} ${cx - 78},${cy - 10} M${cx + 28},${cy - 58} L${cx + 54},${cy - 104} L${cx + 70},${cy - 84} M${cx - 4},${cy - 86} m-6,0 a6,6 0 1 0 12,0 a6,6 0 1 0 -12,0" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`,
  dipper: (cx, cy) =>
    `<path d="M${cx - 100},${cy + 34} Q${cx - 60},${cy + 62} ${cx + 6},${cy + 34} Q${cx + 60},${cy + 20} ${cx + 70},${cy - 20} Q${cx + 30},${cy - 56} ${cx - 18},${cy - 40}" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`,
  milkyway: (cx, cy) =>
    `<path d="M${cx - 96},${cy + 84} Q${cx},${cy - 30} ${cx + 96},${cy + 84} M${cx - 70},${cy + 84} V${cy + 66} M${cx + 70},${cy + 84} V${cy + 66}" fill="none" stroke="${GOLD}" stroke-width="1.5"/>`,
};

export const header = (p: SkyPlate): string =>
  p.kind === 'heaven'
    ? `THE ${ORDINALS[p.n ?? 0]!.toUpperCase()} HEAVEN`
    : p.kind === 'stars'
      ? 'THE FIXED STARS'
      : 'BEYOND THE STARS';

const motto = (p: SkyPlate) =>
  p.kind === 'heaven'
    ? 'as above, so below'
    : p.kind === 'stars'
      ? 'the figures every people drew'
      : 'what you find when you look past the stars';

const fitSize = (text: string, maxWidth: number, base: number, charWidth: number) =>
  Math.min(base, maxWidth / (text.length * charWidth));

export function sphereFace(p: SkyPlate, st: SkyState | null): string {
  const id = uid('sp');
  let o = svgOpen(`${p.name}, ${p.alt}`);
  o += `<defs><clipPath id="${id}"><circle cx="140" cy="176" r="100"/></clipPath><radialGradient id="${id}g" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="${SHADE}"/><stop offset="1" stop-color="${LAPIS}"/></radialGradient></defs>`;
  o += `<rect width="280" height="480" rx="12" fill="url(#${id}g)"/><rect x="12" y="12" width="256" height="456" rx="6" fill="none" stroke="${GOLD}" stroke-width="1.2"/><rect x="17" y="17" width="246" height="446" rx="4" fill="none" stroke="${GOLD}" stroke-width=".5" opacity=".7"/>`;
  for (const [x, y] of [
    [24, 24],
    [256, 24],
    [24, 456],
    [256, 456],
  ])
    o += sparkle(x!, y!, 7, GOLD);
  o += `<text x="140" y="44" text-anchor="middle" font-family="${SMALLCAPS}" font-size="10.5" letter-spacing="3" fill="${GOLD}">${header(p)}</text>`;
  o += `<circle cx="140" cy="176" r="100" fill="${LAPIS}"/>`;
  const rings = p.kind === 'heaven' ? 7 : 8;
  for (let i = 1; i <= rings; i++) {
    const R = (100 * i) / (rings + 0.6);
    const on = p.kind === 'heaven' && i === p.n;
    o += `<circle cx="140" cy="176" r="${f(R)}" fill="none" stroke="${GOLD}" stroke-width="${on ? 1.2 : 0.5}" opacity="${on ? 0.95 : p.kind === 'beyond' ? 0.14 + i * 0.02 : 0.3}"/>`;
  }
  o += `<g clip-path="url(#${id})">${ART[p.art](140, 176, st)}</g>`;
  const overlay = OVERLAY[p.art];
  if (overlay) o += `<g clip-path="url(#${id})">${overlay(140, 176)}</g>`;
  o += pilgrim(140, 274, GOLD, 1.1);
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r1 = i % 6 ? 102 : 100;
    const r2 = i % 6 ? 106 : 110;
    ticks += `M${f(140 + Math.cos(a) * r1)},${f(176 + Math.sin(a) * r1)}L${f(140 + Math.cos(a) * r2)},${f(176 + Math.sin(a) * r2)}`;
  }
  o += `<circle cx="140" cy="176" r="100" fill="none" stroke="${GOLD}" stroke-width="1.2"/><circle cx="140" cy="176" r="106" fill="none" stroke="${GOLD}" stroke-width=".5"/><path d="${ticks}" stroke="${GOLD}" stroke-width=".7"/>`;
  o += `<text x="140" y="322" text-anchor="middle" font-family="${SMALLCAPS}" font-weight="600" font-size="${f(fitSize(p.name, 230, 25, 0.58))}" fill="${CREAM}">${esc(p.name)}</text>`;
  o += `<text x="140" y="344" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${f(fitSize(p.alt, 220, 13, 0.5))}" fill="${GOLD}" opacity=".85">${esc(p.alt)}</text>`;
  o += `<path d="M70,364 H128 M152,364 H210" stroke="${GOLD}" stroke-width=".6"/>${sparkle(140, 364, 5, GOLD)}`;
  [`set down · ${p.set}`, `receive · ${p.receive}`].forEach((t, j) => {
    o += `<text x="140" y="${388 + j * 17}" text-anchor="middle" font-family="${SERIF}" font-size="${f(fitSize(t, 232, 11.5, 0.46))}" fill="${CREAM}" opacity=".9">${esc(t)}</text>`;
  });
  o += `<text x="140" y="446" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="10.5" fill="${MUTED}">${motto(p)}</text>`;
  return `${o}</svg>`;
}

export function sphereBack(): string {
  let o = `${svgOpen()}<rect width="280" height="480" rx="12" fill="${LAPIS}"/><rect x="12" y="12" width="256" height="456" rx="6" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`;
  for (let i = 1; i <= 7; i++)
    o += `<circle cx="140" cy="236" r="${16 + i * 14}" fill="none" stroke="${GOLD}" stroke-width="${i === 7 ? 1.2 : 0.5}" opacity=".8"/>`;
  o += dust(140, 236, 5, 70);
  o += `<path d="M46,330 Q60,236 46,142" fill="none" stroke="${LAPIS}" stroke-width="10"/>`;
  o += `<path d="M52,330 q-4,-14 6,-16 q10,-2 10,8 l4,8 M62,314 q10,-6 16,-20 q4,-10 -2,-22" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round"/><circle cx="82" cy="266" r="4.5" fill="${GOLD}"/><path d="M80,270 q8,8 18,0" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`;
  o += `<path d="M30,330 H250" stroke="${GOLD}" stroke-width=".7"/>`;
  o += `<text x="140" y="420" text-anchor="middle" font-family="${SMALLCAPS}" font-size="12" letter-spacing="5" fill="${GOLD}">THE SPHERES</text><text x="140" y="440" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="11" fill="${MUTED}">as above · so below</text>`;
  return `${o}</svg>`;
}

function arcPath(list: Array<{ alt: number; az: number }>, minAlt: number): string {
  const segments: Array<Array<[number, number]>> = [];
  let segment: Array<[number, number]> = [];
  for (const aa of list) {
    if (aa.alt > minAlt) segment.push(project(aa));
    else if (segment.length) {
      segments.push(segment);
      segment = [];
    }
  }
  if (segment.length) segments.push(segment);
  return segments
    .filter((s) => s.length > 1)
    .map((s) => `M${s.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}`)
    .join(' ');
}

export function domeSvg(st: SkyState, names: Record<string, string>, halo: [number, number]): string {
  const { cx, cy, r: R, width, height } = DOME;
  let o = `<svg viewBox="0 0 ${width} ${height}" class="dome-svg" role="img" aria-label="The heavens over California now, drawn as an atlas. Tap to lift your eyes.">`;
  const ink = st.day ? DAY_INK : GOLD;
  const label = st.day ? DAY_INK : CREAM;
  for (let i = 1; i < 3; i++)
    o += `<circle cx="${cx}" cy="${cy}" r="${(R * i) / 3}" fill="none" stroke="${ink}" stroke-width=".5" opacity=".25"/>`;
  o += `<path d="${arcPath(st.ecliptic, -2)}" fill="none" stroke="${ink}" stroke-width=".9" stroke-dasharray="2 5" opacity=".55"/>`;
  if (!st.day) {
    const mw = arcPath(st.milkyWay, -2);
    o += `<path d="${mw}" fill="none" stroke="${CREAM}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" opacity=".05"/><path d="${mw}" fill="none" stroke="${CREAM}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".06"/>`;
    for (const s of st.stars)
      o += `<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.size)}" fill="${CREAM}" opacity="${f(s.opacity)}"/>`;
    for (const id of Object.keys(FIGURES) as FigureId[]) {
      const figure = FIGURES[id];
      const pts = st.figures[id];
      if (!pts || !pts.some((p) => p.alt > 0)) continue;
      const projected = pts.map(project);
      for (const [a, b] of figure.lines) {
        if (pts[a]!.alt > -1 && pts[b]!.alt > -1)
          o += `<path d="M${f(projected[a]![0])},${f(projected[a]![1])}L${f(projected[b]![0])},${f(projected[b]![1])}" stroke="${GOLD}" stroke-width=".7" opacity=".7"/>`;
      }
      pts.forEach((p, j) => {
        if (p.alt > 0)
          o += `<circle cx="${f(projected[j]![0])}" cy="${f(projected[j]![1])}" r="${id === 'pleiades' ? 1.3 : 2.4}" fill="${CREAM}"/>`;
      });
    }
  }
  o += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${ink}" stroke-width="1" opacity=".7"/>`;
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r1 = i % 6 ? R : R - 6;
    const r2 = i % 6 ? R + 4 : R + 8;
    ticks += `M${f(cx + Math.cos(a) * r1)},${f(cy + Math.sin(a) * r1)}L${f(cx + Math.cos(a) * r2)},${f(cy + Math.sin(a) * r2)}`;
  }
  o += `<path d="${ticks}" stroke="${ink}" stroke-width=".6" opacity=".6"/>`;
  for (const [letter, deg] of [
    ['N', 0],
    ['E', 90],
    ['S', 180],
    ['W', 270],
  ] as Array<[string, number]>) {
    const a = (deg * Math.PI) / 180;
    o += `<text x="${f(cx - (R + 16) * Math.sin(a))}" y="${f(cy - (R + 16) * Math.cos(a) + 4)}" text-anchor="middle" font-family="${SMALLCAPS}" font-weight="600" font-size="12" letter-spacing="2" fill="${ink}">${letter}</text>`;
  }
  st.beacons.forEach((b, j) => {
    const name = (names[b.id] ?? b.id).toUpperCase();
    if (b.id === 'sun')
      o += `<circle cx="${f(b.x)}" cy="${f(b.y)}" r="16" fill="${VERM}" opacity=".2"/><circle cx="${f(b.x)}" cy="${f(b.y)}" r="8" fill="${VERM}"/>`;
    else if (b.id === 'moon')
      o += `<g transform="translate(${f(b.x)} ${f(b.y)})">${moonDisc(0, 0, 6, st.moon, CREAM, st.day ? DAY_SKY : SHADE)}<circle r="6" fill="none" stroke="${ink}" stroke-width=".6"/></g>`;
    else if ((HEAVENS as string[]).includes(b.id))
      o += `<g class="beacon" style="animation-delay:${j * 0.4}s"><circle cx="${f(b.x)}" cy="${f(b.y)}" r="11" fill="${GOLD}" opacity=".14"/><circle cx="${f(b.x)}" cy="${f(b.y)}" r="4.2" fill="${GOLD}"/></g>`;
    o += `<text x="${f(b.x + 12)}" y="${f(b.y + (b.id === 'milkyway' ? 14 : 4))}" font-family="${SMALLCAPS}" font-weight="600" font-size="10" letter-spacing="1.5" fill="${label}" opacity=".8">${esc(name)}</text>`;
  });
  o += `<g data-halo transform="translate(${f(halo[0])} ${f(halo[1])})" fill="none" stroke="${GOLD}"><circle r="26" stroke-width="1.2"/><circle r="30" stroke-width=".5" opacity=".6"/></g></svg>`;
  return o;
}
