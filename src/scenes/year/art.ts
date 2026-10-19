import type { YearSeasonData } from '../../lib/decks';
import { esc, f, polar, rng, uid } from '../../lib/svg';
import { needleAngle, windowArcStart } from '../../lib/year-windows';
import { svgOpen } from '../book';

const WASHI = 'var(--art-washi)';
const SUMI = 'var(--art-sumi)';
const RED = 'var(--art-red)';
const SERIF = "'Cormorant Garamond',Georgia,serif";
const SMALLCAPS = "'Cormorant SC',Georgia,serif";

const seasonVar = (key: string, part: string) => `var(--art-${key}-${part})`;

function wrapWords(text: string, max: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(' ')) {
    if (`${current} ${word}`.trim().length > max) {
      lines.push(current.trim());
      current = word;
    } else current += ` ${word}`;
  }
  lines.push(current.trim());
  return lines;
}

function hillPath(y: number, amp: number, period: number, phase: number): string {
  let d = `M18,${f(y)}`;
  for (let x = 18; x <= 262; x += 8) d += ` L${x},${f(y + Math.sin(x / period + phase) * amp)}`;
  return `${d} V318 H18 Z`;
}

export interface WindowCard {
  index: number;
  name: string;
  season: YearSeasonData;
}

export function windowFace(card: WindowCard): string {
  const { index, name, season } = card;
  const key = season.key;
  const id = uid('ca');
  const r = rng(index * 7 + 3);
  const ph = r() * 6;
  const ph2 = r() * 6;
  let o = svgOpen(`Window ${index + 1}: ${name}`);
  o += `<defs><clipPath id="${id}"><rect x="18" y="18" width="244" height="300"/></clipPath></defs><rect width="280" height="480" rx="10" fill="${WASHI}"/><g clip-path="url(#${id})">`;
  o += `<rect x="18" y="18" width="244" height="300" fill="${seasonVar(key, 'sky')}"/><circle cx="${f(60 + r() * 110)}" cy="${f(84 + r() * 50)}" r="30" fill="${seasonVar(key, 'sun')}"/>`;
  if (key === 'ember') {
    for (let b = 0; b < 3; b++)
      o += `<ellipse cx="${f(80 + r() * 120)}" cy="${110 + b * 40}" rx="150" ry="9" fill="${WASHI}" opacity=".28"/>`;
  }
  if (key === 'rain') {
    let rain = '';
    for (let q = 0; q < 48; q++) rain += `M${f(18 + r() * 260)},${f(20 + r() * 170)} l-6,16`;
    o += `<path d="${rain}" stroke="${SUMI}" stroke-width=".8" opacity=".35"/>`;
  }
  o += `<path d="${hillPath(214, 18, 38, ph)}" fill="${seasonVar(key, 'hill1')}"/>`;
  if (key === 'rain') o += `<rect x="18" y="232" width="244" height="16" fill="${WASHI}" opacity=".45"/>`;
  if (key === 'gold')
    o += `<path d="M96,222 L96,200" stroke="${SUMI}" stroke-width="3"/><circle cx="84" cy="196" r="11" fill="${seasonVar(key, 'hill2')}"/><circle cx="98" cy="190" r="13" fill="${seasonVar(key, 'hill2')}"/><circle cx="110" cy="198" r="10" fill="${seasonVar(key, 'hill2')}"/>`;
  o += `<path d="${hillPath(262, 12, 26, ph2)}" fill="${seasonVar(key, 'hill2')}"/>`;
  if (key === 'bloom') {
    for (let fl = 0; fl < 70; fl++)
      o += `<circle cx="${f(20 + r() * 240)}" cy="${f(240 + r() * 76)}" r="${f(1.2 + r() * 1.6)}" fill="${r() < 0.6 ? seasonVar(key, 'arc') : seasonVar(key, 'sun')}"/>`;
  }
  o += `</g><rect x="18" y="18" width="244" height="300" fill="none" stroke="${SUMI}" stroke-width="1"/>`;
  o += `<rect x="228" y="30" width="28" height="28" rx="2" fill="${RED}"/><text x="242" y="49" text-anchor="middle" font-family="${SERIF}" font-weight="600" font-size="15" fill="${WASHI}">${index + 1}</text>`;
  wrapWords(name, 22).forEach((l, i) => {
    o += `<text x="20" y="${360 + i * 24}" font-family="${SERIF}" font-size="21" font-weight="500" fill="${SUMI}">${esc(l)}</text>`;
  });
  return `${o}</svg>`;
}

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
