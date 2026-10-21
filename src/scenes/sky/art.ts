import type { SkyPlate } from '../../lib/decks';
import { DOME, FIGURES, HEAVENS, project, type FigureId, type SkyState } from '../../lib/sky-dome';
import { esc, f } from '../../lib/svg';
import { pictureFace, svgOpen } from '../book';
import { CREAM, DAY_INK, DAY_SKY, dust, GOLD, LAPIS, moonDisc, MUTED, SERIF, SHADE, SMALLCAPS, VERM } from './ink';

export const plateFace = (p: SkyPlate): string =>
  pictureFace(p.picture, `${p.name}, ${p.alt}`, esc(p.name), '(max-width: 640px) 82vw, 360px');

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

export function domeSvg(st: SkyState, names: Record<string, string>, halo: [number, number], labelSize = 10): string {
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
    o += `<text x="${f(cx - (R + 16) * Math.sin(a))}" y="${f(cy - (R + 16) * Math.cos(a) + 4)}" text-anchor="middle" font-family="${SMALLCAPS}" font-weight="600" font-size="${f(labelSize * 1.2)}" letter-spacing="2" fill="${ink}">${letter}</text>`;
  }
  const placed: Array<[number, number, number]> = [];
  const clash = (x: number, y: number, w: number) =>
    placed.reduce(
      (sum, [px, py, pw]) =>
        sum + (Math.abs(py - y) < labelSize * 1.2 ? Math.max(0, Math.min(x + w, px + pw) - Math.max(x, px)) : 0),
      0,
    );
  const placeLabel = (bx: number, y: number, w: number): { x: number; y: number; end: boolean } => {
    const clamped = Math.max(6, Math.min(bx + 12, width - 6 - w));
    let best = { left: clamped, y, end: false, cost: Infinity };
    for (const [left, end] of [
      [bx + 12, false],
      [bx - 12 - w, true],
      [clamped, false],
    ] as Array<[number, boolean]>) {
      if (left < 6 || left + w > width - 6) continue;
      for (const dy of [0, 1.3, -1.3, 2.6, -2.6, 3.9, -3.9].map((k) => k * labelSize)) {
        const cost = clash(left, y + dy, w);
        if (cost < best.cost) best = { left, y: y + dy, end, cost };
        if (cost === 0) break;
      }
      if (best.cost === 0) break;
    }
    placed.push([best.left, best.y, w]);
    return { x: best.end ? best.left + w : best.left, y: best.y, end: best.end };
  };
  st.beacons.forEach((b, j) => {
    const name = (names[b.id] ?? b.id).toUpperCase();
    if (b.id === 'sun')
      o += `<circle cx="${f(b.x)}" cy="${f(b.y)}" r="16" fill="${VERM}" opacity=".2"/><circle cx="${f(b.x)}" cy="${f(b.y)}" r="8" fill="${VERM}"/>`;
    else if (b.id === 'moon')
      o += `<g transform="translate(${f(b.x)} ${f(b.y)})">${moonDisc(0, 0, 6, st.moon, CREAM, st.day ? DAY_SKY : SHADE)}<circle r="6" fill="none" stroke="${ink}" stroke-width=".6"/></g>`;
    else if ((HEAVENS as string[]).includes(b.id))
      o += `<g class="beacon" style="animation-delay:${j * 0.4}s"><circle cx="${f(b.x)}" cy="${f(b.y)}" r="11" fill="${GOLD}" opacity=".14"/><circle cx="${f(b.x)}" cy="${f(b.y)}" r="4.2" fill="${GOLD}"/></g>`;
    if (!(HEAVENS as string[]).includes(b.id)) return;
    const spot = placeLabel(
      b.x,
      b.y + (b.id === 'milkyway' ? 14 : labelSize * 0.4),
      name.length * labelSize * 0.82 + 6,
    );
    o += `<text x="${f(spot.x)}" y="${f(spot.y)}"${spot.end ? ' text-anchor="end"' : ''} font-family="${SMALLCAPS}" font-weight="600" font-size="${f(labelSize)}" letter-spacing="${f(labelSize * 0.15)}" fill="${label}" opacity=".8">${esc(name)}</text>`;
  });
  o += `<g data-halo transform="translate(${f(halo[0])} ${f(halo[1])})" fill="none" stroke="${GOLD}"><circle r="26" stroke-width="1.2"/><circle r="30" stroke-width=".5" opacity=".6"/></g></svg>`;
  return o;
}
