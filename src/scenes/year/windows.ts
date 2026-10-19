import { f, rng } from '../../lib/svg';
import { FRUIT, hillPath, seasonVar, SUMI, sunY, WASHI } from './ink';

const ember = (part: string) => seasonVar('ember', part);

function orchard(vx: number, vy: number, rows: number, fruit: boolean): string {
  let o = '';
  for (let k = -rows - 1; k <= rows + 1; k++)
    o += `<path d="M${vx},${vy} L${f(vx + (k + 0.5) * 58 * 1.1)},318" stroke="${ember('hill2')}" stroke-width=".8" opacity=".5"/>`;
  for (let k = -rows; k <= rows; k++) {
    const bx = vx + k * 58;
    for (const t of [0.12, 0.22, 0.36, 0.55, 0.8, 1.08]) {
      const x = vx + (bx - vx) * t;
      const y = vy + (318 - vy) * t;
      const rad = 1.6 + 11 * t;
      o += `<path d="M${f(x)},${f(y)} V${f(y - rad * 0.6)}" stroke="${SUMI}" stroke-width="${f(0.4 + t)}"/><ellipse cx="${f(x)}" cy="${f(y - rad * 0.9)}" rx="${f(rad)}" ry="${f(rad * 0.7)}" fill="${ember('hill2')}"/>`;
      if (fruit && t > 0.5)
        for (let q = 0; q < 4; q++)
          o += `<circle cx="${f(x - rad * 0.6 + q * rad * 0.4)}" cy="${f(y - rad * (0.4 + (q % 2) * 0.5))}" r="${f(rad * 0.13)}" fill="${FRUIT}"/>`;
    }
  }
  return o;
}

function persimmon(x: number, y: number, rad: number): string {
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${FRUIT}"/><ellipse cx="${f(x - rad * 0.35)}" cy="${f(y - rad * 0.3)}" rx="${f(rad * 0.28)}" ry="${f(rad * 0.18)}" fill="${WASHI}" opacity=".45"/>${[0, 90, 180, 270].map((a) => `<ellipse cx="${f(x)}" cy="${f(y - rad * 0.86)}" rx="${f(rad * 0.32)}" ry="${f(rad * 0.13)}" fill="${SUMI}" transform="rotate(${a + 45} ${f(x)} ${f(y - rad * 0.86)}) translate(${f(rad * 0.22)} 0)"/>`).join('')}<path d="M${f(x)},${f(y - rad)} V${f(y - rad * 1.3)}" stroke="${SUMI}" stroke-width="1.4"/>`;
}

function persimmons(): string {
  const r = rng(51);
  const sy = sunY(50);
  let o = `<rect x="18" y="18" width="244" height="300" fill="${ember('sky')}"/><circle cx="198" cy="${f(sy)}" r="24" fill="${ember('sun')}" opacity=".9"/>`;
  for (let b = 0; b < 4; b++)
    o += `<ellipse cx="${130 + b * 18}" cy="${f(sy - 34 + b * 20)}" rx="170" ry="4.5" fill="${WASHI}" opacity=".4"/>`;
  o += `<path d="${hillPath(198, 9, 26, 1.4)}" fill="${ember('hill1')}" opacity=".75"/>`;
  o += `<path d="M18,212 H262 V318 H18Z" fill="${ember('arc')}" opacity=".55"/>${orchard(150, 212, 4, true)}`;
  o += `<path d="M266,26 C230,44 214,70 186,84 C160,96 132,96 104,112 M214,62 C206,46 210,34 222,24 M186,84 C190,104 184,118 172,130 M150,94 C140,80 128,74 112,74" fill="none" stroke="${SUMI}" stroke-width="4" stroke-linecap="round"/>`;
  o += `<path d="M104,112 C92,118 82,130 76,144 M172,130 C166,142 168,154 160,164 M222,24 C232,20 240,12 246,8" fill="none" stroke="${SUMI}" stroke-width="2" stroke-linecap="round"/>`;
  for (const [x, y, a] of [
    [128, 88, -30],
    [96, 74, 200],
    [238, 40, 60],
    [160, 150, 120],
  ])
    o += `<ellipse cx="${x}" cy="${y}" rx="10" ry="4" fill="${ember('arc')}" transform="rotate(${a} ${x} ${y})"/>`;
  for (const [x, y, rad] of [
    [180, 102, 12],
    [206, 80, 10],
    [138, 112, 11],
    [114, 130, 10],
    [168, 146, 9],
    [76, 156, 9],
    [232, 50, 8],
  ])
    o += persimmon(x!, y!, rad!);
  o += `<path d="M18,190 H34 V318 H18Z" fill="${SUMI}" opacity=".9"/><path d="M18,296 L150,292 L150,318 L18,318Z" fill="${SUMI}" opacity=".88"/><path d="M28,300 L140,297 M34,308 L120,306" stroke="${WASHI}" stroke-width=".6" opacity=".35"/>`;
  o += `<g transform="translate(96 288)" fill="${SUMI}" stroke="${SUMI}" stroke-linecap="round"><ellipse rx="9" ry="3.2"/><circle cx="-9" cy="-1" r="2.6"/><path d="M-11,-2 C-22,-14 -34,-16 -42,-12 M-11,-2 C-20,-18 -26,-26 -30,-30" fill="none" stroke-width=".7"/><path d="M2,1 L10,-8 L16,4 M-3,2 L-6,7 M3,2 L1,7" fill="none" stroke-width="1.2"/></g>`;
  for (let i = 0; i < 6; i++)
    o += `<path d="M${f(60 + r() * 60)},${f(266 + r() * 14)} q3,-4 6,0" fill="none" stroke="${SUMI}" stroke-width=".6" opacity=".5"/>`;
  return o;
}

export const VIGNETTES: Partial<Record<number, () => string>> = { 50: persimmons };
