import { FIGURES, type FigureId } from '../../lib/sky-dome';
import { f, rng } from '../../lib/svg';
import { constellation, CREAM, dust, GOLD, LAPIS, MUTED, SHADE, sparkle, TEAL, VERM, type Drawer } from './ink';

type Pt = [number, number, number];
const RAD = Math.PI / 180;

function proj(id: FigureId, x: number, y: number, R: number, rot = 0, flip = 1, at = -1): Pt[] {
  const fig = FIGURES[id];
  const v = fig.stars.map(([a, d]) => [
    Math.cos(d * RAD) * Math.cos(a * RAD),
    Math.cos(d * RAD) * Math.sin(a * RAD),
    Math.sin(d * RAD),
  ]);
  let sx = 0;
  let sy = 0;
  let sz = 0;
  for (const q of v) {
    sx += q[0]!;
    sy += q[1]!;
    sz += q[2]!;
  }
  const h = Math.hypot(sx, sy);
  const m = Math.hypot(sx, sy, sz) * h;
  const cr = Math.cos(rot * RAD);
  const sr = Math.sin(rot * RAD);
  const p = v.map(([a, b, c]) => {
    const u = (a! * sy - b! * sx) / h;
    const w = (flip * (a! * sz * sx + b! * sz * sy - c! * h * h)) / m;
    return [u * cr - w * sr, u * sr + w * cr] as const;
  });
  const xs = p.map((q) => q[0]);
  const ys = p.map((q) => q[1]);
  const s = (2 * R) / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const ox = at < 0 ? (Math.max(...xs) + Math.min(...xs)) / 2 : p[at]![0];
  const oy = at < 0 ? (Math.max(...ys) + Math.min(...ys)) / 2 : p[at]![1];
  return p.map(([u, w], i) => [f(x + (u - ox) * s), f(y + (w - oy) * s), i === fig.center ? 1.9 : 1.2]);
}

const sky = (id: FigureId, p: Pt[], accent: number[] = []) => constellation(0, 0, p, FIGURES[id].lines, accent);
const g = (cx: number, cy: number, s: string) => `<g transform="translate(${cx} ${cy})">${s}</g>`;
const L = (d: string, c = GOLD, w = 1, o = 1) =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${o}" stroke-linecap="round" stroke-linejoin="round"/>`;
const C = (x: number, y: number, r: number, c = GOLD, o = 1) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${c}" opacity="${o}"/>`;
const ring = (x: number, y: number, r: number, c = GOLD, w = 0.6, o = 0.6, dash = '') =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${o}"${dash && ` stroke-dasharray="${dash}"`}/>`;
const tube = (d: string, w = 7) =>
  L(d, GOLD, w + 1.6, 0.85) +
  L(d, LAPIS, w) +
  `<path d="${d}" fill="none" stroke="${CREAM}" stroke-width="${w - 3}" stroke-dasharray="1 3" opacity=".35"/>`;
const limb = (d: string, w = 5) => L(d, GOLD, w + 1.4) + L(d, LAPIS, w) + L(d, CREAM, w, 0.15);
const solid = (d: string, c = CREAM, o = 0.15) =>
  `<path d="${d}" fill="${LAPIS}" stroke="${GOLD}" stroke-width=".8" stroke-linejoin="round"/><path d="${d}" fill="${c}" opacity="${o}"/>`;
const person = (limbs: string, torso: string, hx: number, hy: number, folds = '') =>
  limb(limbs) +
  solid(torso, SHADE, 0.8) +
  solid(`M${hx - 6},${hy}a6,6 0 1 0 12,0a6,6 0 1 0 -12,0`, SHADE, 0.8) +
  L(folds, GOLD, 0.6, 0.8);
const waves = (x: number, y: number) =>
  [0, 1, 2].map((k) => L(`M${x},${y + k * 7}q8,-5 16,0t16,0t16,0t16,0`, TEAL, 0.8, 0.7 - k * 0.2)).join('');
const at = (x: number, y: number, s: number, body: string, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${body}</g>`;
const HEAD =
  'M-20,34C-18,8 -12,-8 -2,-16L0,-26 5,-17C10,-14 18,-4 24,5C28,9 27,14 22,14C18,14 14,11 10,8C6,12 6,24 10,36Z';
const horseHead = (c: string) =>
  solid(HEAD, c, 0.6) + L('M-4,-14Q-12,2 -16,24M-8,-12Q-16,2 -20,20', GOLD, 0.6) + C(8, -7, 1.3, CREAM);
const GOAT =
  'M12,-8Q0,-10 -9,-8L-13,-15Q-17,-16 -20,-11L-17,-9 -15,-4 -11,-5Q-10,0 -8,2L-9,10H-7L-5,3H6L8,10H10L10,2Q14,0 12,-8Z';
const goat = (x: number, y: number, s: number) =>
  at(x, y, s, solid(GOAT, CREAM, 0.4) + L('M-14,-15Q-10,-24 -3,-20M12,-8l3,-3', GOLD, 1));

export const FIGURE_ART = {
  crow(cx, cy) {
    let o = dust(0, 0, 61, 26);
    o += L('M-100,-44Q-74,-52 -50,-80', GOLD, 1.2, 0.8);
    o += `<ellipse cx="-70" cy="-62" rx="10" ry="4.5" fill="none" stroke="${GOLD}" stroke-width=".7" transform="rotate(-50 -70 -62)"/>`;
    for (const [x, y] of [
      [-84, -46],
      [-62, -66],
    ])
      o += L(`M${x},${y}l2,8`, GOLD, 0.6) + C(x + 2, y + 12, 4.5, VERM, 0.85);
    for (const x of [44, 64]) o += L(`M${x},-70q5,-5 10,0q5,-5 10,0`, CREAM, 0.8, 0.7);
    o += C(54, -63, 2.2, CREAM, 0.8);
    o += tube('M-105,40C-70,14 -50,60 -10,40S46,22 70,34S96,30 106,18');
    o += solid(
      'M-80,24L-66,14Q-60,-4 -42,-6Q-30,-14 -20,-24Q-12,-30 -6,-28L6,-26 -6,-22Q-12,-14 -22,-2Q-30,14 -46,18L-62,22Z',
      LAPIS,
      1,
    );
    o += L('M-44,18l-2,12M-36,15l1,15M-60,8Q-46,0 -32,4', GOLD, 0.7) + C(-9, -26, 1.1, CREAM);
    o += solid('M30,-14H66Q64,8 48,12Q32,8 30,-14ZM44,12V20H52V12ZM38,26H58L52,20H44Z', GOLD, 0.4);
    o += L('M30,-10Q18,-8 32,2M66,-10Q78,-8 64,2M33,-4H63', GOLD, 1);
    o += `<ellipse cx="48" cy="-14" rx="18" ry="3" fill="${TEAL}" opacity=".85"/>`;
    return g(cx, cy, o + sky('crow', proj('crow', 0, -6, 64), [8]));
  },
  polestar(cx, cy) {
    const p = proj('polestar', 0, -30, 42, 30, 1, 0);
    const [px, py] = p[0]!;
    const r = rng(17);
    let o = '';
    for (let i = 0; i < 30; i++) {
      const R = 9 + i * 3.4;
      const a0 = r() * 6.3;
      const a1 = a0 + 0.4 + r() * 1.3;
      const [x1, y1] = [px + Math.cos(a1) * R, py + Math.sin(a1) * R];
      o += L(
        `M${f(px + Math.cos(a0) * R)},${f(py + Math.sin(a0) * R)}A${f(R)},${f(R)} 0 0 1 ${f(x1)},${f(y1)}`,
        i % 7 ? CREAM : TEAL,
        0.5 + r() * 0.6,
        0.25 + r() * 0.4,
      );
      o += C(x1, y1, 0.6 + r(), CREAM, 0.8);
    }
    o += `<path d="M${px},${py}V70" stroke="${GOLD}" stroke-width=".6" stroke-dasharray="2 4"/>`;
    for (let x = -100; x < 104; x += 10) {
      const t = 50 + r() * 14 + Math.abs(x) * 0.1;
      if (Math.abs(x) > 20)
        o += solid(
          `M${x - 7},80L${x - 3},${t + 16}H${x - 6}L${x},${t}L${x + 6},${t + 16}H${x + 3}L${x + 7},80Z`,
          LAPIS,
          1,
        );
    }
    o += ring(px, py, 8, GOLD, 0.6, 0.7) + ring(px, py, 13, GOLD, 0.4, 0.4);
    return g(cx, cy, o + sky('polestar', p) + sparkle(px, py, 10, GOLD) + C(px, py, 2, CREAM));
  },
  dragon(cx, cy) {
    let o = ring(70, -78, 74, GOLD, 0.6, 0.45, '2 4');
    o += solid('M-6,60Q-2,30 -4,-6H4Q2,30 6,60Z', GOLD, 0.3);
    o += L('M0,-6Q-14,-20 -24,-34M0,-6Q12,-22 22,-36M0,-6V-44', GOLD, 1.4, 0.8);
    o += `<circle cx="0" cy="-36" r="32" fill="${SHADE}" opacity=".55" stroke="${GOLD}" stroke-width=".6"/>`;
    for (let i = 0; i < 11; i++) {
      const a = i * 2.4;
      const d = 6 + (i % 4) * 7;
      o +=
        C(Math.cos(a) * d, -36 + Math.sin(a) * d, 3.4) + C(Math.cos(a) * d - 1, -37 + Math.sin(a) * d, 1, CREAM, 0.8);
    }
    o += tube(
      'M-96,-30Q-70,-80 -50,-40Q-30,0 -40,30Q-46,56 -10,52Q30,48 26,30Q22,14 -16,18Q-40,22 -28,4Q-12,-12 30,-6Q66,0 70,-30',
      6,
    );
    o += at(
      70,
      -30,
      1.4,
      solid('M-4,2L-2,-12 12,-22 8,-10 22,-12 8,2Z', LAPIS, 1) +
        C(7, -13, 1.2, VERM) +
        L('M22,-12l6,-2M22,-12l5,3', VERM, 0.7),
    );
    o += sparkle(-62, -64, 4, VERM) + sparkle(13, -88, 3, GOLD);
    return g(cx, cy, o + sky('dragon', proj('dragon', -6, -4, 76), [8]));
  },
  crown(cx, cy) {
    const p = proj('crown', 0, -40, 44);
    const pts = p.map((q) => `${q[0]},${q[1]}`).join('L');
    let o = '';
    o += `<path d="M${pts}Z" fill="${GOLD}" opacity=".1"/>` + L(`M${pts}`, GOLD, 2.2, 0.75);
    p.forEach(([x, y], i) => {
      o += L(`M${x},${y}L${f(x * 1.15)},${f(y - 16)}`, GOLD, 1, 0.7) + C(x * 1.15, y - 18, 1.6);
      o += C(x, y, i === 2 ? 5 : 3.2, i === 2 ? VERM : CREAM) + ring(x, y, i === 2 ? 8 : 5.5, GOLD, 0.5, 0.6);
    });
    let s = 'M-44,40';
    for (let t = 0; t < 60; t++) s += `L${f(-44 + Math.cos(t * 0.3) * t * 0.4)},${f(40 + Math.sin(t * 0.3) * t * 0.3)}`;
    o += L(`${s}Q-10,10 30,24T70,30`, CREAM, 0.8, 0.8);
    o += waves(30, 50);
    o += solid('M50,44Q64,52 84,44Z', GOLD, 0.3) + solid('M68,44V18L82,40Z', LAPIS, 1);
    return g(cx, cy, dust(0, 0, 7, 30) + o);
  },
  kneeler(cx, cy) {
    let o = dust(0, 0, 23, 24);
    for (let k = 0; k < 5; k++)
      o += L(`M-100,${56 + k * 6}Q0,${48 + k * 7} 100,${56 + k * 6}`, GOLD, 0.5, 0.5 - k * 0.07);
    o += `<circle cx="-4" cy="-70" r="20" fill="${MUTED}" opacity=".25" stroke="${GOLD}" stroke-width=".7"/>`;
    for (let k = -2; k <= 2; k++) o += L(`M${k * 7 - 10},-86Q${k * 8},-70 ${k * 7 - 6},-52`, GOLD, 0.4, 0.4);
    o += person(
      'M8,-22L18,-36 14,-52M-14,-22L-26,-36 -20,-52M4,10L24,14 26,48 34,50M-10,10L-16,48 -44,50',
      'M-8,-28Q-2,-30 5,-28Q11,-26 10,-18L7,-2Q16,4 18,16Q4,20 -16,16Q-16,4 -14,-2L-16,-18Q-15,-27 -8,-28Z',
      -2,
      -35,
      'M-14,-2H7M-4,0L-6,17',
    );
    o +=
      solid('M30,50Q40,40 52,48L46,54Q38,52 32,56Z', LAPIS, 1) + C(44, 47, 1.1, VERM) + tube('M50,52Q74,62 104,50', 4);
    return g(cx, cy, o + sky('kneeler', proj('kneeler', -6, -6, 50, 180), [0]));
  },
  serpentbearer(cx, cy) {
    let o = dust(0, 0, 41, 24);
    for (let i = 0; i < 9; i++) {
      const a = 1.57 - (i - 4) * 0.7;
      o +=
        i < 5
          ? C(-30 + i * 9, 60, 4.4 - i * 0.3, VERM, 0.55)
          : C(8 + Math.cos(a) * 12, 48 + Math.sin(a) * 12, 3 - (i - 5) * 0.4, VERM, 0.55);
    }
    o += L('M-32,58q-6,-10 -16,-8l4,4M-32,62q-6,10 -16,8l4,-4', VERM, 1.2, 0.7) + sparkle(2, 38, 3.5, VERM);
    o += person(
      'M-24,-46L-34,-28 -42,-10M4,-46L16,-38 24,-26M-20,20L-24,54M0,20L6,54',
      'M-16,-51Q-10,-53 -4,-51Q4,-50 5,-44L3,-12Q12,4 14,22Q-10,26 -34,22Q-32,4 -23,-12L-25,-44Q-24,-50 -16,-51Z',
      -10,
      -58,
      'M-23,-12H3M-12,-10L-16,22M-4,-10L-2,22',
    );
    o += tube('M-104,24Q-70,-20 -42,-10Q-20,0 0,-20Q12,-32 24,-26Q40,-14 54,-46', 5);
    o += solid('M52,-44L58,-56 64,-48Z', LAPIS, 1) + L('M60,-56q4,-8 10,-10M64,-62q4,2 8,0', TEAL, 1.2, 0.9);
    let s = 'M80,56';
    for (let y = 56, k = 1; y > -56; y -= 16, k = -k) s += `Q${80 + k * 20},${y - 8} 80,${y - 16}`;
    o += tube(s, 3.4) + L('M80,-80V60', GOLD, 1.6) + C(80, -62, 3, TEAL);
    return g(cx, cy, o + sky('serpentbearer', proj('serpentbearer', -10, -4, 52)));
  },
  berenice(cx, cy) {
    let o = '';
    o += L('M-78,66V0M-14,66V0M-84,0L-46,-18 -8,0Z', GOLD, 1.2, 0.45);
    o +=
      solid('M-66,66H-26V60H-30V40H-62V60H-66ZM-68,34H-24V40H-68Z', GOLD, 0.15) +
      L('M-68,34q-4,0 -4,-6M-24,34q4,0 4,-6', GOLD, 1);
    o += L('M-60,32Q-50,24 -34,30', GOLD, 2.4, 0.9);
    const r = rng(9);
    for (let k = 0; k < 9; k++) {
      const e = k * 4 - 16;
      o += L(
        `M-46,28C${-40 + e},-20 ${10 + e},${10 - e} ${50 + e * 0.6},${-60 - e}`,
        k % 3 ? CREAM : GOLD,
        0.6,
        0.4 + r() * 0.3,
      );
    }
    for (let i = 0; i < 46; i++) {
      const t = 0.3 + r() * 0.7;
      o += C(-46 + t * 100 + r() * 30 - 15, 26 - t * 90 + r() * 30 - 15, 0.4 + r() * 1.2 * t, CREAM, 0.4 + r() * 0.6);
    }
    o += at(
      -12,
      60,
      1,
      L('M0,0l14,-8M0,-6l14,8', GOLD, 1) + ring(-3, 1, 3, GOLD, 1, 1) + ring(-3, -7, 3, GOLD, 1, 1),
      -10,
    );
    return g(cx, cy, o + sky('berenice', proj('berenice', 50, -50, 26), [1]));
  },
  hero(cx, cy) {
    let o = dust(0, 0, 13, 20);
    for (let k = 0; k < 4; k++) o += ring(46, -16, 34 - k * 6, GOLD, k ? 0.6 : 1.4, 0.8 - k * 0.12);
    o += `<circle cx="46" cy="-16" r="34" fill="${GOLD}" opacity=".1"/>`;
    const gorgon = (x: number, y: number, op: number) => {
      let s = C(x, y, 8, CREAM, op * 0.4);
      for (let i = 0; i < 9; i++) {
        const a = i * 0.7 - 0.4;
        s += L(
          `M${f(x + Math.cos(a) * 8)},${f(y - Math.sin(a) * 8)}q${f(Math.cos(a + 1) * 6)},${f(-Math.sin(a + 1) * 6)} ${f(Math.cos(a) * 12)},${f(-Math.sin(a) * 12)}`,
          TEAL,
          0.8,
          op,
        );
      }
      return s;
    };
    o += gorgon(-70, 0, 1) + gorgon(46, -16, 0.45);
    o += solid('M-12,-38Q-34,-30 -42,-4Q-30,-14 -16,-12Z', GOLD, 0.25);
    o += person(
      'M-12,-34L-40,-20 -62,-4M6,-34L18,-22M-10,14L-22,34-34,52M2,14L12,32 18,52',
      'M-10,-40Q-3,-42 4,-40Q8,-38 8,-32L5,-6Q10,6 12,16Q-4,19 -20,15Q-16,4 -14,-6L-14,-32Q-14,-40 -10,-40Z',
      -3,
      -47,
      'M-14,-6H5M-6,-4L-6,17',
    );
    o += C(-72, 52, 6, MUTED, 0.5) + C(-58, 60, 4, MUTED, 0.5) + C(-84, 38, 4, MUTED, 0.5);
    return g(cx, cy, o + sky('hero', proj('hero', -20, -6, 50), [1]));
  },
  horse(cx, cy) {
    const p = proj('horse', -6, -10, 60, 0, -1);
    const [a, b, c, d] = [p[1]!, p[0]!, p[2]!, p[3]!];
    let o = '';
    let w = 'M-14,-16Q-8,-60 -50,-86';
    let veins = '';
    for (let k = 1, px = -50, py = -86; k <= 6; k++) {
      const [x, y] = [-50 + (10 * k) / 6, -86 + (70 * k) / 6];
      w += `Q${f((px + x) / 2 - 14)},${f((py + y) / 2)} ${f(x)},${f(y)}`;
      veins += `M-14,-16L${f(x)},${f(y)}`;
      [px, py] = [x, y];
    }
    o += solid(`${w}Z`, CREAM, 0.3) + L(veins, GOLD, 0.5, 0.6);
    o += solid(
      'M-60,-6Q-36,-14 -16,-16Q0,-30 12,-50L14,-58 18,-50Q30,-46 40,-34Q42,-28 36,-26Q26,-28 20,-30Q16,-14 18,0Q22,10 30,14L46,22 52,40 46,42 40,26 24,22 14,28 26,36 22,42 8,34 0,26Q-30,30 -60,24Z',
      CREAM,
      0.2,
    );
    for (let k = 1; k < 5; k++) {
      const t = k / 5;
      o += L(
        `M${f(a[0] + (c[0] - a[0]) * t)},${f(a[1] + (c[1] - a[1]) * t)}L${f(b[0] + (d[0] - b[0]) * t)},${f(b[1] + (d[1] - b[1]) * t)}`,
        GOLD,
        0.5,
        0.5,
      );
    }
    for (let y = -4; y < 30; y += 9) o += C(-62, y, 8, CREAM, 0.12);
    o += solid('M30,62L44,40 66,36 82,48 92,70Z', LAPIS, 1);
    for (let k = 0; k < 5; k++) o += L(`M56,40Q${48 + k * 8},${10 + k * 2} ${40 + k * 14},${50 + k * 3}`, TEAL, 1, 0.8);
    return g(cx, cy, dust(0, 0, 3, 24) + o + sky('horse', p));
  },
  charioteer(cx, cy) {
    const p = proj('charioteer', -20, 0, 48);
    let o = ring(-20, 0, 50, GOLD, 1.4, 0.8) + ring(-20, 0, 8, GOLD, 1, 0.8);
    o += L('M-70,0H30M-20,-50V50M-55,-35L15,35M-55,35L15,-35', GOLD, 0.6, 0.5);
    o += L('M-20,0Q30,-10 86,-48M-20,0Q30,10 88,22', VERM, 0.8, 0.8);
    o += at(62, -50, 0.8, horseHead(CREAM)) + at(66, 18, 0.8, horseHead(SHADE));
    o += L('M-90,80V-40Q-90,-60 -76,-60Q-64,-60 -66,-48', GOLD, 1.4, 0.7);
    o +=
      goat(p[0]![0], p[0]![1] - 12, 1) +
      goat(p[6]![0] + 6, p[6]![1] - 6, 0.45) +
      goat(p[7]![0] + 10, p[7]![1] + 4, 0.45);
    return g(cx, cy, dust(0, 0, 5, 24) + o + sky('charioteer', p, [0]));
  },
  littlecloud(cx, cy) {
    const p = proj('littlecloud', 10, -30, 40, 0, 1, 0);
    const [x, y] = p[0]!;
    const r = rng(29);
    let o = '';
    for (let k = 1; k <= 7; k++)
      o += `<ellipse cx="${x}" cy="${y}" rx="${16 + k * 9}" ry="${7 + k * 4}" fill="none" stroke="${GOLD}" stroke-width="${k === 7 ? 1 : 0.5}" opacity="${f(0.7 - k * 0.05)}" stroke-dasharray="${k === 7 ? '' : '1 3'}" transform="rotate(-30 ${x} ${y})"/>`;
    let gal = `<ellipse rx="16" ry="6" fill="${CREAM}" opacity=".12"/><ellipse rx="6" ry="2.5" fill="${CREAM}" opacity=".5"/>`;
    for (let i = 0; i < 70; i++) {
      const t = r() * 3;
      const a = t * 2.2 + (i % 2) * Math.PI;
      gal += C(Math.cos(a) * (2 + t * 5), Math.sin(a) * (1 + t * 2), 0.3 + r() * 0.6, CREAM, 0.7);
    }
    o += at(x, y, 1, gal, -30);
    o += at(
      -14,
      18,
      0.8,
      solid(
        'M60,-4Q30,-30 -20,-22Q-44,-18 -56,-4L-76,-22Q-70,0 -76,22L-56,4Q-40,22 -10,24Q30,26 58,8L42,1Z',
        SHADE,
        0.3,
      ) +
        L('M28,-14Q22,0 28,14M0,-23Q-10,-38 -26,-20M-4,-8q4,6 0,12M-16,-8q4,6 0,12M8,-8q4,6 0,12', GOLD, 0.7) +
        C(40, -9, 2, GOLD),
      -40,
    );
    o += waves(28, 60);
    return g(cx, cy, dust(0, 0, 37, 50) + o + sky('littlecloud', p));
  },
} satisfies Record<string, Drawer>;
