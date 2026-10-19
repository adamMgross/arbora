import type { WOOD_ART_SPIRITS } from '../../lib/decks';
import { f, rng } from '../../lib/svg';
import {
  birch,
  cedarFan,
  fireflies,
  figure,
  G,
  GP,
  INK,
  INK_DEEP,
  leafAt,
  mist,
  MOON,
  spire,
  spireRow,
  sprig,
} from './forest';

const ground = (y = 372) => `<path d="M30,${y} H250" stroke="${G}" stroke-width="1"/>`;

export const SPIRIT_ART: Record<(typeof WOOD_ART_SPIRITS)[number], () => string> = {
  humbaba() {
    const r = rng(201);
    let o = '';
    for (const [x, h] of [
      [44, 300],
      [236, 300],
      [70, 250],
      [210, 250],
    ])
      o += spire(x!, 372, h!, h! * 0.22, INK_DEEP, G, 0.9);
    for (let k = 0; k < 5; k++)
      o += cedarFan(64, 120 + k * 40, 10 + k * 4, 50) + cedarFan(216, 120 + k * 40, 170 - k * 4, 50);
    o += `<path d="M140,150 C104,150 92,186 96,220 C100,262 120,290 140,292 C160,290 180,262 184,220 C188,186 176,150 140,150 Z" fill="${INK}" stroke="${G}" stroke-width="1.2"/>`;
    let coil = '';
    for (let k = 0; k < 6; k++) coil += `M${100 + k * 2},${190 + k * 14} q${10 + k},-6 ${18 - k},2 q-6,6 -12,0`;
    o += `<path d="${coil}" fill="none" stroke="${G}" stroke-width=".8"/><path d="${coil}" transform="translate(280 0) scale(-1 1)" fill="none" stroke="${G}" stroke-width=".8"/>`;
    o += `<path d="M116,206 Q126,198 136,206 Q126,212 116,206Z M144,206 Q154,198 164,206 Q154,212 144,206Z" fill="${GP}" fill-opacity=".3" stroke="${GP}" stroke-width="1"/>`;
    o += `<circle cx="126" cy="206" r="2.4" fill="${GP}"/><circle cx="154" cy="206" r="2.4" fill="${GP}"/>`;
    o += `<path d="M140,212 L136,236 L144,236 M124,252 Q140,262 156,252" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M126,256 q14,20 28,0" fill="none" stroke="${GP}" stroke-width="1" opacity=".8"/>`;
    for (let k = 1; k <= 3; k++)
      o += `<path d="M${140 - k * 12},${276 + k * 10} q${k * 12},10 ${k * 24},0" fill="none" stroke="${GP}" stroke-width=".7" opacity="${f(0.8 - k * 0.2)}"/>`;
    return o + ground() + fireflies(r, 6, 60, 220, 60, 140);
  },
  pan() {
    const r = rng(203);
    let o = `<path d="M60,372 C64,300 60,240 66,180 M74,372 C72,300 76,240 72,180" fill="none" stroke="${G}" stroke-width="1.4"/>`;
    o += `<path d="M66,186 C90,160 120,150 150,120 M72,184 C50,160 40,140 36,110" fill="none" stroke="${G}" stroke-width="1"/>`;
    for (let i = 0; i < 18; i++) o += leafAt(40 + r() * 130, 90 + r() * 70, r() * 360, 13, 6, 0.2);
    o += `<path d="M30,330 Q90,320 140,334 T250,328" fill="none" stroke="${MOON}" stroke-width="1" opacity=".7"/><path d="M40,344 Q110,338 170,348 T250,342" fill="none" stroke="${MOON}" stroke-width=".7" opacity=".5"/>`;
    o += `<circle cx="166" cy="208" r="9" fill="${GP}"/><path d="M158,202 q-6,-12 -2,-18 M174,202 q6,-12 2,-18" fill="none" stroke="${GP}" stroke-width="1.6" stroke-linecap="round"/>`;
    o += `<path d="M154,222 Q166,214 178,222 L182,262 Q166,258 150,262 Z" fill="${GP}"/>`;
    o += `<path d="M154,262 C150,280 160,288 154,304 L158,316 M176,262 C182,280 172,290 180,304 L176,316" fill="none" stroke="${GP}" stroke-width="2.6" stroke-linecap="round"/>`;
    o += `<path d="M152,316 l6,0 M174,316 l6,0" stroke="${GP}" stroke-width="2.4"/>`;
    for (let k = 0; k < 6; k++)
      o += `<rect x="${130 + k * 4}" y="${206 + k * 2}" width="3" height="${22 - k * 2.6}" fill="none" stroke="${G}" stroke-width=".8"/>`;
    o += `<path d="M130,214 L154,222" stroke="${G}" stroke-width=".8"/>`;
    for (let k = 0; k < 4; k++)
      o += `<path d="M${118 - k * 14},${200 - k * 8} q4,-4 8,0 l0,8" fill="none" stroke="${GP}" stroke-width=".8" opacity="${f(0.9 - k * 0.18)}"/>`;
    return o + ground(330) + fireflies(r, 6, 40, 240, 230, 320);
  },
  leshy() {
    const r = rng(207);
    let o = spireRow(r, 372, 7, 160, 260, 0.95, INK_DEEP, 30, 250);
    o += mist(140, 320, 120, 10, 0.1);
    o += `<path d="M140,60 C122,60 118,80 120,100 C112,120 108,200 112,300 L120,360 L160,360 L168,300 C172,200 168,120 160,100 C162,80 158,60 140,60 Z" fill="${INK}" stroke="${G}" stroke-width="1" opacity=".95"/>`;
    o += `<path d="M120,100 C100,110 90,140 82,180 M160,100 C180,110 190,140 198,180" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += sprig(82, 180, 100, 30) + sprig(198, 180, 80, 30) + sprig(124, 64, -120, 24) + sprig(156, 64, -60, 24);
    o += `<circle cx="132" cy="86" r="2.2" fill="${GP}"/><circle cx="148" cy="86" r="2.2" fill="${GP}"/>`;
    o += `<path d="M70,372 C60,330 220,320 200,296 C180,272 90,300 100,272 C110,246 190,262 176,240" fill="none" stroke="${GP}" stroke-width="1.2" stroke-dasharray="3 4"/>`;
    o += figure(78, 372, 1.1, GP);
    return o + ground() + fireflies(r, 5, 40, 240, 120, 250);
  },
  tapio() {
    const r = rng(211);
    let o = spireRow(r, 300, 10, 60, 130, 0.85, INK_DEEP, 30, 250);
    o += `<path d="M30,300 H250" stroke="${G}" stroke-width=".8" opacity=".7"/>`;
    o += `<path d="M190,250 q-4,-12 2,-22 M192,232 l-10,-8 M194,232 l8,-12 M202,250 q6,-12 0,-24 M202,232 l10,-10 M200,232 l-6,-14" fill="none" stroke="${GP}" stroke-width="1.1" stroke-linecap="round"/>`;
    o += `<path d="M176,264 Q190,250 206,256 Q214,262 210,272 L224,276 Q232,290 220,300 L184,300 Q176,286 176,264 Z" fill="${GP}" opacity=".85"/>`;
    o += `<path d="M186,300 l-2,20 M196,300 l0,20 M214,300 l2,20 M222,298 l2,20" stroke="${GP}" stroke-width="2"/>`;
    o += `<path d="M86,372 L92,320 L132,318 L140,372 Z" fill="${INK}" stroke="${G}" stroke-width="1.2"/><ellipse cx="112" cy="319" rx="20" ry="5" fill="${INK}" stroke="${G}" stroke-width="1"/>`;
    o += `<ellipse cx="112" cy="319" rx="12" ry="3" fill="none" stroke="${G}" stroke-width=".6"/><ellipse cx="112" cy="319" rx="5" ry="1.3" fill="none" stroke="${G}" stroke-width=".5"/>`;
    o += `<circle cx="104" cy="313" r="3" fill="${GP}"/><circle cx="114" cy="312" r="2.4" fill="${GP}"/><path d="M118,314 q6,-6 10,0" fill="none" stroke="${GP}" stroke-width="1"/>`;
    o += `<path d="M84,372 C70,360 60,366 50,372 M140,372 C150,362 162,366 170,372" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<path d="M112,300 q-4,-14 2,-24 q4,10 -2,24" fill="${GP}" opacity=".5"/>`;
    for (let i = 0; i < 26; i++)
      o += `<circle cx="${f(40 + r() * 200)}" cy="${f(56 + r() * 110)}" r="${f(0.6 + r())}" fill="${GP}" opacity="${f(0.4 + r() * 0.5)}"/>`;
    o += `<circle cx="78" cy="96" r="13" fill="${GP}"/><circle cx="84" cy="91" r="11.5" fill="${INK}"/>`;
    return o + ground();
  },
  cernunnos() {
    const r = rng(213);
    let o = `<circle cx="140" cy="210" r="104" fill="none" stroke="${G}" stroke-width=".7" opacity=".5"/>`;
    o += `<circle cx="140" cy="168" r="11" fill="${GP}"/>`;
    const antler = (s: number) =>
      `<path d="M${140 + s * 6},160 C${140 + s * 20},140 ${140 + s * 30},120 ${140 + s * 34},90 M${140 + s * 22},134 l${s * 18},-8 M${140 + s * 28},116 l${s * 18},-14 M${140 + s * 32},100 l${s * 8},-18 M${140 + s * 30},108 l${-s * 6},-16" fill="none" stroke="${GP}" stroke-width="1.6" stroke-linecap="round"/>`;
    o += antler(1) + antler(-1);
    o += `<path d="M124,184 Q140,176 156,184 L160,240 Q140,236 120,240 Z" fill="${GP}"/>`;
    o += `<path d="M100,262 Q140,232 180,262 Q140,274 100,262 Z" fill="${GP}" opacity=".95"/>`;
    o += `<path d="M124,194 C110,206 100,212 90,206 M156,194 C170,206 180,212 190,206" fill="none" stroke="${GP}" stroke-width="2.4" stroke-linecap="round"/>`;
    o += `<circle cx="84" cy="204" r="8" fill="none" stroke="${GP}" stroke-width="2"/><path d="M80,198 l8,0" stroke="${INK}" stroke-width="2"/>`;
    o += `<path d="M190,206 C204,196 196,184 210,176 C222,170 226,182 218,188 C212,192 208,186 212,182" fill="none" stroke="${GP}" stroke-width="2" stroke-linecap="round"/><circle cx="212" cy="181" r="2" fill="${GP}"/>`;
    o += `<path d="M132,186 Q140,192 148,186" fill="none" stroke="${INK}" stroke-width="2"/>`;
    o += `<path d="M42,320 Q58,300 76,306 L84,296 M76,306 L96,306 Q104,312 100,322 L96,344 M52,322 L50,344 M90,322 L92,344" fill="none" stroke="${G}" stroke-width="1.1"/>`;
    o += `<path d="M84,296 l-6,-10 M84,296 l6,-12 M84,292 l-10,-2" fill="none" stroke="${G}" stroke-width=".9"/>`;
    o += `<path d="M196,330 q8,-12 20,-8 q10,4 18,-4 M200,340 l-2,6 M228,334 l2,8" fill="none" stroke="${G}" stroke-width="1"/>`;
    for (let i = 0; i < 10; i++) o += leafAt(36 + r() * 208, 286 + r() * 70, r() * 360, 8, 3.5, 0.15);
    return o + ground(360) + fireflies(r, 5, 50, 230, 70, 140);
  },
  yakshi() {
    const r = rng(217);
    let o = `<path d="M196,372 C190,310 200,250 192,180 M210,372 C214,310 206,250 214,180" fill="none" stroke="${G}" stroke-width="1.5"/>`;
    o += `<path d="M194,184 C170,150 130,130 86,128 M212,182 C226,150 236,130 244,100 M202,180 C200,140 196,110 204,70" fill="none" stroke="${G}" stroke-width="1.1"/>`;
    for (let i = 0; i < 18; i++) o += leafAt(70 + r() * 170, 66 + r() * 80, r() * 360, 12, 5, 0.18);
    for (let i = 0; i < 14; i++) {
      const x = 80 + r() * 150;
      const y = 80 + r() * 70;
      o += `<circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="${GP}"/><circle cx="${f(x)}" cy="${f(y)}" r="5" fill="none" stroke="${GP}" stroke-width=".5" opacity=".7"/>`;
    }
    o += `<circle cx="140" cy="182" r="8.5" fill="${GP}"/><path d="M134,176 q6,-8 12,0" fill="none" stroke="${GP}" stroke-width="1.4"/>`;
    o += `<path d="M144,190 L136,140 L128,132" fill="none" stroke="${GP}" stroke-width="2.4" stroke-linecap="round"/>`;
    o += `<path d="M150,198 C170,196 184,200 196,204" fill="none" stroke="${GP}" stroke-width="2.4" stroke-linecap="round"/>`;
    o += `<path d="M132,194 Q146,188 150,198 C152,220 146,236 150,252 C156,276 148,296 152,316 L150,330 L128,330 L128,316 C132,292 122,272 128,250 C132,232 126,214 132,194 Z" fill="${GP}"/>`;
    o += `<path d="M126,246 Q140,240 154,246" fill="none" stroke="${INK}" stroke-width="1.2"/><path d="M128,316 l-8,40 M150,316 l14,36 M164,352 l12,-6" fill="none" stroke="${GP}" stroke-width="2" stroke-linecap="round"/>`;
    o += `<path d="M120,356 l-6,2" stroke="${GP}" stroke-width="2"/>`;
    return o + ground() + fireflies(r, 6, 40, 240, 200, 340);
  },
  burningBush() {
    const r = rng(219);
    let o = `<path d="M30,340 L80,318 L130,330 L180,312 L250,326" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<circle cx="140" cy="250" r="70" fill="${GP}" opacity=".05"/><circle cx="140" cy="250" r="44" fill="${GP}" opacity=".07"/>`;
    let thorns = '';
    for (let i = 0; i < 16; i++) {
      const a = Math.PI + (i / 15) * Math.PI;
      const x = 140 + Math.cos(a) * (30 + r() * 26);
      const y = 300 + Math.sin(a) * (40 + r() * 30);
      thorns += `M140,316 Q${f((140 + x) / 2 + (r() - 0.5) * 14)},${f((316 + y) / 2)} ${f(x)},${f(y)}`;
      thorns += ` M${f(x)},${f(y)} l${f((r() - 0.5) * 8)},-5`;
    }
    o += `<path d="${thorns}" fill="none" stroke="${G}" stroke-width="1" stroke-linecap="round"/>`;
    for (let i = 0; i < 9; i++) {
      const x = 96 + i * 11;
      const h = 30 + Math.sin(i * 1.3) * 14 + r() * 16;
      const y = 270 - Math.abs(4 - i) * 6;
      o += `<path d="M${x - 6},${f(y + 20)} Q${x - 4},${f(y - h * 0.4)} ${x},${f(y - h)} Q${x + 4},${f(y - h * 0.4)} ${x + 6},${f(y + 20)}" fill="${GP}" fill-opacity=".22" stroke="${GP}" stroke-width="1"/>`;
    }
    o += `<path d="M110,248 Q140,200 170,248" fill="none" stroke="${GP}" stroke-width=".7" opacity=".8"/>`;
    o += `<path d="M56,352 q10,-6 22,-2 l2,6 l-24,0 Z M70,360 q10,-6 22,-2 l2,6 l-24,0 Z" fill="none" stroke="${GP}" stroke-width="1"/>`;
    o += figure(212, 352, 1.4, GP) + `<path d="M196,320 q-10,6 -10,24" fill="none" stroke="${GP}" stroke-width="1.2"/>`;
    for (let i = 0; i < 30; i++)
      o += `<circle cx="${f(40 + r() * 200)}" cy="${f(50 + r() * 120)}" r="${f(0.5 + r())}" fill="${GP}" opacity="${f(0.3 + r() * 0.6)}"/>`;
    return o + ground();
  },
  owl() {
    const r = rng(223);
    let o = `<circle cx="140" cy="104" r="28" fill="${GP}" opacity=".9"/><circle cx="140" cy="104" r="42" fill="${GP}" opacity=".06"/>`;
    o += `<path d="M30,282 C80,276 120,290 170,282 C210,276 236,282 250,280" fill="none" stroke="${G}" stroke-width="2"/>`;
    o += sprig(60, 280, 160, 26) + sprig(214, 281, 20, 26) + sprig(232, 280, -30, 20);
    o += `<path d="M140,160 C114,160 104,186 104,214 C104,250 120,280 140,280 C160,280 176,250 176,214 C176,186 166,160 140,160 Z" fill="${INK}" stroke="${G}" stroke-width="1.2"/>`;
    o += `<path d="M110,168 L116,150 L126,164 M170,168 L164,150 L154,164" fill="none" stroke="${G}" stroke-width="1.2" stroke-linejoin="round"/>`;
    o += `<circle cx="126" cy="194" r="13" fill="none" stroke="${G}" stroke-width="1"/><circle cx="154" cy="194" r="13" fill="none" stroke="${G}" stroke-width="1"/>`;
    o += `<circle cx="126" cy="194" r="8" fill="${GP}"/><circle cx="154" cy="194" r="8" fill="${GP}"/><circle cx="126" cy="194" r="3.4" fill="${INK}"/><circle cx="154" cy="194" r="3.4" fill="${INK}"/>`;
    o += `<path d="M136,206 L140,218 L144,206 Z" fill="${GP}"/>`;
    for (let k = 0; k < 4; k++)
      o += `<path d="M${122 + k * 2},${232 + k * 10} q${18 - k * 2},8 ${36 - k * 4},0" fill="none" stroke="${G}" stroke-width=".7"/>`;
    o += `<path d="M130,280 l-4,6 M134,280 l0,7 M146,280 l0,7 M150,280 l4,6" stroke="${GP}" stroke-width="1.2"/>`;
    o += spireRow(r, 372, 10, 40, 80, 0.85, INK_DEEP);
    return o + ground() + fireflies(r, 8, 40, 240, 120, 260);
  },
  forestSage() {
    const r = rng(227);
    let o = birch(56, 120, 372, 13) + birch(84, 160, 372, 9) + birch(226, 140, 372, 12);
    o += `<path d="M160,372 L160,296 L196,272 L232,296 L232,372" fill="${INK}" stroke="${G}" stroke-width="1.1"/>`;
    o += `<path d="M150,300 L196,262 L242,300" fill="none" stroke="${G}" stroke-width="1.4"/>`;
    for (let k = 0; k < 6; k++)
      o += `<path d="M${156 + k * 8},${304 - k * 6.4} l-6,10" stroke="${G}" stroke-width=".7"/>`;
    o += `<path d="M186,372 V330 Q196,322 206,330 V372" fill="none" stroke="${G}" stroke-width="1"/><circle cx="196" cy="350" r="5" fill="${GP}" opacity=".5"/>`;
    o += `<circle cx="120" cy="300" r="7" fill="${GP}"/><path d="M110,310 Q120,304 130,310 L134,336 Q120,332 106,336 Z" fill="${GP}"/>`;
    o += `<path d="M96,348 Q120,330 144,348 Q120,356 96,348 Z" fill="${GP}" opacity=".95"/>`;
    o += `<path d="M114,306 q6,14 12,0" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
    o += `<path d="M98,334 l-4,-28 M94,306 q6,-4 4,6" fill="none" stroke="${GP}" stroke-width="1.2"/>`;
    o += `<path d="M102,328 h22 v6 h-22 Z" fill="none" stroke="${G}" stroke-width=".8"/>`;
    for (let i = 0; i < 12; i++) o += leafAt(40 + r() * 200, 80 + r() * 100, r() * 360, 10, 4, 0.2);
    o += mist(140, 360, 110, 6, 0.08);
    return o + ground() + fireflies(r, 7, 40, 240, 120, 280);
  },
  wind() {
    const r = rng(229);
    let o = '';
    const bent = (x: number, h: number, lean: number) => {
      const tip = x + lean;
      let s = `<path d="M${x},372 Q${f(x + lean * 0.3)},${f(372 - h * 0.6)} ${f(tip)},${f(372 - h)}" fill="none" stroke="${G}" stroke-width="1.2"/>`;
      for (let k = 1; k < 8; k++) {
        const t = k / 8;
        const px = x + lean * t * t;
        const py = 372 - h * t;
        s +=
          sprig(px, py, 30 + lean * 0.3, 10 + (1 - t) * 16, 0.85) +
          sprig(px, py, 150 + lean * 0.3, 8 + (1 - t) * 10, 0.6);
      }
      return s;
    };
    o += bent(60, 250, 26) + bent(110, 290, 34) + bent(166, 270, 30) + bent(218, 240, 22);
    for (let k = 0; k < 7; k++) {
      const y = 80 + k * 22 + r() * 10;
      const x0 = 34 + r() * 40;
      o += `<path d="M${f(x0)},${f(y)} C${f(x0 + 50)},${f(y - 10)} ${f(x0 + 110)},${f(y + 10)} ${f(x0 + 170)},${f(y - 4)} q14,-4 10,-14 q-4,-6 -10,-2" fill="none" stroke="${MOON}" stroke-width="${f(1.2 - k * 0.1)}" opacity="${f(0.8 - k * 0.06)}"/>`;
    }
    for (let i = 0; i < 12; i++) o += leafAt(140 + r() * 100, 60 + r() * 140, r() * 360, 7, 3, 0.25);
    o += figure(84, 372, 1.3, GP) + `<path d="M78,350 q-8,-2 -14,4" fill="none" stroke="${GP}" stroke-width="1"/>`;
    return o + ground();
  },
};
