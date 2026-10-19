import type { WoodArt, WoodCard } from '../../lib/decks';
import { esc, f, rng, uid } from '../../lib/svg';
import type { Wood } from '../../lib/wood-walk';
import { svgOpen } from '../book';

const G = 'var(--art-gold)';
const GP = 'var(--art-gold-pale)';
const MOON = 'var(--art-moon)';
const INK = 'var(--art-ink)';
const INK_DEEP = 'var(--art-ink-deep)';
const INK_LIGHT = 'var(--art-ink-light)';
const GLOW = 'var(--art-glow)';
const FELL_SC = "'IM Fell English SC',Georgia,serif";
const FELL = "'IM Fell English',Georgia,serif";

type Rand = () => number;

const figure = (x: number, y: number, s: number, fill: string) =>
  `<circle cx="${f(x)}" cy="${f(y - 22 * s)}" r="${f(3.4 * s)}" fill="${fill}"/><path d="M${f(x - 2.8 * s)},${f(y - 17.5 * s)} Q${f(x)},${f(y - 20.5 * s)} ${f(x + 2.8 * s)},${f(y - 17.5 * s)} L${f(x + 5.2 * s)},${f(y)} L${f(x - 5.2 * s)},${f(y)} Z" fill="${fill}"/>`;

const leafAt = (x: number, y: number, ang: number, len: number, w: number, op = 0.14) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})"><path d="M0,0 Q${f(len / 2)},${f(-w)} ${len},0 Q${f(len / 2)},${w} 0,0Z" fill="${G}" fill-opacity="${op}" stroke="${G}" stroke-width=".9"/><path d="M2,0 L${f(len - 3)},0" stroke="${G}" stroke-width=".5" opacity=".8"/></g>`;

function fireflies(r: Rand, n: number, x0: number, x1: number, y0: number, y1: number): string {
  let o = '';
  for (let i = 0; i < n; i++)
    o += `<circle cx="${f(x0 + r() * (x1 - x0))}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(0.8 + r() * 1.2)}" fill="${GP}" opacity="${f(0.4 + r() * 0.6)}"/>`;
  return o;
}

function spire(x: number, base: number, h: number, w: number, fill: string, stroke: string, op: number): string {
  let d = `M${f(x)},${f(base - h)}`;
  let y = base - h;
  while (y < base - 6) {
    const t = (y - (base - h)) / h;
    const hw = w * (0.15 + 0.85 * t);
    y += h / 7;
    d += ` L${f(x + hw)},${f(y)} L${f(x + hw * 0.55)},${f(y + 2)}`;
  }
  d += ` L${f(x + w * 0.5)},${f(base)} L${f(x - w * 0.5)},${f(base)}`;
  const left: Array<[number, number]> = [];
  let yy = base - h;
  while (yy < base - 6) {
    const t = (yy - (base - h)) / h;
    const hw = w * (0.15 + 0.85 * t);
    yy += h / 7;
    left.push([f(x - hw), f(yy)], [f(x - hw * 0.55), f(yy + 2)]);
  }
  for (const [px, py] of left.reverse()) d += ` L${px},${py}`;
  return `<path d="${d}Z" fill="${fill}" stroke="${stroke}" stroke-width=".7" opacity="${op}"/>`;
}

function spireRow(
  r: Rand,
  base: number,
  n: number,
  hmin: number,
  hmax: number,
  op: number,
  fill: string,
  x0 = 24,
  x1 = 256,
): string {
  let o = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + (i + r() * 0.8) * ((x1 - x0) / n);
    const h = hmin + r() * (hmax - hmin);
    o += spire(x, base, h, h * 0.34, fill, G, op);
  }
  return o;
}

function birch(x: number, y0: number, y1: number, w: number): string {
  let o = `<path d="M${f(x - w / 2)},${f(y1)} L${f(x - w / 2 + 1)},${f(y0)} L${f(x + w / 2 - 1)},${f(y0)} L${f(x + w / 2)},${f(y1)}Z" fill="${MOON}" opacity=".82"/>`;
  for (let y = y0 + 8; y < y1 - 6; y += 9 + ((y * 7) % 6))
    o += `<path d="M${f(x - w / 2)},${f(y)} h${f(w * (0.3 + ((y * 13) % 5) / 10))}" stroke="${INK}" stroke-width="1.6" opacity=".85"/>`;
  return `${o}<ellipse cx="${f(x + w * 0.15)}" cy="${f(y0 + (y1 - y0) * 0.55)}" rx="${f(w * 0.22)}" ry="${f(w * 0.5)}" fill="${INK}" opacity=".7"/>`;
}

function sprig(x: number, y: number, ang: number, len: number, op = 0.9): string {
  let o = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" stroke="${G}" fill="none" stroke-width=".8" opacity="${op}"><path d="M0,0 L${len},0"/>`;
  for (let i = 3; i < len - 1; i += 3.2) {
    const n = 4 + i * 0.08;
    o += `<path d="M${f(i)},0 l-1.6,-${f(n)} M${f(i)},0 l-1.6,${f(n)}"/>`;
  }
  return `${o}</g>`;
}

function cedarFan(x: number, y: number, ang: number, len: number): string {
  let o = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" stroke="${G}" fill="none" stroke-width=".8"><path d="M0,0 Q${f(len * 0.6)},2 ${len},${f(len * 0.35)}"/>`;
  for (let i = 4; i < len; i += 5) {
    const t = i / len;
    const yy = t * t * len * 0.35;
    o += `<path d="M${f(i)},${f(yy)} q3,-5 7,-6 M${f(i)},${f(yy)} q2,4 6,6"/>`;
  }
  return `${o}</g>`;
}

const mapleLeaf = (x: number, y: number, ang: number, s: number) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) scale(${s})"><path d="M0,0 L-2,-6 L-7,-5 L-5,-9 L-9,-13 L-4,-13 L-3,-18 L0,-14 L3,-18 L4,-13 L9,-13 L5,-9 L7,-5 L2,-6 Z" fill="${G}" fill-opacity=".16" stroke="${G}" stroke-width=".9"/><path d="M0,0 L0,-14 M0,-6 L-5,-9 M0,-6 L5,-9" stroke="${G}" stroke-width=".5"/></g>`;

const mist = (x: number, y: number, rx: number, ry: number, op: number) =>
  `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="${ry}" fill="${MOON}" opacity="${op}"/>`;

const ART: Record<WoodArt, () => string> = {
  darkWood() {
    const r = rng(5);
    let o =
      spireRow(r, 392, 5, 120, 200, 0.95, INK_DEEP, 26, 112) + spireRow(r, 392, 5, 120, 200, 0.95, INK_DEEP, 172, 258);
    o += `<circle cx="150" cy="232" r="30" fill="${GP}" opacity=".08"/><circle cx="150" cy="232" r="12" fill="${GP}" opacity=".22"/><circle cx="150" cy="232" r="3.5" fill="${GP}"/>`;
    o += `<path d="M108,392 Q132,300 147,240 L153,240 Q162,300 184,392 Z" fill="${GP}" opacity=".1"/><path d="M108,392 Q132,300 147,240 M184,392 Q162,300 153,240" fill="none" stroke="${G}" stroke-width=".8" opacity=".7"/>`;
    o += mist(140, 300, 120, 10, 0.08) + mist(90, 260, 70, 7, 0.07);
    o += `<circle cx="178" cy="94" r="15" fill="${GP}"/><circle cx="185" cy="89" r="13.5" fill="${INK_LIGHT}"/>`;
    return o + figure(146, 330, 1.7, GP) + fireflies(r, 9, 60, 220, 150, 330);
  },
  greenMan() {
    const cx = 140;
    const cy = 212;
    let o = '';
    for (let i = 0; i < 19; i++) {
      const a = -200 + i * (220 / 18);
      const rad = (a * Math.PI) / 180;
      o +=
        i % 5 === 2
          ? mapleLeaf(cx + Math.cos(rad) * 46, cy + Math.sin(rad) * 50, a + 90, 1.3)
          : sprig(cx + Math.cos(rad) * 36, cy + Math.sin(rad) * 42, a, 52, 0.9);
    }
    o += `<ellipse cx="140" cy="214" rx="40" ry="48" fill="${INK}" stroke="${G}" stroke-width=".6" opacity=".9"/>`;
    o += sprig(100, 190, -168, 34, 0.7) + sprig(180, 190, -12, 34, 0.7);
    o += `<path d="M110,203 Q122,194 134,203 Q122,210 110,203Z M146,203 Q158,194 170,203 Q158,210 146,203Z" fill="${GP}" fill-opacity=".2" stroke="${G}" stroke-width="1"/><circle cx="122" cy="203" r="2.6" fill="${GP}"/><circle cx="158" cy="203" r="2.6" fill="${GP}"/>`;
    o += `<path d="M140,206 Q134,226 139,233 Q146,234 148,229" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M128,246 Q140,240 152,246 Q140,254 128,246Z" fill="${INK_DEEP}" stroke="${G}" stroke-width="1"/>`;
    return o + cedarFan(129, 247, 150, 60) + cedarFan(151, 247, 30, 60) + cedarFan(140, 250, 90, 48);
  },
  stayedAwake() {
    let o = '';
    let p = '';
    for (let i = 0; i < 7; i++) {
      const a = ((200 + i * (140 / 6)) * Math.PI) / 180;
      const x = 140 + Math.cos(a) * 100;
      const y = 176 + Math.sin(a) * 96;
      o += `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="none" stroke="${GP}" stroke-width=".8"/><circle cx="${f(x)}" cy="${f(y)}" r="7" fill="${GP}" opacity="${f(0.12 + i * 0.13)}"/>`;
    }
    o += `<path d="M140,372 L140,118" stroke="${G}" stroke-width="2.4"/>`;
    for (let i = 0; i < 13; i++) {
      const y0 = 126 + i * 18;
      const w = 12 + i * 6.2;
      for (const s of [-1, 1]) {
        p += `M140,${y0} Q${f(140 + s * w * 0.55)},${f(y0 + 14)} ${f(140 + s * w)},${f(y0 + 7)}`;
        p += `M${f(140 + s * w * 0.5)},${f(y0 + 9)} l${f(s * 3)},6 M${f(140 + s * w * 0.75)},${f(y0 + 10)} l${f(s * 3)},5`;
      }
    }
    o += `<path d="${p}" fill="none" stroke="${G}" stroke-width="1" stroke-linecap="round"/>`;
    o += `<circle cx="166" cy="262" r="3.2" fill="${GP}"/><circle cx="175" cy="262" r="3.2" fill="${GP}"/><circle cx="166" cy="262" r="1.1" fill="${INK}"/><circle cx="175" cy="262" r="1.1" fill="${INK}"/>`;
    return `${o}<path d="M38,372 Q90,365 140,372 T242,371" fill="none" stroke="${G}" stroke-width="1"/>`;
  },
  nurseLog() {
    const r = rng(17);
    let m = '';
    const net = (x: number, y: number, depth: number, a: number) => {
      if (depth <= 0 || y > 388) return;
      const l = 10 + r() * 10;
      const x2 = x + Math.sin(a) * l;
      const y2 = y + Math.cos(a) * l * 0.7;
      m += `M${f(x)},${f(y)}L${f(x2)},${f(y2)}`;
      net(x2, y2, depth - 1, a - 0.6 + r() * 0.3);
      if (r() < 0.7) net(x2, y2, depth - 1, a + 0.6 - r() * 0.3);
    };
    for (let k = 0; k < 6; k++) net(60 + k * 32, 328, 5, (r() - 0.5) * 0.8);
    let o = `<path d="${m}" stroke="${MOON}" stroke-width=".55" opacity=".7"/><path d="M34,330 H246" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M48,300 Q140,290 228,302 L234,312 L226,318 L232,326 Q140,334 48,326 Z" fill="${INK}" stroke="${G}" stroke-width="1.2"/>`;
    o += `<ellipse cx="48" cy="313" rx="8" ry="13" fill="${INK}" stroke="${G}" stroke-width="1"/><ellipse cx="48" cy="313" rx="5" ry="8.5" fill="none" stroke="${G}" stroke-width=".6"/><ellipse cx="48" cy="313" rx="2.4" ry="4" fill="none" stroke="${G}" stroke-width=".5"/>`;
    o += `<path d="M70,306 Q120,300 200,306 M84,318 Q140,322 210,318" fill="none" stroke="${G}" stroke-width=".5" opacity=".6"/>`;
    for (const [x, h] of [
      [96, 62],
      [146, 96],
      [192, 48],
    ]) {
      const base = 295;
      let t = `M${x},${base} L${x},${base - h!}`;
      for (let j = 0; j < 6; j++) {
        const y = base - h! + 6 + j * (h! / 7);
        const w = 3 + j * (h! / 38);
        t += `M${x},${f(y)} l${f(-w)},${f(w * 0.7)} M${x},${f(y)} l${f(w)},${f(w * 0.7)}`;
      }
      o += `<path d="${t}" fill="none" stroke="${G}" stroke-width="1" stroke-linecap="round"/>`;
    }
    for (const [x, y] of [
      [70, 298],
      [122, 294],
      [214, 300],
    ])
      o += `<path d="M${x},${y} v-6" stroke="${GP}" stroke-width="1.2"/><path d="M${x! - 6},${y! - 6} Q${x},${y! - 15} ${x! + 6},${y! - 6} Z" fill="${GP}" opacity=".75"/>`;
    return o + fireflies(r, 7, 60, 220, 120, 260);
  },
  uselessTree() {
    const r = rng(23);
    const cx = 140;
    const cy = 150;
    const n = 15;
    let crown = '';
    for (let i = 0; i <= n; i++) {
      const a = Math.PI + (i / n) * Math.PI;
      const x = cx + Math.cos(a) * 102;
      const y = cy + Math.sin(a) * 72;
      crown +=
        i === 0
          ? `M${f(x)},${f(y + 20)}`
          : ` Q${f(cx + Math.cos(a - Math.PI / n / 2) * 124)},${f(cy + Math.sin(a - Math.PI / n / 2) * 92)} ${f(x)},${f(y)}`;
    }
    crown += ` Q200,206 170,200 Q140,214 110,200 Q80,208 ${f(cx - 102)},${cy + 20} Z`;
    let o = `<path d="${crown}" fill="${G}" fill-opacity=".09" stroke="${G}" stroke-width="1.2"/>`;
    o += `<path d="M120,358 C132,320 104,290 126,252 C138,232 118,214 132,198 M164,358 C150,320 178,292 156,254 C146,234 164,214 150,198" fill="none" stroke="${G}" stroke-width="1.6"/>`;
    o += `<path d="M132,206 Q100,180 80,150 M150,204 Q182,176 206,150 M140,200 Q140,160 136,120 M118,180 Q104,150 112,118 M164,182 Q178,150 170,122" fill="none" stroke="${G}" stroke-width=".9" opacity=".85"/>`;
    o += `<ellipse cx="128" cy="284" rx="5" ry="7" fill="none" stroke="${G}" stroke-width=".8"/><ellipse cx="158" cy="242" rx="4" ry="6" fill="none" stroke="${G}" stroke-width=".8"/>`;
    o += `<path d="M34,360 Q140,352 246,360" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<circle cx="182" cy="347" r="4.6" fill="${GP}"/><path d="M187,345 Q208,339 232,347 Q234,354 228,355 L188,355 Q184,351 187,345Z" fill="${GP}"/>`;
    return o + fireflies(r, 8, 50, 230, 40, 110);
  },
  yggdrasil() {
    const r = rng(31);
    let o = `<path d="M140,372 C120,330 100,320 70,352 M140,372 C160,330 180,320 210,352 M140,372 L140,330" fill="none" stroke="${G}" stroke-width="1.4"/>`;
    o += `<ellipse cx="140" cy="358" rx="24" ry="7" fill="${INK}" stroke="${MOON}" stroke-width="1"/><ellipse cx="140" cy="358" rx="13" ry="3.5" fill="none" stroke="${MOON}" stroke-width=".6"/>`;
    o += `<path d="M128,372 C132,300 126,240 134,170 M152,372 C148,300 154,240 146,170" fill="none" stroke="${G}" stroke-width="1.6"/>`;
    o += `<path d="M140,172 C110,150 90,120 70,90 M140,172 C170,150 190,120 210,90 M140,172 C140,130 140,100 140,70 M100,140 C90,120 76,112 60,116 M180,140 C190,120 204,112 220,116" fill="none" stroke="${G}" stroke-width="1.1"/>`;
    for (const [x, y] of [
      [70, 90],
      [210, 90],
      [140, 70],
      [60, 116],
      [220, 116],
      [100, 140],
      [180, 140],
      [140, 110],
    ])
      o += `<circle cx="${x}" cy="${y}" r="5.5" fill="${INK}" stroke="${GP}" stroke-width="1"/>`;
    o += `<path d="M126,58 q14,-12 28,0 M130,60 q10,7 20,0" fill="none" stroke="${GP}" stroke-width="1.1"/>`;
    o += `<path d="M50,374 q15,-10 30,0 t30,0 t30,0 t30,0" fill="none" stroke="${GP}" stroke-width="1"/>`;
    return o + fireflies(r, 10, 60, 220, 180, 330);
  },
  dryads() {
    const r = rng(53);
    let o = birch(58, 120, 372, 13) + birch(222, 140, 372, 12);
    o += `<circle cx="58" cy="156" r="5" fill="${GP}" opacity=".45"/><circle cx="222" cy="172" r="5" fill="${GP}" opacity=".45"/>`;
    o += birch(140, 170, 372, 30);
    o += `<path d="M118,372 C122,300 112,260 126,220 C130,200 128,180 140,166 C152,180 150,200 154,220 C168,260 158,300 162,372" fill="none" stroke="${G}" stroke-width="1.2"/>`;
    o += `<circle cx="140" cy="150" r="9" fill="${GP}"/><path d="M128,172 Q140,160 152,172 L156,196 Q140,190 124,196 Z" fill="${GP}" opacity=".92"/>`;
    o += `<path d="M128,176 C100,150 90,120 72,96 M152,176 C180,150 190,120 208,96 M72,96 l-10,-14 M72,96 l14,-10 M208,96 l10,-14 M208,96 l-14,-10" fill="none" stroke="${G}" stroke-width="1.2"/>`;
    for (let i = 0; i < 12; i++) {
      const side = i % 2 ? 1 : -1;
      const t = i / 12;
      o += leafAt(
        140 + side * (30 + t * 60),
        100 + Math.sin(t * 6) * 18 + t * 40,
        side > 0 ? -30 + t * 20 : 210 - t * 20,
        14,
        4.5,
        0.2,
      );
    }
    return `${o}${fireflies(r, 8, 40, 240, 60, 300)}<path d="M30,372 H250" stroke="${G}" stroke-width="1"/>`;
  },
  kodama() {
    const r = rng(67);
    let o = `<path d="M92,372 C104,300 104,240 108,160 L114,80 L166,80 L172,160 C176,240 176,300 188,372 Z" fill="${INK}" stroke="${G}" stroke-width="1.4"/>`;
    o += `<path d="M116,350 q6,-60 2,-120 M140,360 q0,-80 0,-160 M164,350 q-6,-60 -2,-120 M128,330 q2,-50 0,-100 M152,330 q-2,-50 0,-100" fill="none" stroke="${G}" stroke-width=".5" opacity=".55"/>`;
    for (let k = 0; k < 6; k++)
      o +=
        cedarFan(112 - k * 2, 96 + k * 14, 200 + k * 6, 34 + k * 4) +
        cedarFan(168 + k * 2, 96 + k * 14, -20 - k * 6, 34 + k * 4);
    o += `<path d="M100,236 Q140,224 180,236" fill="none" stroke="${GP}" stroke-width="2.6" stroke-dasharray="3 2"/>`;
    for (const x of [112, 140, 168]) o += `<path d="M${x},236 l-4,16 l8,0 z" fill="${GP}" opacity=".85"/>`;
    for (let k = 1; k <= 5; k++) {
      const R = 24 + k * 22;
      o += `<path d="M192,${f(150 - R * 0.6)} A${R},${R} 0 0 1 192,${f(150 + R * 0.6)}" fill="none" stroke="${MOON}" stroke-width="${f(1.3 - k * 0.18)}" opacity="${f(0.9 - k * 0.15)}"/>`;
    }
    o += `${figure(56, 372, 1.6, GP)}<path d="M64,336 q10,-4 18,2" fill="none" stroke="${GP}" stroke-width="1"/>`;
    for (let k = 1; k <= 3; k++) {
      const R = 10 + k * 10;
      o += `<path d="M74,${f(334 - R * 0.5)} A${R},${R} 0 0 1 74,${f(334 + R * 0.5)}" fill="none" stroke="${GP}" stroke-width=".7" opacity="${f(0.8 - k * 0.2)}"/>`;
    }
    return `${o}${fireflies(r, 6, 40, 240, 40, 120)}<path d="M30,372 H250" stroke="${G}" stroke-width="1"/>`;
  },
  leaffall() {
    const r = rng(79);
    let o = birch(140, 150, 372, 16);
    o += `<path d="M140,230 C120,200 100,190 84,160 M140,230 C160,200 184,190 196,160 M140,200 C140,180 146,160 140,130 M104,186 C96,170 86,166 76,150 M176,186 C184,170 194,166 204,150 M140,180 C130,166 124,158 118,146 M142,176 C150,160 158,152 166,142" fill="none" stroke="${G}" stroke-width="1.1" stroke-linecap="round"/>`;
    for (let i = 0; i < 22; i++) o += leafAt(40 + r() * 200, 60 + r() * 260, r() * 360, 10 + r() * 6, 3.5, 0.22);
    for (let i = 0; i < 18; i++) o += leafAt(30 + r() * 220, 366 + r() * 4, -10 + r() * 20, 9 + r() * 5, 3, 0.3);
    return `${o}${figure(190, 372, 1.5, GP)}<path d="M30,372 H250" stroke="${G}" stroke-width="1"/>`;
  },
  aspen() {
    const r = rng(89);
    const xs = [46, 74, 104, 140, 176, 206, 234];
    let o = `<path d="M30,374 Q140,386 250,374" fill="none" stroke="${G}" stroke-width="1.2" opacity=".9"/>`;
    xs.forEach((x, j) => {
      o += `<path d="M${x},372 Q${f(x + (j % 2 ? 8 : -8))},392 ${f(x + (j % 2 ? -14 : 14))},404" fill="none" stroke="${G}" stroke-width=".8" opacity=".7"/>`;
    });
    o += `<path d="M24,404 Q140,396 256,404" fill="none" stroke="${G}" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>`;
    xs.forEach((x, j) => {
      o += birch(x, 110 + ((j * 37) % 40), 372, 9 + (j % 3) * 2);
    });
    for (let i = 0; i < 90; i++)
      o += `<circle cx="${f(30 + r() * 220)}" cy="${f(60 + r() * 110)}" r="${f(1.6 + r() * 1.6)}" fill="${G}" opacity="${f(0.35 + r() * 0.5)}"/>`;
    for (let i = 0; i < 14; i++)
      o += `<circle cx="${f(30 + r() * 220)}" cy="${f(180 + r() * 160)}" r="1.6" fill="${G}" opacity=".6"/>`;
    return o;
  },
  bristlecone() {
    const r = rng(97);
    let o = `<path d="M24,372 L60,352 L92,360 L130,344 L170,356 L210,340 L256,352" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M118,352 C124,300 100,270 120,230 C136,200 118,170 134,140 C146,118 170,112 184,96 M136,352 C146,300 130,270 150,236 C164,206 152,176 168,150 C180,130 196,124 206,108" fill="none" stroke="${G}" stroke-width="1.6"/>`;
    o += `<path d="M121,340 C128,300 106,270 124,236 C138,208 122,178 136,150 M133,340 C140,300 126,268 144,236 C156,208 144,180 158,154" fill="none" stroke="${MOON}" stroke-width="2.2" opacity=".55"/>`;
    o += `<path d="M126,310 c-6,-10 -2,-18 6,-22 M140,262 c8,-6 10,-14 4,-20" fill="none" stroke="${G}" stroke-width=".7" opacity=".8"/>`;
    o += `<path d="M184,96 C196,86 214,88 228,80 M206,108 C218,104 232,106 244,98" fill="none" stroke="${G}" stroke-width="1.2"/>`;
    for (let i = 0; i < 9; i++) o += sprig(196 + i * 5.5, 92 - i * 1.6, -30 + r() * 20, 14, 0.95);
    for (let i = 0; i < 40; i++)
      o += `<circle cx="${f(30 + r() * 220)}" cy="${f(40 + r() * 120)}" r="${f(0.6 + r() * 1.1)}" fill="${GP}" opacity="${f(0.4 + r() * 0.6)}"/>`;
    return o;
  },
};

export function woodFace(card: WoodCard): string {
  const id = uid('gv');
  const r = rng(card.name.length * 13 + 7);
  let s = `${svgOpen(`${card.circle}: ${card.name}, ${card.from}`)}<defs><clipPath id="${id}c"><path d="M30,450 V152 A110,110 0 0 1 250,152 V450 Z"/></clipPath><radialGradient id="${id}g" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="${GLOW}"/><stop offset="1" stop-color="${INK}"/></radialGradient></defs>`;
  s += `<rect width="280" height="480" rx="14" fill="url(#${id}g)"/><g clip-path="url(#${id}c)">`;
  let rays = '';
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    rays += `M${f(140 + Math.cos(a) * 80)},${f(196 + Math.sin(a) * 80)}L${f(140 + Math.cos(a) * 230)},${f(196 + Math.sin(a) * 230)}`;
  }
  s += `<path d="${rays}" stroke="${G}" stroke-width=".4" opacity=".14"/>`;
  s += `${spireRow(r, 372, 16, 22, 62, 0.34, INK_DEEP)}${mist(140, 352, 130, 8, 0.05)}${ART[card.art]()}</g>`;
  s += `<path d="M22,458 V150 A118,118 0 0 1 258,150 V458 Z" fill="none" stroke="${G}" stroke-width="1.6"/><path d="M30,450 V152 A110,110 0 0 1 250,152 V450 Z" fill="none" stroke="${G}" stroke-width=".7" opacity=".75"/>`;
  s += `<circle cx="140" cy="24" r="3" fill="${G}"/>${sprig(16, 44, -62, 26, 0.9)}${sprig(264, 44, 242, 26, 0.9)}`;
  s += `<rect x="46" y="390" width="188" height="56" rx="3" fill="${INK}" stroke="${G}" stroke-width=".9"/><rect x="50" y="394" width="180" height="48" rx="2" fill="none" stroke="${G}" stroke-width=".4" opacity=".6"/>`;
  s += `<text x="140" y="406" text-anchor="middle" font-family="${FELL_SC}" font-size="9.5" letter-spacing="3" fill="${G}">${card.circle.toUpperCase()}</text>`;
  s += `<text x="140" y="425" text-anchor="middle" font-family="${FELL_SC}" font-size="${card.name.length > 16 ? 15.5 : 18.5}" fill="${GP}">${esc(card.name)}</text>`;
  s += `<text x="140" y="438" text-anchor="middle" font-family="${FELL}" font-style="italic" font-size="9.5" fill="${G}">${esc(card.from)}</text>`;
  return `${s}</svg>`;
}

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
