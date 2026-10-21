import type { CardPicture, YearSeasonData } from '../../lib/decks';
import { esc, f, polar } from '../../lib/svg';
import { needleAngle, windowArcStart } from '../../lib/year-windows';
import { pictureFace, svgOpen } from '../book';
import { RED, seasonVar, SMALLCAPS, SERIF, SUMI, WASHI } from './ink';

export interface WindowCard {
  index: number;
  name: string;
  season: YearSeasonData;
  picture: CardPicture;
}

export const windowFace = ({ index, name, picture }: WindowCard): string =>
  pictureFace(
    picture,
    `Window ${index + 1}: ${name}`,
    `<b>${index + 1}</b> ${esc(name)}`,
    '(max-width: 640px) 46vw, 300px',
  );

export function yearBack(): string {
  let o = `${svgOpen()}<rect width="280" height="480" rx="10" fill="${WASHI}"/><rect x="16" y="16" width="248" height="448" fill="none" stroke="${SUMI}" stroke-width=".8"/>`;
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * 360;
    const [x0, y0] = polar(140, 220, a, i % 3 ? 86 : 80);
    const [x1, y1] = polar(140, 220, a, 96);
    ticks += `M${x0},${y0}L${x1},${y1}`;
  }
  o += `<path d="${ticks}" stroke="${SUMI}" stroke-width=".8"/><circle cx="140" cy="220" r="34" fill="${RED}"/><text x="140" y="398" text-anchor="middle" font-family="${SMALLCAPS}" font-size="12" letter-spacing="4" fill="${SUMI}">THE CALIFORNIA YEAR</text>`;
  return `${o}</svg>`;
}

const CX = 200;
const CY = 200;

export function ringSvg(today: number, seasons: YearSeasonData[], highlight: string | null): string {
  let o = `<svg viewBox="-28 -28 456 456" role="img" aria-label="The California year as a ring of 72 windows, today marked">`;
  o += `<circle cx="${CX}" cy="${CY}" r="168" fill="none" stroke="${SUMI}" stroke-width=".8"/>`;
  for (const s of seasons) {
    const a0 = windowArcStart(s.from);
    const a1 = windowArcStart(s.to + 1);
    const [x0, y0] = polar(CX, CY, a0, 178);
    const [x1, y1] = polar(CX, CY, a1, 178);
    const on = !highlight || highlight === s.key;
    o += `<path d="M${x0},${y0} A178,178 0 0 1 ${x1},${y1}" fill="none" stroke="${seasonVar(s.key, 'arc')}" stroke-width="${highlight && on ? 12 : 7}" opacity="${on ? 1 : 0.25}"/>`;
    const [mx, my] = polar(CX, CY, (a0 + a1) / 2, 192);
    o += `<text x="${mx}" y="${my + 4}" text-anchor="middle" font-family="${SMALLCAPS}" font-weight="600" font-size="11" letter-spacing="2" fill="${SUMI}" opacity="${on ? 1 : 0.4}">${esc(s.name.toUpperCase())}</text>`;
  }
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const a = windowArcStart(i);
    const [x0, y0] = polar(CX, CY, a, i % 3 ? 154 : 144);
    const [x1, y1] = polar(CX, CY, a, 166);
    ticks += `M${x0},${y0}L${x1},${y1}`;
  }
  o += `<path d="${ticks}" stroke="${SUMI}" stroke-width=".9"/>`;
  const [tx0, ty0] = polar(CX, CY, needleAngle(today), 144);
  const [tx1, ty1] = polar(CX, CY, needleAngle(today), 168);
  o += `<line x1="${tx0}" y1="${ty0}" x2="${tx1}" y2="${ty1}" stroke="${RED}" stroke-width="4"/>`;
  o += `<g class="needle" data-needle style="transform:rotate(${f(needleAngle(today))}deg)"><line x1="200" y1="200" x2="200" y2="58" stroke="${SUMI}" stroke-width="1.6"/><path d="M200,52 l-5,12 h10z" fill="${SUMI}"/></g>`;
  o += `<circle cx="200" cy="200" r="40" fill="${WASHI}" stroke="${SUMI}" stroke-width=".8"/><text x="200" y="208" text-anchor="middle" font-family="${SERIF}" font-weight="600" font-size="22" fill="${RED}" data-today>${today + 1}</text></svg>`;
  return o;
}
