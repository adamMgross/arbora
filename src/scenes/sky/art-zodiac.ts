import { FIGURES, type FigureId } from '../../lib/sky-dome';
import { f, rng } from '../../lib/svg';
import { constellation, CREAM, dust, GOLD, LAPIS, moonDisc, SHADE, sparkle, TEAL, VERM, type Drawer } from './ink';

type Pt = [number, number];
const rad = Math.PI / 180;

const at = (cx: number, cy: number, s: string) => `<g transform="translate(${cx} ${cy})">${s}</g>`;

const ln = (d: string, w = 1, op = 1, c = GOLD, x = '') =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${op}" stroke-linecap="round"${x}/>`;

const dash = (d: string, w = 0.8, op = 0.6, c = GOLD) => ln(d, w, op, c, ' stroke-dasharray="3 4"');

const body = (d: string, op = 0.5, c = SHADE) =>
  `<path d="${d}" fill="${LAPIS}"/><path d="${d}" fill="${c}" fill-opacity="${op}" stroke="${GOLD}" stroke-width="1.1" stroke-linejoin="round"/>`;

const dot = (x: number, y: number, r: number, op = 1, c = CREAM) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${c}" opacity="${f(op)}"/>`;

function place(id: FigureId, k: number, deg: number, x: number, y: number, mx = 1, anchor = FIGURES[id].center): Pt[] {
  const s = FIGURES[id].stars;
  const [r0, d0] = s[anchor]!;
  const c = Math.cos(d0 * rad);
  const cos = Math.cos(deg * rad);
  const sin = Math.sin(deg * rad);
  return s.map(([r, d]) => {
    const u = -mx * (((r - r0 + 540) % 360) - 180) * c * k;
    const v = (d0 - d) * k;
    return [x + u * cos - v * sin, y + u * sin + v * cos];
  });
}

const sky = (p: Pt[], id: FigureId, big: number[] = [], accent: number[] = [], lines = FIGURES[id].lines) =>
  constellation(
    0,
    0,
    p.map(([x, y], i) => [x, y, big.includes(i) ? 2 : 1.2]),
    lines,
    accent,
  );

function smooth(p: Pt[]): string {
  let d = `M${f(p[0]![0])},${f(p[0]![1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [a, b, c, e] = [p[i - 1] ?? p[i]!, p[i]!, p[i + 1]!, p[i + 2] ?? p[i + 1]!];
    d += `C${f(b[0] + (c[0] - a[0]) / 6)},${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)},${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])},${f(c[1])}`;
  }
  return d;
}

function tube(segs: Array<[string, number]>, tint = SHADE, op = 0.6): string {
  let o = '';
  for (const [c, dw, a] of [
    [GOLD, 2.4, 1],
    [LAPIS, 0, 1],
    [tint, 0, op],
  ] as Array<[string, number, number]>)
    for (const [d, w] of segs) o += ln(d, w + dw, a, c);
  return o;
}

function waves(y: number, n: number, solid = false, gap = 9): string {
  let o = '';
  for (let k = 0; k < n; k++) {
    const d = `M${-118 + (k % 2) * 12},${y + k * gap} q12,-6 24,0${' t24,0'.repeat(9)}`;
    o += solid ? `<path d="${d} V110 H-120Z" fill="${LAPIS}" opacity=".9"/>` : '';
    o += ln(d, f(1.3 - k * 0.15), f(0.85 - k * 0.12), TEAL);
  }
  return o;
}

function spiral(x: number, y: number, r: number, turns: number, a0: number, dir = 1): string {
  const p: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const a = (a0 + dir * t * turns * 360) * rad;
    p.push([x + Math.cos(a) * r * (1 - t * 0.75), y + Math.sin(a) * r * (1 - t * 0.75)]);
  }
  return smooth(p);
}

function rays(x: number, y: number, r0: number, r1: number, n: number, wavy = false): string {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i * 360 * rad) / n;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    const w = wavy && i % 2 ? 3 : 0;
    d += `M${f(x + c * r0)},${f(y + s * r0)} Q${f(x + c * (r0 + r1) * 0.5 - s * w)},${f(y + s * (r0 + r1) * 0.5 + c * w)} ${f(x + c * r1)},${f(y + s * r1)}`;
  }
  return d;
}

const fish = (x: number, y: number, s: number, deg: number, inner = '', op = 0.5) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)}) scale(${s})" stroke-width="${f(1.1 / s)}">${body('M17,-3Q4,-11-14,-2L-22,-9L-20,0L-22,9L-14,2Q4,11 17,3L11,0Z', op)}${ln('M6,-6Q3,0 6,6M-2,-8L-8,-13L-8,-6', 0.7 / s)}${dot(10, -3, 1.3, 1, GOLD)}${inner}</g>`;

function thorn([x0, y0, qx, qy, x1, y1]: number[]): string {
  let d = `M${x0},${y0}Q${qx},${qy} ${x1},${y1}`;
  for (let i = 1; i < 9; i++) {
    const t = i / 9;
    const s = 1 - t;
    const x = s * s * x0! + 2 * s * t * qx! + t * t * x1!;
    const y = s * s * y0! + 2 * s * t * qy! + t * t * y1!;
    const tx = s * (qx! - x0!) + t * (x1! - qx!);
    const ty = s * (qy! - y0!) + t * (y1! - qy!);
    const L = Math.hypot(tx, ty);
    const side = i % 2 ? 4 : -4;
    d += `M${f(x)},${f(y)}l${f((tx / L) * 3 - (ty / L) * side)},${f((ty / L) * 3 + (tx / L) * side)}`;
  }
  return ln(d, 1.1, 0.85);
}

function along(x0: number, y0: number, qx: number, qy: number, x1: number, y1: number, n: number, seed: number) {
  const r = rng(seed);
  let o = '';
  for (let i = 0; i < n; i++) {
    const t = (i + r() * 0.6) / n;
    const s = 1 - t;
    const x = s * s * x0 + 2 * s * t * qx + t * t * x1 + (r() - 0.5) * 6;
    const y = s * s * y0 + 2 * s * t * qy + t * t * y1 + (r() - 0.5) * 6;
    o += i % 4 ? dot(x, y, 0.5 + r() * 1.1, 0.5 + r() * 0.5) : sparkle(x, y, 2.4 + r() * 1.6, CREAM);
  }
  return o;
}

export const ZODIAC_ART = {
  ram(cx, cy) {
    const p = place('ram', 6, -84, 4, -38);
    let o = dash('M-100,-18 Q0,-96 100,-60') + ln(rays(60, -70, 10, 17, 12), 0.9, 0.9);
    o += `<circle cx="60" cy="-70" r="7" fill="${VERM}"/>`;
    const T = [
      -98, 10, -70, -40, -10, -72, -94, 48, -64, 0, -26, -40, -60, -80, -10, -66, 40, -54, -70, 74, -92, 30, -64, -10,
    ];
    for (let i = 0; i < T.length; i += 6) o += thorn(T.slice(i, i + 6));
    let r = body(
      'M-36,40Q-46,18-26,8Q2,-2 22,-4Q30,-22 28,-34Q22,-46 8,-44L-12,-34Q-13,-26-4,-25Q6,-25 12,-19Q18,-2 42,8Q54,20 46,36Q30,46 4,44Q-20,46-36,40Z',
    );
    let wool = '';
    for (let y = 8; y <= 40; y += 6)
      for (let x = -38; x <= 44; x += 8)
        if (((x - 4) / 42) ** 2 + ((y - 24) / 18) ** 2 < 0.9) wool += `M${x + (y % 4) * 2},${y}a4,4 0 0 0 8,0`;
    r += ln(wool, 0.8, 0.8) + ln('M-38,22q-8,2-8,10', 1.4);
    r += ln(spiral(18, -36, 12, 1.3, -110), 3) + ln('M-30,42L-8,50L-3,44M36,40L58,46L62,40M24,42L44,50L48,45', 1.4);
    o += `<g transform="translate(0 4) scale(1.12)">${r}${dot(2, -36, 1.4)}</g>`;
    return at(cx, cy, o + sky(p, 'ram', [0]));
  },
  crab(cx, cy) {
    const p = place('crab', 7, 180, 0, 6, -1);
    let o = ln('M-14,-58V-72A14,14 0 0 1 14,-72V-58', 1, 0.7);
    for (let i = 0; i < 16; i++) {
      const t = i / 16;
      o += dot(Math.sin(t * 9) * 6 * (1 - t), -98 + t * 92, 0.5 + t, 0.3 + t * 0.6);
    }
    for (const s of [-1, 1]) {
      let legs = `M${s * 22},-12L${s * 38},-30L${s * 44},-50`;
      for (let i = 0; i < 4; i++)
        legs += `M${s * 30},${6 + i * 6}L${s * (52 + i * 3)},${-2 + i * 12}L${s * (60 + i * 2)},${18 + i * 14}`;
      o += ln(legs, 1.8);
      o += body(`M${s * 40},-50Q${s * 30},-74 ${s * 52},-80Q${s * 44},-66 ${s * 50},-56Z`, 0.05);
      o += body(`M${s * 46},-50Q${s * 62},-56 ${s * 62},-72Q${s * 56},-58 ${s * 47},-52Z`, 0.05);
    }
    o += body('M-34,4Q-36,-16 0,-18Q36,-16 34,4Q30,28 0,30Q-30,28-34,4Z', 0.05);
    o += ln('M-22,-8Q0,-14 22,-8M-24,18Q0,26 24,18', 0.6, 0.5) + sky(p, 'crab', [1, 2, 4]);
    const r = rng(17);
    for (const R of [16, 10, 5]) o += dot(0, 6, R, 0.1);
    for (let i = 0; i < 40; i++) {
      const a = r() * 7;
      const d = r() * r() * 14;
      o += dot(Math.cos(a) * d, 6 + Math.sin(a) * d, 0.4 + r() * 0.7, 0.5 + r() * 0.5);
    }
    return at(cx, cy, o);
  },
  maiden(cx, cy) {
    const p = place('maiden', 4, 158, 36, -80);
    let o = '';
    for (let k = 0; k < 4; k++)
      o += dash(`M-100,${60 + k * 9}Q0,${44 + k * 11} 100,${60 + k * 9}`, 0.7, 0.5 - k * 0.08);
    for (let i = 7; i >= 0; i--) {
      const t = 0.18 + i * 0.11;
      const [x, y] = [
        -6 * (1 - t) ** 2 - 72 * t * (1 - t) - 76 * t * t,
        -38 * (1 - t) ** 2 - 156 * t * (1 - t) - 66 * t * t,
      ];
      const a = (104 + i * 9) * rad;
      const [c, s, L] = [Math.cos(a), Math.sin(a), 22 + i * 4];
      o += body(
        `M${f(x + s * 4)},${f(y - c * 4)}Q${f(x + c * L * 0.6 + s * 4)},${f(y + s * L * 0.6 - c * 4)} ${f(x + c * L)},${f(y + s * L)}Q${f(x + c * L * 0.6 - s * 4)},${f(y + s * L * 0.6 + c * 4)} ${f(x - s * 4)},${f(y + c * 4)}Z`,
      );
    }
    o += ln('M-6,-38Q-36,-78-76,-66', 2.4);
    o += body('M-6,-44Q-16,-30-18,-8Q-24,30-38,66Q-14,60 0,68Q14,60 28,64Q14,30 10,-8Q8,-30 4,-44Z');
    o += ln('M-16,-22Q-4,-18 10,-22M-8,-18Q-14,20-26,62M2,-18Q2,24-2,64M8,-12Q10,30 18,62', 0.7, 0.6);
    o += body('M-4,-60a8,8 0 1 0 0.1,0Z') + ln('M-9,-60Q-28,-54-22,-30M-6,-58Q-18,-48-16,-36', 1, 0.8);
    o += ln('M4,-40Q20,-46 26,-62', 2.2) + ln('M14,-30Q30,-64 40,-96', 1.1);
    let [ear, awn] = ['', ''];
    for (let j = 0; j < 7; j++) {
      const [x, y] = [30 + j * 1.6, -71 - j * 4];
      for (const s of [-1, 1]) {
        ear += `M${f(x + s * 1.6)},${f(y + 2)}l${f(1 + s * 1.4)},-4`;
        awn += `M${f(x + s * 3)},${f(y - 3)}l${f(s * 3 + 2)},-9`;
      }
    }
    o += ln(ear, 3) + ln(awn, 0.5, 0.8);
    return at(cx, cy, o + sky(p, 'maiden', [], [0]));
  },
  scales(cx, cy) {
    let o = `<path d="M0,-100A100,100 0 0 0 0,100Z" fill="${SHADE}" opacity=".5"/><path d="M0,-100A100,100 0 0 1 0,100Z" fill="${CREAM}" opacity=".05"/>`;
    o += sky(place('scales', 5, 0, -6, 20), 'scales', [1]);
    o += ln(rays(0, -74, 14, 24, 8, true), 1.1) + `<circle cy="-74" r="6" fill="${CREAM}"/>`;
    for (let i = 0; i < 8; i++) o += sparkle(Math.cos(i * 0.785) * 10, -74 + Math.sin(i * 0.785) * 10, 1.8, GOLD);
    o += ln('M0,-62V-40', 1.6, 1, GOLD, ' stroke-dasharray="2.5 1.5"') + ln('M-64,-38H64', 2.2);
    o += ln('M-64,-38L-84,10M-64,-38L-44,10M64,-38L84,10M64,-38L44,10', 0.8, 0.8);
    o += dot(0, -38, 3, 1, GOLD) + dot(-64, -38, 2, 1, GOLD) + dot(64, -38, 2, 1, GOLD);
    for (const s of [-1, 1]) {
      o += body(`M${s * 88},10Q${s * 64},30 ${s * 40},10Z`, 0.9);
      o += dash(
        `M${s * 64},96V46M${s * 64},46Q${s * 50},40 ${s * 46},26M${s * 64},46Q${s * 78},40 ${s * 82},26`,
        1.2,
        0.4,
      );
    }
    o += `<path d="M-64,8C-76,0-72,-14-64,-8C-56,-14-52,0-64,8Z" fill="${VERM}" stroke="${GOLD}" stroke-width=".8"/>`;
    let barbs = '';
    for (let i = 0; i < 6; i++)
      barbs += `M${f(64 + i * 0.4)},${-i * 5 + 4}l-6,-4M${f(64 + i * 0.4)},${-i * 5 + 4}l6,-5`;
    o +=
      `<path d="M64,8Q54,-12 66,-30Q74,-12 64,8Z" fill="${CREAM}" opacity=".85"/>` +
      ln(`M64,8Q62,-10 66,-30${barbs}`, 0.6, 0.8, LAPIS);
    return at(cx, cy, o);
  },
  goatfish(cx, cy) {
    const p = place('goatfish', 5, 0, -58, -4);
    let o = body('M14,-44L46,-82L60,-66L70,-74L104,-30Z', 0.25);
    o += sparkle(46, -90, 4, CREAM);
    o += dash(
      smooth([
        [-78, 50],
        [-92, -10],
        [-50, -64],
        [10, -86],
        [44, -92],
      ]),
      1,
      0.55,
      CREAM,
    );
    let g = body(
      'M52,-30L40,-42Q28,-40 24,-28Q4,-10-24,-2Q-54,8-58,32Q-60,54-40,54Q-26,52-30,40Q-38,46-44,38Q-48,24-36,16Q-20,8-2,14Q18,12 32,-8Q44,-16 46,-22Z',
    );
    g += body('M-30,40L-18,30L-20,44Z', 0.9);
    let sc = '';
    for (let x = -50; x < -6; x += 6) for (let y = 4; y < 34; y += 6) sc += `M${x},${y + (x % 4)}a3,3 0 0 0 4,0`;
    g += ln(sc, 0.6, 0.45, CREAM);
    g +=
      ln('M36,-42Q22,-74-2,-66M40,-42Q32,-70 12,-74', 2.4) + ln('M48,-26l-2,8M30,-6L46,4L56,-2M22,2L36,16L46,14', 1.6);
    o += `<g transform="translate(-6 10)">${g}${dot(41, -36, 1.3)}</g>` + waves(52, 4, true, 10);
    return at(cx, cy, o + sky(p, 'goatfish', [5]));
  },
  waterbearer(cx, cy) {
    const p = place('waterbearer', 3.9, 0, 40, -44, -1, 3);
    let o = ln('M28,-37Q-30,-36-26,24', 8, 0.18, TEAL) + along(28, -37, -30, -36, -26, 24, 22, 5);
    o += ln('M30,-34Q66,-10 56,58M34,-32Q72,-6 62,58', 1, 0.6, TEAL);
    o += ln('M14,84Q44,62 92,52M40,74l4,8M70,62l-2,10l6,6M84,58l4,6', 1.1, 0.8);
    o += ln('M58,62Q58,52 56,44M56,50q-8,-2 -10,-8M57,48q8,-4 10,-10', 1, 0.9, TEAL);
    o += fish(-52, 48, 1.9, -40) + sparkle(-26, 26, 4.5, VERM);
    o += `<g transform="translate(44 -46) rotate(-120) scale(.85)">${body('M-6,-22L6,-22L5,-16Q22,-8 18,10Q14,24 0,28Q-14,24-18,10Q-22,-8-5,-16Z')}${ln('M5,-14Q16,-20 16,-6M-5,-14Q-16,-20-16,-6M-17,0H17M-15,12H15M-16,6l4,-4l4,4l4,-4l4,4l4,-4l4,4l4,-4', 1, 0.8)}</g>`;
    return at(cx, cy, o + sky(p, 'waterbearer', [0]));
  },
  fishes(cx, cy) {
    const p = place('fishes', 3, -30, -50, 54, 1, 0);
    let o = dust(0, -10, 21, 50);
    for (let k = 0; k < 3; k++)
      o += ln(`M${-106 + k * 10},${68 + k * 9}q20,-6 40,0${' t40,0'.repeat(5)}`, 0.8, 0.5 - k * 0.12, TEAL);
    for (const idx of [
      [0, 3, 4, 5, 6],
      [0, 1, 2],
    ]) {
      const d = smooth(idx.map((i) => p[i]!));
      o += ln(d, 3.6) + ln(d, 1.8, 1, LAPIS) + ln(d, 3.6, 0.9, GOLD, ' stroke-dasharray="1 4"');
    }
    const [a, b] = [p[1]!, p[2]!];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    o += fish(b[0] + Math.cos(ang) * 32, b[1] + Math.sin(ang) * 32, 1.5, ang / rad, sparkle(2, -8, 3, CREAM));
    const c = p.slice(6).reduce((s, q) => [s[0] + q[0] / 4, s[1] + q[1] / 4], [0, 0]);
    const ang2 = Math.atan2(c[1] - p[5]![1], c[0] - p[5]![0]);
    o += fish(c[0], c[1], 1.4, ang2 / rad, sparkle(2, -8, 2, CREAM));
    o += ln(`M${f(p[0]![0] - 6)},${f(p[0]![1])}a6,4 30 1 0 12,0a6,4 30 1 0 -12,0`, 1.4);
    return at(cx, cy, o + sky(p, 'fishes', [2], [0], []));
  },
  southernfish(cx, cy) {
    const p = place('southernfish', 6, 143, 36, -22, 1, 0);
    let o = ln('M78,-104Q60,-50 38,-24', 8, 0.2, TEAL) + along(78, -104, 60, -50, 38, -24, 12, 9);
    for (let k = 1; k < 4; k++)
      o += ln(
        `M${16 - k * 8},${-36 - k * 4}a${k * 12},${k * 5} -40 0 0 ${30 + k * 16},${k * 4}`,
        0.7,
        0.6 - k * 0.12,
        TEAL,
      );
    let sc = '';
    for (let x = -10; x < 12; x += 4) for (let y = -5; y <= 5; y += 3.3) sc += `M${x},${f(y)}a2,2 0 0 1 0,3`;
    o += fish(0, 6, 2.6, -40, ln(sc, 0.3, 0.5, CREAM));
    o += fish(-56, -30, 0.8, 200) + fish(-26, -62, 0.8, -30) + waves(60, 3);
    return at(cx, cy, o + sky(p, 'southernfish', [], [0]));
  },
  whale(cx, cy) {
    const p = place('whale', 3.2, 0, 44, 30);
    const seg = (ix: number[]) => smooth(ix.map((i) => p[i]!));
    const turn = (a: Pt, b: Pt, s: number, d: string) =>
      `<g transform="translate(${f(b[0])} ${f(b[1])}) rotate(${f(Math.atan2(b[1] - a[1], b[0] - a[0]) / rad)}) scale(${s} ${b[0] < a[0] ? -s : s})">${d}</g>`;
    let o =
      body('M-110,30Q-84,20-62,36Q-50,44-42,56H-110Z') + body('M-86,25a4,2.6 0 1 0 0.1,0M-72,27a3,2 0 1 0 0.1,0', 0.9);
    o += waves(50, 4, true);
    o += tube([
      [seg([1, 0, 2]), 6],
      [seg([0, 2, 3, 4]), 15],
      [seg([4, 6, 7, 8, 9]), 9],
    ]);
    o += turn(p[0]!, p[1]!, 1.2, body('M-2,0L10,-12L6,0L10,12Z', 0.9));
    o += turn(p[3]!, p[2]!, 1, body('M0,-6L10,-18L14,-6Z', 0.9));
    o += turn(
      p[8]!,
      p[9]!,
      1.5,
      body('M-4,-6Q10,-9 20,-3L10,0L20,4Q8,8-4,6Z', 0.9) + ln('M-2,-6l2,-6l3,5l3,-6l2,6', 0.7) + dot(6, -3, 1),
    );
    o += sky(p, 'whale', [0]);
    const [x, y] = p[6]!;
    for (let i = 0; i < 9; i++) {
      const a = (200 + i * 18) * rad;
      o += dot(x + Math.cos(a) * 14, y + Math.sin(a) * 14, 0.4 + Math.sin((i / 8) * Math.PI * 2 + 1.6) ** 2 * 1.2, 0.8);
    }
    return at(cx, cy, o + moonDisc(f(x), f(y), 4.5, { age: 7.38, pct: 50, waxing: true, name: '' }, CREAM, SHADE));
  },
  river(cx, cy) {
    const p = place('river', 3.8, 0, 12, 10);
    const d = smooth([...p, [44, 70], [60, 110]]);
    let o = tube([[d, 16]], TEAL, 0.35) + ln(d, 0.7, 0.5, CREAM, ' stroke-dasharray="4 6"');
    const [w0, w1] = [p[0]![0] - 14, p[0]![1] - 14];
    o += `<g transform="translate(${f(w0)} ${f(w1)}) rotate(-20)">${ln(rays(0, 0, 3, 16, 9), 1.1)}${ln('M12,-6A13,13 0 1 1 6,-11.5', 1.6)}</g>`;
    o += ln(`M${f(w0 + 10)},${f(w1 - 8)}q14,-20 30,-10t26,-16M${f(w0 + 12)},${f(w1 - 4)}q18,-14 34,-4`, 0.7, 0.7);
    o += sparkle(p[0]![0] - 6, p[0]![1] + 12, 4, CREAM);
    o +=
      `<path d="M66,-94L16,-20L80,-84Z" fill="${VERM}" opacity=".85"/>` +
      ln('M72,-88L18,-22', 0.8, 0.8, CREAM) +
      sparkle(18, -22, 4, CREAM);
    for (const [x, y] of [
      [-30, -12],
      [40, 26],
      [-8, 30],
    ])
      o += ln(`M${x},${y}V${y! - 14}M${x},${y! - 14}l-4,-4M${x},${y! - 14}l4,-4M${x},${y! - 14}v-5`, 0.8, 0.8);
    return at(cx, cy, o + sky(p, 'river', [4]));
  },
  dolphin(cx, cy) {
    const p = place('dolphin', 18, 0, 34, -26, -1, 0);
    let o = ln(`M-104,40${' l8,-7 l8,7'.repeat(7)}M-96,50${' l8,-6 l8,6'.repeat(6)}`, 1.1, 0.8, TEAL);
    o += ln('M8,44H96M18,54H92M28,64H86', 0.8, 0.5, TEAL);
    o += body('M-90,32L-58,32L-64,40L-84,40Z') + ln('M-74,32V4M-74,6L-60,28H-74', 0.9, 0.85);
    o += body('M-56,16Q-44,-34-4,-44Q30,-48 46,-24Q52,-16 60,-10L60,-6Q48,-8 40,-6Q30,-20 6,-26Q-30,-24-48,22Z');
    o += body('M-52,18Q-66,6-72,10Q-62,16-58,24Q-62,34-54,40Q-52,28-50,22Z', 0.9);
    o += body('M-8,-44Q-12,-56-2,-58Q-2,-50 6,-44Z', 0.9) + body('M18,-24Q14,-12 24,-8Q22,-18 28,-24Z', 0.9);
    o += dot(38, -26, 1.3) + ln('M44,-24Q40,-14 46,-8', 0.6, 0.6);
    o += `<g transform="translate(-14 -52) rotate(-20)">${ln('M-8,-18Q-12,-4 0,0Q12,-4 8,-18M-10,-14H10M-4,-14V-2M0,-14V0M4,-14V-2', 1.1)}</g>`;
    return at(cx, cy, o + sky(p, 'dolphin', [0]));
  },
} satisfies Record<string, Drawer>;
