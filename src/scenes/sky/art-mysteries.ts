import type { MoonPhase } from '../../lib/sky-math';
import { f, polar, rng } from '../../lib/svg';
import { CREAM, dust, GOLD, LAPIS, moonDisc, MUTED, pilgrim, SHADE, sparkle, TEAL, VERM, type Drawer } from './ink';

const ln = (d: string, stroke: string, w: number, o = 1) =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" opacity="${o}" stroke-linecap="round"/>`;
const fl = (d: string, fill: string, o = 1) => `<path d="${d}" fill="${fill}" opacity="${o}"/>`;
const dot = (x: number, y: number, r: number, fill: string, o = 1) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" opacity="${f(o)}"/>`;
const at = (x: number, y: number, deg: number, r: number) => polar(x, y, deg, r).join(',');
const sea = (x0: number, x1: number, y: number, s: number, amp = 2.4) =>
  `M${f(x0)},${f(y)} q${f(s / 2)},${-amp} ${f(s)},0` + ` t${f(s)},0`.repeat(Math.max(0, Math.round((x1 - x0) / s) - 1));
const waves = (cx: number, y0: number, rows: number, gap: number) => {
  let o = '';
  for (let k = 0; k < rows; k++)
    o += ln(sea(cx - 104 + (k % 2) * 6, cx + 104, y0 + k * gap, 10 + k * 2), MUTED, 0.6, 0.7 - k * 0.1);
  return o;
};
const stars = (cx: number, cy: number, seed: number, n: number, keep: (x: number, y: number) => boolean) => {
  const r = rng(seed);
  let o = '';
  for (let i = 0; i < n; i++) {
    const x = cx - 96 + r() * 192;
    const y = cy - 96 + r() * 192;
    const s = r();
    if (keep(x, y)) o += s > 0.86 ? sparkle(x, y, 2 + s * 2, CREAM) : dot(x, y, 0.4 + s, CREAM, 0.4 + s * 0.5);
  }
  return o;
};

export const MYSTERY_ART = {
  egg(cx, cy) {
    const y = cy - 4;
    let o = dust(cx, cy, 211, 36);
    for (const s of [-1, 1]) {
      const lead: number[][] = [];
      for (let i = 0; i <= 6; i++) {
        const t = i / 6;
        lead.push([cx + s * (16 + t * 78), y - 10 - Math.sin(t * 2.5) * 40 + t * 8, 46 - t * 30]);
      }
      let d = `M${lead.map(([x, yy]) => `${f(x!)},${f(yy!)}`).join(' L')}`;
      let quills = '';
      for (const [x, yy, h] of lead.reverse()) {
        d += ` Q${f(x! + s * 4)},${f(yy! + h! + 6)} ${f(x! - s * 6)},${f(yy! + h! - 4)}`;
        quills += `M${f(x!)},${f(yy!)} L${f(x! + s)},${f(yy! + h!)}`;
      }
      o += `<path d="${d}Z" fill="${LAPIS}" stroke="${GOLD}" stroke-width=".9"/>` + ln(quills, GOLD, 0.6, 0.6);
    }
    let zig = '';
    for (let k = 0; k <= 6; k++) zig += ` L${cx + 30 - k * 10},${y + (k % 2) * 6}`;
    o += dot(cx, y + 2, 26, CREAM, 0.12);
    for (let i = 0; i < 14; i++) {
      const d = (i < 7 ? 70 : 250) + (i % 7) * 6.6;
      o += ln(`M${at(cx, y + 2, d, 34)} L${at(cx, y + 2, d, 54 + (i % 3) * 16)}`, CREAM, 0.7, 0.55);
    }
    o += `<g stroke="${GOLD}" stroke-width="1.1"><path d="M${cx - 30},${y} A30,46 0 0 1 ${cx + 30},${y}${zig}Z" fill="${GOLD}" transform="translate(0 -9)"/>`;
    o += `<path d="M${cx - 30},${y} A30,32 0 0 0 ${cx + 30},${y}${zig}Z" fill="${MUTED}" transform="translate(0 6)"/></g>`;
    o += ln(`M${cx},${y} q-9,-13 -24,-9 q10,1 13,7 M${cx},${y} q9,-13 24,-9 q-10,1 -13,7`, GOLD, 1.2);
    o += sparkle(cx, y + 1, 9, VERM) + dot(cx, y + 1, 2, CREAM);
    return o;
  },
  widening(cx, cy) {
    const sky = `M${cx - 110},${cy + 6} Q${cx},${cy - 66} ${cx + 110},${cy + 6}`;
    const earth = `M${cx - 110},${cy + 70} Q${cx},${cy + 38} ${cx + 110},${cy + 70}`;
    let o = fl(`${sky} V${cy - 110} H${cx - 110}Z`, SHADE, 0.6) + fl(`${earth} V${cy + 110} H${cx - 110}Z`, TEAL, 0.2);
    o += `<ellipse cx="${cx}" cy="${cy + 18}" rx="80" ry="26" fill="${CREAM}" opacity=".1"/>`;
    for (let i = 0; i < 14; i++) {
      const d = (i < 7 ? 66 : 246) + (i % 7) * 8;
      o += ln(`M${at(cx, cy + 18, d, 22)} L${at(cx, cy + 18, d, 50 + (i % 2) * 40)}`, CREAM, 0.6, 0.4);
    }
    const r = rng(41);
    for (let i = 0; i < 16; i++) {
      const a = -0.25 - r() * 2.64;
      const d = 52 + r() * 50;
      const x = cx + Math.cos(a) * d;
      const y = cy - 30 + Math.sin(a) * d * 0.7;
      o +=
        ln(`M${f(x - Math.cos(a) * 7)},${f(y - Math.sin(a) * 5)} L${f(x)},${f(y)}`, CREAM, 0.5, 0.45) +
        sparkle(x, y, 1.6 + r() * 2, CREAM);
    }
    o += ln(sky, GOLD, 1.4) + ln(earth, GOLD, 1.2);
    o += ln(`M${cx - 66},${cy + 60} V${cy - 17} M${cx + 66},${cy + 60} V${cy - 17}`, GOLD, 2.4, 0.85);
    for (const x of [-88, -44, -26, 30, 46, 86])
      o += ln(`M${cx + x},${cy + 52 + Math.abs(x) * 0.12} v-7 m0,3 q-3,-4 -6,-3 m6,1 q3,-4 6,-3`, TEAL, 1);
    o += ln(
      `M${cx},${cy + 2} V${cy + 28} M${cx - 11},${cy + 53} L${cx},${cy + 28} L${cx + 11},${cy + 53} M${cx - 12},${cy - 24} L${cx - 15},${cy - 5} L${cx},${cy + 6} L${cx + 15},${cy - 5} L${cx + 12},${cy - 24}`,
      GOLD,
      3.2,
    );
    return o + dot(cx, cy - 4, 5, GOLD);
  },
  greatyear(cx, cy) {
    let o = '';
    let a = 0;
    [4, 3, 2, 1].forEach((k, i) => {
      o += fl(`M${cx},${cy} L${at(cx, cy, a, 74)} A74,74 0 0 1 ${at(cx, cy, a + k * 36, 74)}Z`, GOLD, 0.3 - i * 0.08);
      o += ln(`M${cx},${cy} L${at(cx, cy, a, 74)}`, GOLD, 0.7, 0.7);
      for (let j = 0; j < k; j++) o += sparkle(...polar(cx, cy, a + (j + 0.5) * 36, 62), 3.4, CREAM);
      a += k * 36;
    });
    o += `<circle cx="${cx}" cy="${cy}" r="74" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`;
    for (let i = 0; i < 36; i++)
      o += ln(`M${at(cx, cy, i * 10, 74)} L${at(cx, cy, i * 10, i % 3 ? 78 : 82)}`, GOLD, 0.7);
    o += ln(`M${cx},${cy} L${at(cx, cy, 40, 74)}`, CREAM, 0.5, 0.5);
    for (let i = 0; i < 7; i++) {
      const [x, y] = polar(cx, cy, 40, 16 + i * 9.5);
      o += i === 3 ? sparkle(x, y, 5, VERM) : dot(x, y, 1.4 + ((i * 5) % 3) * 0.7, CREAM);
    }
    o += `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${MUTED}" stroke-width=".7" stroke-dasharray="1.5 2"/>`;
    const [vx, vy] = polar(cx, cy, 300, 9);
    const [tx, ty] = polar(cx, cy, 130, 9);
    o += sparkle(vx, vy, 5, CREAM) + dot(tx, ty, 1.3, MUTED) + dot(cx, cy, 1.4, GOLD);
    o += ln(`M${at(cx, cy, 200, 90)} A90,90 0 0 1 ${at(cx, cy, 330, 90)} l-7,-4 m7,4 l-2,8`, GOLD, 1.1, 0.9);
    return o;
  },
  longsleep(cx, cy) {
    let o = ln(
      `M${cx - 110},${cy + 30} L${cx - 70},${cy - 6} L${cx - 42},${cy + 8} L${cx + 8},${cy - 24} L${cx + 58},${cy + 4} L${cx + 110},${cy - 14}`,
      GOLD,
      0.8,
      0.5,
    );
    for (let i = 0; i < 7; i++) {
      const [x, y] = polar(cx, cy + 34, -66 + i * 22, 94);
      const age = 2.2 + i * 4.2;
      const ph: MoonPhase = {
        age,
        name: '',
        pct: 50 - 50 * Math.cos((age / 29.53) * 2 * Math.PI),
        waxing: age < 14.77,
      };
      o += moonDisc(x, y, 6.5, ph, CREAM, SHADE);
    }
    const p = (u: number, v: number) => `${f(cx + 4 + (u - v) * 58)},${f(cy + 14 + (u + v - 1) * 22)}`;
    o += fl(`M${p(1, 0)} L${p(1, 1)} L${p(0, 1)} v6 L${p(1, 1)} m0,6 L${p(1, 0)}Z`, GOLD, 0.6);
    o += `<path d="M${p(0, 0)} L${p(1, 0)} L${p(1, 1)} L${p(0, 1)}Z" fill="${SHADE}" stroke="${GOLD}" stroke-width="1.1"/>`;
    let grid = '';
    for (let k = 1; k < 7; k++) grid += `M${p(k / 7, 0)} L${p(k / 7, 1)} M${p(0, k / 7)} L${p(1, k / 7)}`;
    o += ln(grid, GOLD, 0.5, 0.7);
    const r = rng(17);
    for (let i = 0; i < 14; i++) {
      const [x, y] = p((1 + Math.floor(r() * 6)) / 7, (1 + Math.floor(r() * 6)) / 7)
        .split(',')
        .map(Number) as [number, number];
      o += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.1" fill="${i % 2 ? CREAM : LAPIS}" stroke="${GOLD}" stroke-width=".4"/>`;
    }
    o += pilgrim(cx - 64, cy + 10, CREAM, 1.4) + pilgrim(cx + 72, cy + 10, CREAM, 1.4);
    const hx = cx - 60;
    const hy = cy + 58;
    o += `<path d="M${hx - 4},${hy - 5} h8 v6 l6,13 Q${hx},${hy + 19} ${hx - 6},${hy + 14} l6,-13z" fill="${GOLD}"/>`;
    for (let i = 0; i < 16; i++)
      o += dot(hx + 3 + i * 3.4, hy + i * 1.1 + Math.sin(i * 2.7) * i * 0.35, 1.5 - i * 0.07, GOLD, 1 - i * 0.05);
    return o;
  },
  edge(cx, cy) {
    const x = cx + 14;
    const y = cy + 18;
    const R = 54;
    const g = y + 14;
    let o = stars(cx, cy, 5, 70, (px, py) => Math.hypot(px - x, py - y) > R + 7);
    for (const [wx, wy, wr] of [
      [cx + 54, cy - 62, 12],
      [cx - 76, cy + 30, 8],
    ] as const) {
      let sp = '';
      for (let i = 0; i < 8; i++) sp += `M${wx},${wy} L${at(wx, wy, i * 45, wr)}`;
      o +=
        `<circle cx="${wx}" cy="${wy}" r="${wr}" fill="none" stroke="${MUTED}" stroke-width=".7" opacity=".7"/>` +
        ln(sp, MUTED, 0.5, 0.6);
    }
    o += `<circle cx="${x}" cy="${y}" r="${R}" fill="${SHADE}" opacity=".45"/>`;
    for (let k = 0; k < 3; k++) {
      const yy = g + 10 + k * 10;
      const w = Math.sqrt(R * R - (yy - y) ** 2) - 3;
      o += ln(sea(x - w, x + w, yy, 8, 2), MUTED, 0.6, 0.8 - k * 0.15);
    }
    const hw = Math.sqrt(R * R - (g - y) ** 2);
    o += ln(`M${f(x - hw)},${g} H${f(x + hw)}`, GOLD, 1);
    o +=
      ln(`M${at(x, y, 98, R)} A${R},${R} 0 1 1 ${at(x, y, 60, R)}`, GOLD, 7) +
      ln(`M${at(x, y, 60, R)} A${R},${R} 0 0 1 ${at(x, y, 86, R)}`, GOLD, 3.5);
    o += `<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${LAPIS}" stroke-width="5" stroke-dasharray="1.2 3" opacity=".55"/>`;
    const [hx, hy] = polar(x, y, 93, R);
    o += `<ellipse cx="${hx}" cy="${hy + 2}" rx="5.5" ry="8" fill="${GOLD}"/>` + dot(hx + 2, hy + 4, 1.4, VERM);
    const hand = [cx - 8, cy + 6] as const;
    const tip = polar(hand[0], hand[1], 315, 82);
    o += ln(`M${at(hand[0], hand[1], 135, 18)} L${tip.join(',')}`, CREAM, 1.6);
    o += ln(`M${tip.join(',')} q-14,-20 -10,-50`, CREAM, 0.8, 0.5).replace('/>', ' stroke-dasharray="1 4"/>');
    o += sparkle(tip[0], tip[1], 6, VERM);
    o += ln(
      `M${x - 12},${g - 8} V${g - 21} M${x - 18},${g} L${x - 12},${g - 8} L${x - 6},${g} M${x - 12},${g - 18} L${hand[0]},${hand[1]}`,
      GOLD,
      2.6,
    );
    return o + dot(x - 11, g - 25, 3.8, GOLD);
  },
  stardust(cx, cy) {
    const r = rng(29);
    let o = fl(
      `M${cx - 110},${cy + 74} Q${cx},${cy + 50} ${cx + 110},${cy + 74} V${cy + 110} H${cx - 110}Z`,
      TEAL,
      0.18,
    );
    o += ln(`M${cx - 110},${cy + 74} Q${cx},${cy + 50} ${cx + 110},${cy + 74}`, GOLD, 0.9, 0.8);
    const bx = cx + 58;
    const by = cy - 50;
    for (let i = 0; i < 12; i++)
      o +=
        ln(`M${at(bx, by, i * 30, 6)} L${at(bx, by, i * 30, 12 + (i % 2) * 5)}`, CREAM, 0.7, 0.6) +
        dot(...polar(bx, by, i * 30 + 15, 18), 0.9, GOLD);
    o += dot(bx, by, 2.2, CREAM);
    o += ln(`M${bx + 4},${by + 22} Q${bx + 20},${by + 70} ${cx + 30},${cy + 30}`, MUTED, 0.7, 0.6).replace(
      '/>',
      ' stroke-dasharray="1 3.5"/>',
    );
    for (let i = 0; i < 52; i++) {
      const t = i / 52;
      const x = cx + (r() * 2 - 1) * (5 + t * 58);
      const y = cy + 12 - t * 104 - r() * 6;
      o += t < 0.42 ? dot(x, y, 0.5 + r(), i % 3 ? GOLD : MUTED, 0.9 - t) : sparkle(x, y, 1.2 + t * 3.4 * r(), CREAM);
    }
    o += sparkle(cx - 16, cy - 82, 8, VERM);
    o += `<g transform="translate(${cx - 66} ${cy + 40}) rotate(-14)"><rect x="-10" y="-15" width="20" height="30" rx="1.5" fill="${GOLD}"/>${ln('M-6,-9 h12 M-6,-4 h10 M-6,1 h12 M-6,6 h8', LAPIS, 0.8, 0.7)}</g>`;
    o += `<g transform="translate(${cx} ${cy + 40})" fill="${GOLD}"><rect x="-13" y="-6" width="26" height="26" rx="7"/><rect x="-9" y="10" width="18" height="24"/>${ln('M-9.5,-2 L-12,-20 M-3.2,-2 L-4,-26 M3.2,-2 L4,-25 M9.5,-2 L12.5,-19 M-11,12 L-22,-2', GOLD, 5.6)}</g>`;
    return o;
  },
  breath(cx, cy) {
    const [nx, ny] = [cx + 31, cy - 13];
    let o = moonDisc(cx - 64, cy - 46, 10, { age: 25, name: '', pct: 25, waxing: false }, CREAM, LAPIS);
    for (let k = 0; k < 6; k++) {
      const R = 14 + k * 15;
      o += ln(`M${at(nx, ny, 8, R)} A${R},${R} 0 0 1 ${at(nx, ny, 102, R)}`, GOLD, 1.2 - k * 0.15, 0.95 - k * 0.13);
      for (let j = 0; j < k; j++)
        o += dot(...polar(nx, ny, 16 + ((j + 0.5) * 78) / k, R), 1 + k * 0.35, j % 3 === 1 ? TEAL : CREAM, 1 - k * 0.1);
    }
    const tear = 'M40,0 C20,-6 -8,-30 -28,-22 C-44,-14 -44,14 -28,22 C-8,30 20,6 40,0Z';
    o += `<g transform="translate(${cx - 18} ${cy + 22}) rotate(-35)">`;
    o += ln('M-42,12 L-62,22 M-40,0 L-60,-8', GOLD, 3);
    o += `<path d="${tear}" transform="translate(-4 14)" fill="${GOLD}" opacity=".55"/>`;
    o += `<path d="${tear}" transform="translate(-2 7)" fill="${VERM}" stroke="${CREAM}" stroke-width="4" stroke-dasharray="1 3" opacity=".9"/>`;
    o += `<path d="${tear}" fill="${GOLD}"/><path d="M38,-3 L60,-1.5 V1.5 L38,3Z" fill="${GOLD}"/>`;
    for (let i = 0; i < 12; i++) o += ln(`M${at(-14, 0, i * 30, 7)} L${at(-14, 0, i * 30, i % 2 ? 10 : 12)}`, LAPIS, 1);
    o += dot(-14, 0, 5, LAPIS) + dot(-60, -8, 3.4, GOLD) + dot(-62, 22, 3.4, GOLD) + '</g>';
    return o + dot(nx, ny, 3, VERM) + dot(nx, ny, 9, VERM, 0.2);
  },
  traveler(cx, cy) {
    const h = cy + 16;
    let o = stars(cx, cy, 91, 90, (_, y) => y < h - 4);
    o += sparkle(cx + 58, cy - 14, 9, CREAM) + dot(cx + 58, cy - 14, 14, CREAM, 0.1);
    for (let k = 0; k < 7; k++) o += ln(`M${cx + 58 - 2 - k},${h + 5 + k * 9} h${4 + k * 2}`, CREAM, 1, 0.7 - k * 0.08);
    o += ln(`M${cx - 110},${h} H${cx + 110}`, GOLD, 1) + waves(cx, h + 10, 6, 11);
    const bx = cx - 4;
    const by = h + 24;
    o += ln(
      `M${bx - 26},${by - 2} L${bx - 96},${by + 26} M${bx - 24},${by + 3} L${bx - 76},${by + 46}`,
      CREAM,
      0.7,
      0.4,
    );
    for (const x of [-11, 0, 11])
      o += dot(bx + x, by - 12, 2.6, CREAM) + fl(`M${bx + x - 2.5},${by - 9} h5 l1,6 h-7z`, CREAM);
    o += `<path d="M${bx - 30},${by - 7} Q${bx - 18},${by + 7} ${bx},${by + 7} Q${bx + 20},${by + 7} ${bx + 32},${by - 9} Q${bx + 14},${by - 2} ${bx},${by - 2} Q${bx - 14},${by - 2} ${bx - 30},${by - 7}Z" fill="${GOLD}"/>`;
    for (const [x, y, s] of [
      [-50, -40, 1.2],
      [-30, -54, 0.9],
      [20, -30, 1],
    ] as const)
      o += ln(`M${cx + x - 6 * s},${cy + y} q${3 * s},${-4 * s} ${6 * s},0 q${3 * s},${-4 * s} ${6 * s},0`, GOLD, 1.1);
    return o;
  },
  lastlight(cx, cy) {
    const [sx, sy] = polar(cx, cy + 40, -26, 112);
    const [dx, dy] = polar(cx, cy + 40, 32, 112);
    let o = stars(cx, cy, 13, 50, (_, y) => y < cy + 30);
    o += ln(`M${at(cx, cy + 40, -64, 112)} A112,112 0 0 1 ${at(cx, cy + 40, 64, 112)}`, GOLD, 0.8, 0.5).replace(
      '/>',
      ' stroke-dasharray="3 4"/>',
    );
    for (let i = 0; i < 20; i++)
      o += ln(`M${at(sx, sy, i * 18, 19)} L${at(sx, sy, i * 18 + 9, i % 2 ? 24 : 30)}`, i % 2 ? GOLD : VERM, 1);
    o += `<circle cx="${sx}" cy="${sy}" r="16" fill="${LAPIS}" stroke="${GOLD}" stroke-width="1.4"/>`;
    for (let i = 0; i < 12; i++)
      o += ln(`M${at(dx, dy, i * 30, 10)} L${at(dx, dy, i * 30, i % 2 ? 14 : 18)}`, CREAM, 1);
    o += dot(dx, dy, 7.5, GOLD) + dot(dx, dy, 7.5, CREAM, 0.4);
    for (const [x, y] of [
      [-6, -66],
      [18, -48],
      [-28, -36],
      [40, -78],
    ] as const)
      o += ln(`M${cx + x},${cy + y} l-12,20`, CREAM, 0.9, 0.55) + dot(cx + x - 12, cy + y + 20, 1.4, CREAM);
    o += waves(cx, cy + 50, 4, 10);
    o += `<path d="M${cx - 74},${cy + 46} Q${cx - 46},${cy - 2} ${cx - 10},${cy + 6} Q${cx + 16},${cy - 14} ${cx + 38},${cy + 6} L${cx + 42},${cy + 46}Z" fill="${TEAL}" fill-opacity=".55" stroke="${GOLD}" stroke-width="1"/>`;
    for (let i = 0; i < 4; i++) o += ln(`M${cx + 42 + i * 2},${cy + 9 + i} V${cy + 46}`, CREAM, 0.9, 0.85 - i * 0.15);
    for (let i = 0; i < 6; i++) o += dot(cx + 40 + i * 2.6, cy + 48 + (i % 2) * 2, 1, CREAM, 0.7);
    for (const x of [-52, -40, -22, 0, 18])
      o += fl(`M${cx + x - 3.5},${cy + 24 - (x > -30 ? 8 : 0)} l3.5,-11 l3.5,11z`, GOLD, 0.85);
    o += ln(`M${cx - 26},${cy - 30} q8,-8 16,2 q8,-10 16,-2`, GOLD, 1.8);
    return o;
  },
} satisfies Record<string, Drawer>;
