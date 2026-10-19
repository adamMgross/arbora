import type { WOOD_ART_PASSAGES } from '../../lib/decks';
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
  spire,
  spireRow,
  sprig,
} from './forest';

const ground = (y = 372) => `<path d="M30,${y} H250" stroke="${G}" stroke-width="1"/>`;

const trunk = (x: number, y0: number, y1: number, w: number) =>
  `<path d="M${f(x - w / 2)},${y1} L${f(x - w / 2 + 2)},${y0} L${f(x + w / 2 - 2)},${y0} L${f(x + w / 2)},${y1}Z" fill="${INK}" stroke="${G}" stroke-width="1.2"/>`;

function branches(x: number, y: number, depth: number, ang: number, len: number, r: () => number, w = 1.2): string {
  if (depth <= 0) return '';
  const x2 = x + Math.sin(ang) * len;
  const y2 = y - Math.cos(ang) * len;
  let o = `<path d="M${f(x)},${f(y)} L${f(x2)},${f(y2)}" stroke="${G}" stroke-width="${f(w)}" stroke-linecap="round"/>`;
  o += branches(x2, y2, depth - 1, ang - 0.38 - r() * 0.2, len * 0.72, r, w * 0.75);
  o += branches(x2, y2, depth - 1, ang + 0.38 + r() * 0.2, len * 0.72, r, w * 0.75);
  return o;
}

const crown = (cx: number, cy: number, rx: number, ry: number, op = 0.1) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${G}" fill-opacity="${op}" stroke="${G}" stroke-width="1.1"/>`;

const fruitAt = (x: number, y: number, r = 4.5) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${GP}" opacity=".85"/><path d="M${f(x)},${f(y - r)} q1,-3 3,-4" fill="none" stroke="${G}" stroke-width=".7"/>`;

const bird = (x: number, y: number, s = 1) =>
  `<path d="M${f(x - 8 * s)},${f(y)} q${f(4 * s)},${f(-5 * s)} ${f(8 * s)},0 q${f(4 * s)},${f(-5 * s)} ${f(8 * s)},0" fill="none" stroke="${GP}" stroke-width="1.1"/>`;

const sleeper = (x: number, y: number) =>
  `<circle cx="${x}" cy="${y - 5}" r="4" fill="${GP}"/><path d="M${x + 4},${y - 8} Q${x + 22},${y - 12} ${x + 34},${y - 6} L${x + 36},${y} L${x + 4},${y}Z" fill="${GP}"/>`;

export const PASSAGE_ART: Record<(typeof WOOD_ART_PASSAGES)[number], () => string> = {
  clearing() {
    const r = rng(101);
    let o =
      spireRow(r, 372, 4, 150, 230, 0.95, INK_DEEP, 26, 100) + spireRow(r, 372, 4, 150, 230, 0.95, INK_DEEP, 180, 258);
    o += `<path d="M110,40 L170,40 L206,372 L76,372Z" fill="${GP}" opacity=".09"/><path d="M122,40 L158,40 L184,372 L98,372Z" fill="${GP}" opacity=".08"/>`;
    o += `<path d="M66,356 L214,330 L218,338 L70,366Z" fill="${INK}" stroke="${G}" stroke-width="1.1"/><ellipse cx="216" cy="334" rx="4" ry="5" fill="none" stroke="${G}" stroke-width=".8"/>`;
    o += `<path d="M60,360 l-10,-8 M60,362 l-14,2 M64,366 l-6,8" stroke="${G}" stroke-width=".8"/>`;
    for (let i = 0; i < 9; i++) o += sprig(96 + i * 11, 370, -90 + (r() - 0.5) * 30, 10 + r() * 10, 0.85);
    return o + figure(140, 316, 1.5, GP) + ground() + fireflies(r, 10, 100, 180, 120, 300);
  },
  rings() {
    const r = rng(103);
    let o = spireRow(r, 230, 9, 50, 110, 0.6, INK_DEEP);
    o += `<path d="M44,300 L56,248 L224,248 L236,300Z" fill="${INK}" stroke="${G}" stroke-width="1.2"/>`;
    o += `<ellipse cx="140" cy="248" rx="84" ry="26" fill="${INK}" stroke="${G}" stroke-width="1.3"/>`;
    for (let k = 1; k <= 13; k++) {
      const s = 1 - k / 14;
      const wob = 1 + (k % 4 === 0 ? 0.04 : 0);
      o += `<ellipse cx="${f(136 + k * 0.4)}" cy="${f(248 - k * 0.15)}" rx="${f(80 * s * wob)}" ry="${f(24 * s)}" fill="none" stroke="${k === 5 || k === 9 ? GP : G}" stroke-width="${k === 5 ? 1.6 : 0.6}" opacity="${k === 9 ? 0.9 : 0.75}"/>`;
    }
    o += `<path d="M168,236 q10,8 4,18" fill="none" stroke="${MOON}" stroke-width="1.6" opacity=".7"/>`;
    o += `<path d="M44,300 Q20,316 34,340 M236,300 Q260,316 246,336 M100,300 q-10,30 -40,46 M180,300 q10,30 40,46" fill="none" stroke="${G}" stroke-width="1.1"/>`;
    return o + figure(228, 372, 1.3, GP) + ground();
  },
  seed() {
    const r = rng(107);
    let o = `<path d="M140,250 C130,200 132,160 140,120 M140,250 C150,200 148,160 140,120" fill="none" stroke="${G}" stroke-width="1" opacity=".35"/>`;
    o += `<ellipse cx="140" cy="110" rx="104" ry="56" fill="${G}" fill-opacity=".05" stroke="${G}" stroke-width=".8" stroke-dasharray="3 4" opacity=".6"/>`;
    for (let i = 0; i < 9; i++)
      o += `<path d="M${60 + i * 20},${f(130 + r() * 20)} V250" stroke="${G}" stroke-width=".6" opacity=".3"/>`;
    for (const [dx, rot] of [
      [-34, -14],
      [34, 14],
    ]) {
      o += `<g transform="translate(${140 + dx!} 300) rotate(${rot})"><path d="M0,-44 C-6,-38 -30,-10 -30,10 C-30,30 -16,40 0,40 C16,40 30,30 30,10 C30,-10 6,-38 0,-44Z" fill="${INK}" stroke="${G}" stroke-width="1.3"/><path d="M0,-38 C-4,-30 -22,-8 -22,10 C-22,26 -12,32 0,32 C12,32 22,26 22,10 C22,-8 4,-30 0,-38Z" fill="${GP}" fill-opacity=".1" stroke="${G}" stroke-width=".6"/><path d="M0,-44 v-8" stroke="${G}" stroke-width="1.2"/>`;
      for (let i = 0; i < 18; i++) {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * 16;
        o += `<circle cx="${f(Math.cos(a) * d)}" cy="${f(12 + Math.sin(a) * d)}" r="1.2" fill="${GP}" opacity=".85"/>`;
      }
      o += '</g>';
    }
    o += `<circle cx="140" cy="226" r="22" fill="${GP}" opacity=".06"/><circle cx="140" cy="226" r="9" fill="${GP}" opacity=".14"/><circle cx="140" cy="226" r="2.2" fill="${GP}"/>`;
    return o + figure(140, 372, 1.3, GP) + ground();
  },
  fire() {
    const r = rng(109);
    let o = '';
    for (let i = 0; i < 6; i++) {
      const x = 46 + i * 38;
      o += spire(x, 330, 180 + r() * 60, 52, INK_DEEP, G, 0.95);
    }
    let flames = '';
    for (let i = 0; i < 14; i++) {
      const x = 40 + i * 15 + r() * 6;
      const h = 22 + r() * 34;
      flames += `M${f(x - 7)},372 Q${f(x - 4)},${f(372 - h * 0.5)} ${f(x)},${f(372 - h)} Q${f(x + 4)},${f(372 - h * 0.5)} ${f(x + 7)},372Z`;
    }
    o += `<path d="${flames}" fill="${GP}" fill-opacity=".22" stroke="${GP}" stroke-width=".9"/>`;
    o += `<path d="M30,330 Q140,300 250,330" fill="none" stroke="${MOON}" stroke-width="10" opacity=".06"/>`;
    for (const [x, y] of [
      [92, 352],
      [176, 356],
    ]) {
      o += `<ellipse cx="${x}" cy="${y}" rx="7" ry="11" fill="${INK}" stroke="${G}" stroke-width="1"/>`;
      for (let k = -2; k <= 2; k++)
        o += `<path d="M${x},${y! + k * 4} l${f(-8 - Math.abs(k))},${f(-2 + k)} M${x},${y! + k * 4} l${f(8 + Math.abs(k))},${f(-2 + k)}" stroke="${G}" stroke-width=".7"/>`;
    }
    for (let i = 0; i < 18; i++)
      o += `<circle cx="${f(40 + r() * 200)}" cy="${f(130 + r() * 200)}" r="${f(0.8 + r())}" fill="${GP}" opacity="${f(0.4 + r() * 0.5)}"/>`;
    return o + ground();
  },
  shelter() {
    const r = rng(113);
    let o = spire(140, 372, 300, 190, INK, G, 1);
    let rain = '';
    for (let i = 0; i < 70; i++) {
      const x = 30 + r() * 220;
      const y = 40 + r() * 320;
      if (Math.abs(x - 140) < (y - 72) * 0.32 && y > 72) continue;
      rain += `M${f(x)},${f(y)} l-3,10`;
    }
    o += `<path d="${rain}" stroke="${MOON}" stroke-width=".8" opacity=".55"/>`;
    o += `<path d="M132,372 L134,300 L146,300 L148,372Z" fill="${INK_DEEP}" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M86,372 Q140,362 194,372" fill="${GP}" opacity=".08"/>`;
    o += figure(118, 372, 1.5, GP) + figure(164, 372, 1.1, GP);
    return o + `<path d="M30,372 H96 M184,372 H250" stroke="${G}" stroke-width="1"/>`;
  },
  oldPaths() {
    const r = rng(127);
    let o = spireRow(r, 250, 10, 60, 120, 0.7, INK_DEEP);
    o += `<path d="M102,372 Q120,320 136,262 L144,262 Q160,320 178,372Z" fill="${GP}" opacity=".1"/>`;
    o += `<path d="M138,262 Q100,230 54,214 M142,262 Q178,232 226,220 M140,262 L140,236" fill="none" stroke="${GP}" stroke-width="1.6" opacity=".55" stroke-dasharray="1 4" stroke-linecap="round"/>`;
    o += `<path d="M102,372 Q120,320 136,262 M178,372 Q160,320 144,262" fill="none" stroke="${G}" stroke-width=".9"/>`;
    for (let i = 0; i < 14; i++) {
      const t = i / 14;
      o += `<ellipse cx="${f(140 + (r() - 0.5) * 30 * (1 - t))}" cy="${f(368 - t * 100)}" rx="${f(3 - t * 2)}" ry="${f(1.6 - t)}" fill="${G}" opacity=".7"/>`;
    }
    o += `<path d="M138,262 v-30 M128,240 h22 l-4,-4 M150,240 l-4,4" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M210,226 q8,-4 16,0" fill="none" stroke="${MOON}" stroke-width="2" opacity=".6"/>`;
    return o + figure(132, 340, 1.4, GP) + ground();
  },
  pruning() {
    const r = rng(131);
    let o = `<path d="M140,372 C134,320 146,260 138,200 C134,170 142,140 140,110" fill="none" stroke="${G}" stroke-width="2.2"/>`;
    o += `<path d="M139,220 C160,200 184,196 204,172 M138,180 C118,160 98,154 80,128 M140,140 C156,124 168,108 176,88" fill="none" stroke="${G}" stroke-width="1.3"/>`;
    for (const [x, y, a] of [
      [204, 172, -40],
      [80, 128, 220],
      [176, 88, -60],
    ])
      for (let i = 0; i < 4; i++) o += leafAt(x! - 4 + i * 3, y! + i * 2, a! + i * 22, 16, 5, 0.22);
    o += `<path d="M137,262 L112,250" stroke="${G}" stroke-width="1.4"/><ellipse cx="111" cy="250" rx="2.5" ry="3.5" fill="${GP}" opacity=".85"/>`;
    o += `<path d="M90,330 Q86,300 100,288 L106,294 Q96,304 98,330Z" fill="none" stroke="${G}" stroke-width="1" opacity=".8"/>`;
    o += `<path d="M76,372 Q72,350 88,340 Q96,352 92,372" fill="none" stroke="${G}" stroke-width=".9" opacity=".7"/>`;
    o += `<path d="M98,318 L120,300 M104,322 L124,306" stroke="${GP}" stroke-width="1.6"/><circle cx="102" cy="320" r="3" fill="none" stroke="${GP}" stroke-width="1"/><circle cx="96" cy="326" r="3" fill="none" stroke="${GP}" stroke-width="1"/>`;
    o += figure(84, 372, 1.5, GP);
    return o + ground() + fireflies(r, 5, 160, 230, 230, 330);
  },
  root() {
    const r = rng(137);
    let o = `<rect x="30" y="250" width="220" height="130" fill="${INK_DEEP}" opacity=".7"/>`;
    o += crown(140, 130, 46, 56, 0.12) + trunk(140, 170, 250, 14);
    let roots = '';
    const grow = (x: number, y: number, a: number, len: number, d: number) => {
      if (d <= 0 || y > 378) return;
      const x2 = x + Math.sin(a) * len;
      const y2 = y + Math.cos(a) * len * 0.55;
      roots += `M${f(x)},${f(y)} Q${f((x + x2) / 2 + (r() - 0.5) * 6)},${f((y + y2) / 2)} ${f(x2)},${f(y2)}`;
      grow(x2, y2, a - 0.4 + r() * 0.2, len * 0.74, d - 1);
      grow(x2, y2, a + 0.4 - r() * 0.2, len * 0.74, d - 1);
    };
    for (const a of [-1.4, -0.9, -0.4, 0.05, 0.5, 0.95, 1.4]) grow(140, 250, a, 40, 5);
    o += `<path d="${roots}" fill="none" stroke="${G}" stroke-width=".8" opacity=".85"/>`;
    o += `<path d="M30,250 H250" stroke="${G}" stroke-width="1.2"/>`;
    o += `<path d="M48,330 q10,-6 20,0 M200,350 q10,-6 20,0" fill="none" stroke="${MOON}" stroke-width="1.6" opacity=".55"/>`;
    return o + figure(196, 250, 1.3, GP);
  },
  dormancy() {
    const r = rng(139);
    let o = spireRow(r, 300, 10, 40, 90, 0.5, INK_DEEP);
    o += trunk(140, 200, 372, 18) + branches(140, 210, 5, 0, 40, r, 2);
    for (let i = 0; i < 16; i++) {
      const x = 70 + r() * 140;
      const y = 80 + r() * 110;
      o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="1.6" ry="3" fill="${GP}" opacity=".8"/>`;
    }
    let snow = '';
    for (let i = 0; i < 60; i++) snow += `M${f(32 + r() * 216)},${f(44 + r() * 320)} h.1`;
    o += `<path d="${snow}" stroke="${MOON}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`;
    o += `<path d="M30,364 Q90,352 140,362 T250,358 V380 H30Z" fill="${MOON}" opacity=".5"/>`;
    o += `<g transform="translate(206 116)"><ellipse rx="6" ry="11" fill="${INK}" stroke="${GP}" stroke-width="1"/><path d="M-6,0 Q0,-14 6,0 M-5,6 Q0,-4 5,6" fill="none" stroke="${GP}" stroke-width=".7"/></g><path d="M196,126 L184,138" stroke="${G}" stroke-width=".7" stroke-dasharray="2 2"/>`;
    return o + figure(84, 364, 1.3, GP);
  },
  grafting() {
    const r = rng(149);
    let o = `<path d="M128,372 C130,330 132,300 134,250 L146,250 C148,300 150,330 152,372Z" fill="${INK}" stroke="${G}" stroke-width="1.3"/>`;
    o += `<path d="M134,250 L140,236 L146,250" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M138,252 C136,210 128,170 110,130 M142,250 C146,200 160,160 182,124" fill="none" stroke="${MOON}" stroke-width="2" opacity=".8"/>`;
    for (let k = 0; k < 5; k++)
      o += `<path d="M131,${238 + k * 5} L149,${242 + k * 5}" stroke="${GP}" stroke-width="1.4"/>`;
    for (const [x, y] of [
      [110, 130],
      [118, 154],
      [182, 124],
      [170, 150],
      [126, 178],
      [160, 176],
    ]) {
      o += leafAt(x!, y!, -120 + r() * 60, 18, 5, 0.25);
      o += `<circle cx="${f(x! + 4)}" cy="${f(y! + 8)}" r="3" fill="${GP}" opacity=".8"/>`;
    }
    o += `<path d="M128,372 C110,376 90,370 72,378 M152,372 C172,378 196,370 214,378" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M180,250 l18,-4 l4,6 l-18,4Z" fill="none" stroke="${G}" stroke-width=".9"/>`;
    return o + figure(204, 372, 1.5, GP) + ground() + fireflies(r, 6, 60, 220, 60, 200);
  },
  fruit() {
    const r = rng(151);
    let o = trunk(140, 230, 372, 16) + crown(140, 160, 92, 72, 0.08);
    o += branches(140, 240, 4, 0, 36, r, 1.6);
    for (let i = 0; i < 16; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r());
      o += fruitAt(140 + Math.cos(a) * 78 * d, 160 + Math.sin(a) * 58 * d);
    }
    o += `<g transform="translate(206 104)"><path d="M0,0 q-12,-8 -20,2 q8,0 10,6 q6,-2 10,-8Z" fill="${GP}"/><circle cx="2" cy="-2" r="4" fill="${GP}"/><path d="M5,-2 l5,1" stroke="${GP}" stroke-width="1.2"/></g>`;
    o += bird(70, 80, 0.9) + bird(220, 60, 0.7);
    o += fruitAt(110, 366, 4) + fruitAt(176, 368, 4);
    return o + figure(196, 372, 1.5, GP) + ground();
  },
  bending() {
    const r = rng(157);
    let o = '';
    let wind = '';
    for (let i = 0; i < 9; i++) {
      const y = 70 + i * 32;
      wind += `M${30 + r() * 20},${y} q30,-8 60,0 t60,0`;
    }
    o += `<path d="${wind}" fill="none" stroke="${MOON}" stroke-width=".7" opacity=".4"/>`;
    for (const [x, h, bend] of [
      [70, 200, 46],
      [120, 230, 60],
      [178, 180, 38],
    ]) {
      o += `<path d="M${x},372 Q${x! + 4},${372 - h! * 0.6} ${x! + bend!},${372 - h!}" fill="none" stroke="${MOON}" stroke-width="${f(5 - h! / 100)}" opacity=".8"/>`;
      for (let k = 0; k < 6; k++) {
        const t = 0.45 + k * 0.1;
        const px = x! + bend! * t * t;
        const py = 372 - h! * t;
        o += sprig(px, py, 20 + k * 6, 22, 0.8);
      }
    }
    o += `<path d="M214,372 L216,250 L222,250" fill="none" stroke="${G}" stroke-width="1.4"/><path d="M222,250 L238,262 L232,272" fill="none" stroke="${G}" stroke-width="1.4"/><path d="M216,250 l-6,-10 l4,-2" fill="none" stroke="${G}" stroke-width="1"/>`;
    return (
      o + figure(46, 372, 1.3, GP) + ground() + leafAt(160, 120, 20, 12, 4, 0.3) + leafAt(206, 150, 40, 12, 4, 0.3)
    );
  },
  stillness() {
    const r = rng(163);
    let o = spireRow(r, 320, 7, 170, 260, 0.95, INK_DEEP);
    o += mist(140, 300, 140, 16, 0.08) + mist(140, 330, 120, 10, 0.07);
    o += `<path d="M30,352 Q90,344 140,350 T250,346 L250,362 Q190,366 140,360 T30,364Z" fill="${MOON}" opacity=".18"/>`;
    o += `<path d="M44,356 h20 M110,352 h16 M180,354 h24" stroke="${MOON}" stroke-width=".8" opacity=".6"/>`;
    for (let k = 1; k <= 3; k++)
      o += `<ellipse cx="96" cy="357" rx="${k * 8}" ry="${k * 1.6}" fill="none" stroke="${GP}" stroke-width=".5" opacity="${f(0.7 - k * 0.18)}"/>`;
    o += `<circle cx="140" cy="96" r="13" fill="${GP}" opacity=".9"/>`;
    o += figure(180, 344, 1.3, GP);
    return o + ground() + fireflies(r, 6, 50, 230, 160, 300);
  },
  sprout() {
    const r = rng(167);
    let o = `<path d="M30,372 L30,40 L120,40 C112,140 112,260 124,372Z" fill="${INK}" stroke="${G}" stroke-width="1.4"/>`;
    for (let i = 0; i < 6; i++)
      o += `<path d="M${42 + i * 13},372 Q${f(40 + i * 13 + (r() - 0.5) * 10)},200 ${44 + i * 12},40" fill="none" stroke="${G}" stroke-width=".5" opacity=".5"/>`;
    o += `<path d="M124,372 Q150,366 170,372" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M184,372 V350" stroke="${GP}" stroke-width="1.2"/>${leafAt(184, 352, -150, 10, 3.5, 0.4)}${leafAt(184, 352, -30, 10, 3.5, 0.4)}`;
    o += `<circle cx="184" cy="350" r="16" fill="${GP}" opacity=".07"/>`;
    o += `<path d="M184,372 q-6,10 -14,14 M184,372 q4,10 10,16 M184,372 v14" fill="none" stroke="${G}" stroke-width=".7"/>`;
    return o + figure(222, 372, 1.4, GP) + ground() + fireflies(r, 7, 140, 240, 120, 320);
  },
  threads() {
    const r = rng(173);
    let o = `<rect x="30" y="250" width="220" height="130" fill="${INK_DEEP}" opacity=".7"/>`;
    const xs = [62, 140, 214];
    o +=
      spire(62, 250, 140, 54, INK, G, 1) +
      spire(214, 250, 120, 46, INK, G, 1) +
      crown(140, 150, 40, 60, 0.1) +
      trunk(140, 190, 250, 10);
    let roots = '';
    for (const x of xs)
      for (let k = -2; k <= 2; k++) roots += `M${x},250 q${k * 10},20 ${k * 22},${34 + Math.abs(k) * 6}`;
    o += `<path d="${roots}" fill="none" stroke="${G}" stroke-width="1"/>`;
    let net = '';
    for (let i = 0; i < 40; i++) {
      const x1 = 40 + r() * 200;
      const y1 = 270 + r() * 100;
      const x2 = x1 + (r() - 0.5) * 90;
      const y2 = y1 + (r() - 0.5) * 40;
      net += `M${f(x1)},${f(y1)} Q${f((x1 + x2) / 2)},${f((y1 + y2) / 2 + (r() - 0.5) * 20)} ${f(x2)},${f(y2)}`;
    }
    o += `<path d="${net}" fill="none" stroke="${MOON}" stroke-width=".5" opacity=".6"/>`;
    for (let i = 0; i < 14; i++)
      o += `<circle cx="${f(40 + r() * 200)}" cy="${f(270 + r() * 100)}" r="1.4" fill="${GP}" opacity=".9"/>`;
    o += `<path d="M30,250 H250" stroke="${G}" stroke-width="1.2"/>`;
    return o + figure(104, 250, 1.3, GP);
  },
  firstLeaf() {
    const r = rng(179);
    let o = `<path d="M30,340 L110,170 L150,230 L200,120 L250,200 V372 H30Z" fill="${INK}" stroke="${G}" stroke-width="1" opacity=".9"/>`;
    for (let i = 0; i < 26; i++) {
      const x = 40 + r() * 200;
      const top =
        x < 110
          ? 340 - (x - 30) * 2.1
          : x < 150
            ? 170 + (x - 110) * 1.5
            : x < 200
              ? 230 - (x - 150) * 2.2
              : 120 + (x - 200) * 1.6;
      const y = top + 14 + r() * (372 - top - 20);
      const t = (y - 120) / 250;
      o += `<path d="M${f(x)},${f(y + 10)} V${f(y)}" stroke="${G}" stroke-width=".7"/>`;
      if (y > 250)
        o += `<circle cx="${f(x)}" cy="${f(y - 3)}" r="${f(3 + t * 2)}" fill="${GP}" opacity="${f(0.25 + t * 0.4)}"/>`;
      else o += `<path d="M${f(x - 2)},${f(y)} l2,-4 l2,4" fill="none" stroke="${G}" stroke-width=".6"/>`;
    }
    o += `<path d="M44,290 Q120,250 180,262 Q220,268 246,240" fill="none" stroke="${GP}" stroke-width=".9" stroke-dasharray="2 4" opacity=".7"/>`;
    o += `<g transform="translate(76 120)">${leafAt(0, 0, -40, 22, 7, 0.35)}${leafAt(0, 0, 210, 18, 6, 0.3)}<path d="M0,0 q-6,16 -2,30" fill="none" stroke="${G}" stroke-width="1"/></g>`;
    return o + figure(70, 372, 1.4, GP) + ground();
  },
  bareMountain() {
    const r = rng(181);
    let o = `<path d="M30,330 Q90,170 150,150 Q210,170 250,300 V372 H30Z" fill="${INK}" stroke="${G}" stroke-width="1.2"/>`;
    for (let i = 0; i < 16; i++) {
      const x = 60 + r() * 170;
      const y = 200 + r() * 140;
      if (y < 330 - (x < 150 ? (x - 30) * 1.4 : (250 - x) * 1.3) * 0.9) continue;
      o += `<path d="M${f(x - 4)},${f(y)} h8 v-4 h-8Z" fill="none" stroke="${G}" stroke-width=".8"/>`;
      if (r() < 0.5)
        o += `<path d="M${f(x)},${f(y - 4)} v-6" stroke="${GP}" stroke-width=".9"/>${leafAt(x, y - 9, -60, 5, 2, 0.5)}`;
    }
    o += `<path d="M64,250 q8,-10 16,0 M70,252 v8 M76,252 v8" fill="none" stroke="${G}" stroke-width="1"/><path d="M58,248 l-4,-6 M86,248 l4,-6" stroke="${G}" stroke-width=".8"/>`;
    o += `<path d="M150,150 Q140,100 150,60 Q160,100 150,150" fill="none" stroke="${G}" stroke-width=".7" stroke-dasharray="2 3" opacity=".5"/>`;
    o +=
      spire(150, 150, 60, 20, 'none', G, 0.35) +
      spire(118, 170, 50, 16, 'none', G, 0.3) +
      spire(184, 172, 48, 16, 'none', G, 0.3);
    o += `<circle cx="214" cy="84" r="12" fill="${GP}" opacity=".85"/>`;
    return o + figure(220, 372, 1.4, GP) + ground();
  },
  unremembered() {
    const r = rng(191);
    let o = spireRow(r, 372, 9, 180, 290, 0.85, INK_DEEP);
    for (const [x, w] of [
      [80, 50],
      [190, 60],
    ]) {
      o += `<path d="M${x! - w! / 2},372 L${x! - w! / 2 + 4},334 L${x! + w! / 2 - 4},330 L${x! + w! / 2},372Z" fill="${MOON}" opacity=".35"/>`;
      o += `<ellipse cx="${x}" cy="332" rx="${w! / 2 - 4}" ry="6" fill="${MOON}" opacity=".5"/>`;
      for (let k = 1; k <= 4; k++)
        o += `<ellipse cx="${x}" cy="332" rx="${f((w! / 2 - 4) * (k / 5))}" ry="${f(6 * (k / 5))}" fill="none" stroke="${INK}" stroke-width=".5"/>`;
      o += `<path d="M${x! - 10},334 v-10 l20,-6 v10" fill="none" stroke="${INK}" stroke-width="1" opacity=".6"/>`;
    }
    o += `<path d="M190,326 l14,-4" stroke="${GP}" stroke-width="1"/>`;
    o += mist(140, 300, 130, 12, 0.07);
    return o + figure(136, 372, 1.5, GP) + ground() + fireflies(r, 8, 40, 240, 140, 320);
  },
  hollow() {
    const r = rng(193);
    let o = `<path d="M84,372 C92,300 94,220 100,120 L180,120 C186,220 188,300 196,372Z" fill="${INK}" stroke="${G}" stroke-width="1.4"/>`;
    o += branches(118, 128, 3, -0.5, 34, r, 1.4) + branches(164, 126, 3, 0.5, 34, r, 1.4);
    o += `<path d="M118,290 Q112,230 140,206 Q168,230 162,290 Q140,302 118,290Z" fill="${INK_DEEP}" stroke="${G}" stroke-width="1.1"/>`;
    o += `<g transform="translate(140 262)"><ellipse rx="13" ry="18" fill="${GP}" opacity=".18" stroke="${GP}" stroke-width="1"/><circle cx="-5" cy="-6" r="4.5" fill="none" stroke="${GP}" stroke-width="1"/><circle cx="5" cy="-6" r="4.5" fill="none" stroke="${GP}" stroke-width="1"/><circle cx="-5" cy="-6" r="1.6" fill="${GP}"/><circle cx="5" cy="-6" r="1.6" fill="${GP}"/><path d="M-11,-15 l4,5 M11,-15 l-4,5 M0,-2 l-2,4 l4,0z" fill="${GP}" stroke="${GP}" stroke-width=".8"/></g>`;
    for (let i = 0; i < 6; i++)
      o += `<path d="M${100 + i * 3},${330 - i * 30} q8,-4 0,-14" fill="none" stroke="${G}" stroke-width=".5" opacity=".6"/>`;
    o += `<path d="M84,372 C70,376 54,370 42,378 M196,372 C212,376 226,370 238,378" fill="none" stroke="${G}" stroke-width="1"/>`;
    return o + figure(222, 372, 1.3, GP) + ground() + fireflies(r, 7, 40, 240, 60, 200);
  },
  treeOfField() {
    const r = rng(197);
    let o = `<path d="M30,150 H92 V372 M30,190 H92 M30,230 H92 M30,270 H92" fill="none" stroke="${G}" stroke-width="1" opacity=".5"/>`;
    o += `<path d="M50,150 v-10 h10 v10 M72,150 v-10 h10 v10" fill="none" stroke="${G}" stroke-width="1" opacity=".5"/>`;
    o += trunk(170, 250, 372, 14) + crown(170, 196, 62, 54, 0.1) + branches(170, 256, 3, 0, 30, r, 1.4);
    for (let i = 0; i < 12; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r());
      o += fruitAt(170 + Math.cos(a) * 52 * d, 196 + Math.sin(a) * 44 * d, 4);
    }
    o += `<path d="M104,372 L130,340" stroke="${G}" stroke-width="1.6"/><path d="M126,334 l12,2 l-4,10 l-10,-4Z" fill="${INK}" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M98,372 L120,250 M114,372 L134,252 M102,350 L118,352 M106,326 L122,328 M110,302 L126,304 M114,278 L130,280" fill="none" stroke="${G}" stroke-width=".8" opacity=".5" stroke-dasharray="3 3"/>`;
    return o + figure(222, 372, 1.5, GP) + ground();
  },
  edge() {
    const r = rng(199);
    let o = spireRow(r, 372, 6, 220, 320, 0.98, INK_DEEP, 26, 140);
    o += `<rect x="150" y="40" width="100" height="332" fill="${GP}" opacity=".07"/>`;
    o += spireRow(r, 372, 2, 120, 160, 0.9, INK_DEEP, 140, 175);
    o += `<path d="M175,300 Q210,290 250,296" fill="none" stroke="${G}" stroke-width=".8" opacity=".7"/>`;
    o += `<circle cx="214" cy="120" r="16" fill="${GP}" opacity=".9"/><circle cx="214" cy="120" r="30" fill="${GP}" opacity=".08"/>`;
    o += `<path d="M120,372 Q170,360 250,352" fill="none" stroke="${GP}" stroke-width="1.4" stroke-dasharray="1 4" opacity=".6" stroke-linecap="round"/>`;
    o += figure(186, 362, 1.4, GP) + `<path d="M190,346 q10,4 12,12" fill="none" stroke="${GP}" stroke-width="1"/>`;
    return o + ground() + bird(226, 200, 0.6) + bird(238, 186, 0.5);
  },
  climbing() {
    const r = rng(211);
    let o = `<path d="M124,372 C128,320 120,280 132,240 L148,240 C156,280 150,320 156,372Z" fill="${INK}" stroke="${G}" stroke-width="1.3"/>`;
    o += `<path d="M134,244 C110,220 84,214 60,190 M146,244 C170,214 196,206 222,180 M140,240 C140,200 138,160 140,120" fill="none" stroke="${G}" stroke-width="1.4"/>`;
    o += crown(140, 150, 104, 66, 0.07);
    for (let i = 0; i < 22; i++) o += leafAt(50 + r() * 180, 100 + r() * 100, r() * 360, 13, 6, 0.2);
    o += figure(196, 202, 1.2, GP);
    o += `<path d="M30,372 H250" stroke="${G}" stroke-width="1"/>`;
    for (let i = 0; i < 6; i++) o += figure(44 + i * 12 + (i > 2 ? 120 : 0), 372, 0.9 + r() * 0.2, G);
    o += `<path d="M196,170 L226,140" stroke="${GP}" stroke-width=".7" stroke-dasharray="2 3"/>`;
    return o;
  },
  juniper() {
    const r = rng(223);
    let o = `<path d="M30,330 Q140,306 250,330 V372 H30Z" fill="${INK}" opacity=".8"/>`;
    let broom = '';
    for (let i = 0; i < 18; i++) {
      const a = -1.1 + (i / 17) * 2.2;
      const len = 62 + r() * 30;
      broom += `M176,350 Q${f(176 + Math.sin(a) * len * 0.4)},${f(350 - len * 0.75)} ${f(176 + Math.sin(a) * len)},${f(350 - Math.cos(a) * len * 0.95)}`;
    }
    o += `<path d="${broom}" fill="none" stroke="${G}" stroke-width=".9" opacity=".9"/>`;
    for (let i = 0; i < 14; i++)
      o += `<circle cx="${f(130 + r() * 92)}" cy="${f(270 + r() * 50)}" r="1.3" fill="${GP}" opacity=".7"/>`;
    o += `<g transform="translate(150 356) scale(1.7)">${sleeper(-26, 4)}</g>`;
    o += `<circle cx="118" cy="340" r="24" fill="${GP}" opacity=".07"/><path d="M96,318 Q118,296 140,316" fill="none" stroke="${GP}" stroke-width=".9" opacity=".6"/>`;
    o += `<ellipse cx="206" cy="366" rx="10" ry="3.5" fill="${GP}" opacity=".85"/><path d="M220,368 L222,350 Q227,345 232,350 L234,368Z" fill="none" stroke="${GP}" stroke-width="1.1"/>`;
    for (let i = 0; i < 40; i++)
      o += `<circle cx="${f(40 + r() * 200)}" cy="${f(50 + r() * 160)}" r="${f(0.5 + r())}" fill="${GP}" opacity="${f(0.3 + r() * 0.6)}"/>`;
    o += `<circle cx="74" cy="92" r="12" fill="${GP}" opacity=".85"/><circle cx="80" cy="88" r="11" fill="${INK}"/>`;
    return o + ground();
  },
};
