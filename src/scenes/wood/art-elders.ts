import type { WOOD_ART_ELDERS } from '../../lib/decks';
import { f, rng } from '../../lib/svg';
import {
  birch,
  fireflies,
  figure,
  G,
  GP,
  INK,
  INK_DEEP,
  leafAt,
  mapleLeaf,
  mist,
  MOON,
  spireRow,
  sprig,
} from './forest';

const ground = (y = 372) => `<path d="M30,${y} H250" stroke="${G}" stroke-width="1"/>`;

function pineTier(cx: number, y: number, w: number, side: number): string {
  let o = `<path d="M${cx},${y} Q${f(cx + side * w * 0.5)},${f(y - 6)} ${f(cx + side * w)},${f(y + 4)}" fill="none" stroke="${G}" stroke-width="1.1"/>`;
  for (let i = 0; i < 5; i++) {
    const x = cx + side * w * (0.35 + i * 0.15);
    o += sprig(x, y + 2 + i * 0.6, side > 0 ? -70 : -110, 12 + i, 0.85);
  }
  return o;
}

export const ELDER_ART: Record<(typeof WOOD_ART_ELDERS)[number], () => string> = {
  whitePine() {
    const r = rng(101);
    let o = '';
    o += `<path d="M140,352 C110,358 70,350 32,362 M140,352 C170,358 210,350 248,362 M140,352 C138,366 128,374 120,392 M140,352 C142,366 152,374 160,392" fill="none" stroke="${GP}" stroke-width="2" opacity=".9"/>`;
    o += `<path d="M134,352 L137,96 M146,352 L143,96" fill="none" stroke="${G}" stroke-width="1.4"/>`;
    [
      [300, 74, -1],
      [300, 82, 1],
      [252, 66, -1],
      [244, 70, 1],
      [196, 58, -1],
      [190, 54, 1],
      [146, 44, -1],
      [150, 40, 1],
    ].forEach(([y, w, s]) => {
      o += pineTier(140, y!, w!, s!);
    });
    o += `<path d="M126,90 Q140,80 154,90 M140,84 L140,96" fill="none" stroke="${GP}" stroke-width="1.4"/>`;
    o += `<path d="M118,82 Q130,70 140,80 Q150,70 162,82" fill="none" stroke="${GP}" stroke-width="1.6"/><circle cx="140" cy="76" r="3.4" fill="${GP}"/>`;
    o += fireflies(r, 6, 50, 230, 120, 300);
    return o + ground(352);
  },
  sugarMaple() {
    const r = rng(103);
    let o = `<path d="M128,372 C132,320 126,270 134,228 M152,372 C148,320 154,270 146,228" fill="none" stroke="${G}" stroke-width="1.6"/>`;
    o += `<path d="M134,232 C110,200 84,190 62,160 M146,232 C170,200 196,190 218,160 M140,226 C140,190 136,160 140,120 M110,206 C96,180 92,160 80,140 M170,206 C184,180 188,160 200,140" fill="none" stroke="${G}" stroke-width="1.1" stroke-linecap="round"/>`;
    for (let i = 0; i < 26; i++) o += mapleLeaf(60 + r() * 160, 92 + r() * 110, -30 + r() * 60, 0.8 + r() * 0.5);
    o += `<path d="M152,300 l12,0" stroke="${GP}" stroke-width="1.6"/><path d="M164,300 q2,6 0,10" fill="none" stroke="${GP}" stroke-width="1"/>`;
    o += `<circle cx="164" cy="318" r="2" fill="${GP}"/><circle cx="164" cy="328" r="1.6" fill="${GP}" opacity=".7"/>`;
    o += `<path d="M150,336 L178,336 L174,368 L154,368 Z" fill="${INK}" stroke="${G}" stroke-width="1.1"/><path d="M150,336 Q164,326 178,336" fill="none" stroke="${G}" stroke-width=".7"/>`;
    o += `<path d="M38,372 Q90,366 140,372 T244,370" fill="none" stroke="${MOON}" stroke-width="1.4" opacity=".8"/>`;
    for (let i = 0; i < 14; i++)
      o += `<circle cx="${f(36 + r() * 208)}" cy="${f(376 + r() * 6)}" r="1.4" fill="${MOON}" opacity=".6"/>`;
    return o;
  },
  paperBirch() {
    const r = rng(107);
    let o = '';
    for (let i = 0; i < 26; i++) {
      const x = 40 + r() * 200;
      o += `<path d="M${f(x)},372 l${f((r() - 0.5) * 10)},-${f(6 + r() * 14)}" stroke="${G}" stroke-width=".8" opacity=".45"/>`;
    }
    o += `<path d="M36,372 Q70,362 100,370 Q140,360 180,370 Q214,362 246,372" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += mist(140, 360, 120, 8, 0.12);
    o +=
      birch(96, 150, 368, 12) +
      birch(140, 112, 368, 16) +
      birch(184, 168, 368, 11) +
      birch(72, 220, 368, 8) +
      birch(212, 210, 368, 8);
    for (let i = 0; i < 18; i++) o += leafAt(60 + r() * 160, 90 + r() * 100, r() * 360, 10, 4, 0.22);
    o += `<path d="M150,250 q10,4 14,16 q-8,-2 -14,-6" fill="none" stroke="${MOON}" stroke-width=".9"/>`;
    o += `<g opacity=".7">${spireRow(r, 372, 5, 18, 34, 0.9, INK_DEEP, 120, 230)}</g>`;
    return o + fireflies(r, 8, 50, 230, 60, 200);
  },
  redwood() {
    const r = rng(109);
    let o = mist(140, 220, 130, 26, 0.1) + mist(140, 160, 110, 18, 0.08);
    o += `<ellipse cx="140" cy="352" rx="40" ry="11" fill="${GP}" fill-opacity=".08" stroke="${GP}" stroke-width="1.4" stroke-dasharray="4 3"/>`;
    const trunks = [
      [56, 352, 12],
      [92, 360, 14],
      [188, 360, 14],
      [224, 352, 12],
      [118, 366, 9],
      [162, 366, 9],
    ];
    for (const [x, base, w] of trunks) {
      o += `<path d="M${x! - w! / 2},${base} L${x! - w! / 4},40 L${x! + w! / 4},40 L${x! + w! / 2},${base} Z" fill="${INK}" stroke="${G}" stroke-width="1"/>`;
      o += `<path d="M${x! - w! / 6},${base! - 10} l1,-120 M${x! + w! / 6},${base! - 30} l-1,-140" stroke="${G}" stroke-width=".4" opacity=".6"/>`;
      for (let k = 0; k < 2; k++) o += sprig(x!, 70 + k * 46 + r() * 10, k % 2 ? 200 : -20, 16, 0.75);
    }
    o += mist(140, 300, 120, 14, 0.12) + mist(140, 120, 120, 10, 0.08);
    o += `<circle cx="140" cy="352" r="2.5" fill="${GP}"/>`;
    return o + `<path d="M30,368 Q140,378 250,368" fill="none" stroke="${G}" stroke-width="1"/>`;
  },
  oak() {
    const r = rng(113);
    let crown = 'M44,196';
    for (let i = 1; i <= 12; i++) {
      const a = Math.PI + (i / 12) * Math.PI;
      crown += ` Q${f(140 + Math.cos(a - 0.13) * 118)},${f(184 + Math.sin(a - 0.13) * 104)} ${f(140 + Math.cos(a) * 98)},${f(184 + Math.sin(a) * 88)}`;
    }
    crown += ' Q220,224 190,214 Q160,232 140,218 Q114,232 90,214 Q60,226 44,196 Z';
    let o = `<path d="${crown}" fill="${G}" fill-opacity=".07" stroke="${G}" stroke-width="1.1"/>`;
    o += `<path d="M118,372 C124,320 112,280 124,236 M162,372 C156,320 168,280 156,236" fill="none" stroke="${G}" stroke-width="1.8"/>`;
    o += `<path d="M124,238 C100,220 80,214 60,196 M156,238 C180,220 200,214 220,196 M134,228 C126,200 112,180 96,150 M146,228 C156,196 172,176 186,148 M140,222 L140,120" fill="none" stroke="${G}" stroke-width="1.2" stroke-linecap="round"/>`;
    for (let i = 0; i < 16; i++) o += leafAt(60 + r() * 160, 110 + r() * 100, r() * 360, 11, 5, 0.18);
    for (const [x, y] of [
      [100, 170],
      [172, 160],
      [140, 140],
    ]) {
      o += `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${MOON}" stroke-width=".8"/>`;
      for (let k = 0; k < 6; k++)
        o += `<circle cx="${f(x! + Math.cos(k) * 6)}" cy="${f(y! + Math.sin(k) * 6)}" r="1.6" fill="${MOON}"/>`;
    }
    o += `<path d="M210,40 L196,82 L208,84 L188,132" fill="none" stroke="${GP}" stroke-width="1.6" stroke-linejoin="round"/>`;
    o += `<path d="M48,372 Q140,364 232,372" fill="none" stroke="${G}" stroke-width="1"/>`;
    return o + fireflies(r, 6, 50, 230, 250, 340);
  },
  bodhi() {
    const r = rng(127);
    let o = `<path d="M104,330 C112,280 100,240 116,200 M176,330 C168,280 180,240 164,200" fill="none" stroke="${G}" stroke-width="1.6"/>`;
    o += `<path d="M116,202 C96,180 74,170 54,150 M164,202 C184,180 206,170 226,150 M128,196 C122,170 114,150 104,120 M152,196 C160,170 168,150 178,120" fill="none" stroke="${G}" stroke-width="1.1"/>`;
    const heart = (x: number, y: number, a: number, s: number) =>
      `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(s)})"><path d="M0,0 C-8,-6 -10,-16 -4,-20 C-1,-22 0,-19 0,-17 C0,-19 1,-22 4,-20 C10,-16 8,-6 0,0 L0,9" fill="${G}" fill-opacity=".14" stroke="${G}" stroke-width=".9"/></g>`;
    for (let i = 0; i < 30; i++) o += heart(56 + r() * 168, 82 + r() * 110, 160 + r() * 40, 0.8 + r() * 0.4);
    o += `<circle cx="140" cy="268" r="46" fill="${GP}" opacity=".06"/><circle cx="140" cy="268" r="30" fill="none" stroke="${GP}" stroke-width=".7" opacity=".6"/>`;
    o += `<circle cx="140" cy="262" r="7" fill="${GP}"/><path d="M128,272 Q140,266 152,272 L156,296 Q140,292 124,296 Z" fill="${GP}"/>`;
    o += `<path d="M112,304 Q140,288 168,304 Q140,312 112,304 Z" fill="${GP}" opacity=".95"/>`;
    o += `<path d="M90,330 H190" stroke="${G}" stroke-width="1"/><path d="M100,330 Q140,322 180,330" fill="none" stroke="${G}" stroke-width=".7"/>`;
    return o + ground() + fireflies(r, 8, 50, 230, 210, 360);
  },
  ceiba() {
    const r = rng(131);
    let o = `<path d="M30,300 H250" stroke="${G}" stroke-width="1.2"/>`;
    o += `<path d="M132,300 C134,240 134,200 136,150 M148,300 C146,240 146,200 144,150" fill="none" stroke="${G}" stroke-width="1.6"/>`;
    o += `<path d="M132,300 C120,290 104,296 92,300 M148,300 C160,290 176,296 188,300 M134,286 C124,286 116,294 110,300 M146,286 C156,286 164,294 170,300" fill="none" stroke="${G}" stroke-width="1.2"/>`;
    for (let i = 0; i < 9; i++)
      o += `<path d="M${f(136 + (r() - 0.5) * 8)},${f(170 + i * 13)} l-3,-3 M${f(144 + (r() - 0.5) * 8)},${f(176 + i * 13)} l3,-3" stroke="${G}" stroke-width=".8"/>`;
    o += `<path d="M136,154 C110,140 80,132 40,128 M144,154 C170,140 200,132 240,128 M138,150 C124,120 112,104 90,88 M142,150 C156,120 168,104 190,88 M140,148 L140,70" fill="none" stroke="${G}" stroke-width="1.2" stroke-linecap="round"/>`;
    o += `<path d="M40,70 Q140,40 240,70" fill="none" stroke="${MOON}" stroke-width="1" stroke-dasharray="2 3" opacity=".8"/>`;
    for (let i = 0; i < 30; i++)
      o += `<circle cx="${f(44 + r() * 192)}" cy="${f(44 + r() * 40)}" r="${f(0.6 + r())}" fill="${GP}" opacity="${f(0.5 + r() * 0.5)}"/>`;
    let roots = '';
    const net = (x: number, y: number, a: number, d: number) => {
      if (d === 0) return;
      const x2 = x + Math.sin(a) * 18;
      const y2 = y + Math.cos(a) * 14;
      roots += `M${f(x)},${f(y)} L${f(x2)},${f(y2)}`;
      net(x2, y2, a - 0.5 + r() * 0.2, d - 1);
      net(x2, y2, a + 0.5 - r() * 0.2, d - 1);
    };
    net(136, 300, -0.5, 4);
    net(144, 300, 0.5, 4);
    o += `<path d="${roots}" stroke="${MOON}" stroke-width=".7" opacity=".7"/>`;
    return o + `<circle cx="140" cy="372" r="3" fill="${GP}" opacity=".6"/>`;
  },
  carob() {
    const r = rng(137);
    let o = `<path d="M30,330 A110,110 0 0 1 250,330" fill="none" stroke="${MOON}" stroke-width=".8" stroke-dasharray="1 5" opacity=".8"/>`;
    for (let i = 0; i < 7; i++) {
      const a = Math.PI + (i / 6) * Math.PI;
      o += `<circle cx="${f(140 + Math.cos(a) * 110)}" cy="${f(330 + Math.sin(a) * 110)}" r="3" fill="${GP}" opacity="${f(0.3 + i * 0.11)}"/>`;
    }
    o += `<path d="M170,352 C174,310 166,280 176,240 M190,352 C186,310 196,280 184,240" fill="none" stroke="${G}" stroke-width="1.6"/>`;
    o += `<path d="M178,246 C156,226 132,222 116,200 M182,246 C204,226 222,220 238,198 M180,242 L180,170 M178,226 C164,206 160,190 150,172 M182,226 C196,206 204,190 214,172" fill="none" stroke="${G}" stroke-width="1.1" stroke-linecap="round"/>`;
    for (let i = 0; i < 26; i++) o += leafAt(116 + r() * 120, 160 + r() * 80, r() * 360, 12, 6, 0.2);
    for (const [x, y] of [
      [132, 226],
      [222, 222],
      [196, 206],
      [160, 210],
      [206, 238],
    ])
      o += `<path d="M${x},${y} q3,18 -3,30" fill="none" stroke="${GP}" stroke-width="3" stroke-linecap="round"/>`;
    o += `<path d="M42,352 Q80,330 120,338 Q134,344 142,352 Z" fill="${GP}"/><circle cx="46" cy="336" r="8.5" fill="${GP}"/>`;
    o += `<path d="M38,322 Q50,306 66,316" fill="none" stroke="${GP}" stroke-width="1.2"/>`;
    for (let k = 1; k <= 3; k++)
      o += `<text x="${56 + k * 14}" y="${318 - k * 14}" font-family="Georgia,serif" font-style="italic" font-size="${10 + k * 3}" fill="${GP}" opacity="${f(0.95 - k * 0.2)}">z</text>`;
    o += figure(226, 352, 1.5, GP) + `<path d="M232,328 l10,-6 l2,10" fill="none" stroke="${GP}" stroke-width="1"/>`;
    return o + `<path d="M30,352 H250" stroke="${G}" stroke-width="1"/>` + fireflies(r, 5, 60, 220, 80, 150);
  },
};
