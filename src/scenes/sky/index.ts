import type { SkyData, SkyPlate } from '../../lib/decks';
import { drewOn, loadJournal, storeJournal, withEntry, type Journal, type JournalEntry } from '../../lib/journal';
import {
  compass,
  lift as liftAt,
  ORDINALS,
  pickBeyond,
  skyState,
  standings,
  type HeavenId,
  type SkyState,
} from '../../lib/sky-dome';
import { signOf } from '../../lib/sky-math';
import { esc, f } from '../../lib/svg';
import { byId, keepForm, niceDate, passageHtml, question, readData } from '../book';
import type { SceneEnv } from '../env';
import { animate, reducedMotion, wait } from '../motion';
import { domeSvg, sphereFace } from './art';

const KEY = 'arbora-sky';
const ADAPT_MS = 12000;
const READY = 'Lift your eyes. The heavens are open where the lights stand.';

interface AscentEntry extends JournalEntry {
  plate: string;
  heavens: string;
  line: string;
  status: 'kept' | 'set';
}

const isAscent = (e: JournalEntry): e is AscentEntry =>
  typeof e.plate === 'string' && typeof e.line === 'string' && (e.status === 'kept' || e.status === 'set');

const STAGE = `
<div class="stage-top"><p class="stage-cue" id="sky-cue">Let your eyes adjust.</p></div>
<div class="dome" id="sky-dome"><div class="adapt" id="sky-adapt"><div class="adapt-msg">LET YOUR EYES ADJUST</div></div></div>
<p class="heavens" id="sky-read"></p>
<div id="sky-return"></div>
<p class="closed" id="sky-closed" hidden></p>
<div class="out" id="sky-out"></div>`;

const fill = (text: string, st: SkyState) => text.replace(/\{sign\}/g, st.sign).replace(/\{phase\}/g, st.moon.name);

export function mount(root: HTMLElement, env: SceneEnv): void {
  const data = readData<SkyData>(root);
  root.insertAdjacentHTML('beforeend', STAGE);
  const plates = new Map(data.plates.map((p) => [p.id, p]));
  const names = Object.fromEntries(data.plates.map((p) => [p.id, p.name]));
  const beyond = data.plates.filter((p) => p.kind === 'beyond');
  const dome = byId(root, 'sky-dome');
  const adapt = byId(root, 'sky-adapt');
  const read = byId(root, 'sky-read');
  const cue = byId(root, 'sky-cue');
  const returnBox = byId(root, 'sky-return');
  const closed = byId(root, 'sky-closed');
  const out = byId(root, 'sky-out');

  let journal: Journal = loadJournal(env.storage, KEY);
  const save = (next: Journal) => {
    journal = next;
    storeJournal(env.storage, KEY, journal);
  };
  let st = skyState(env.now(), data.place);
  let halo: [number, number] = [300, 262];
  let adapted = false;
  let busy = false;
  let current: SkyPlate | null = null;
  let lastBeyond: string | null = null;

  const heavensLine = () =>
    `Tonight · ${standings(st)
      .map((s) => `<b>${esc(names[s.id] ?? s.id)}</b> in ${s.sign}${s.phase ? `, ${s.phase}` : ''}, ${s.state}`)
      .join(' · ')}`;

  const render = () => {
    st = skyState(env.now(), data.place);
    dome.classList.toggle('day', st.day);
    dome.querySelector('svg')?.remove();
    dome.insertAdjacentHTML('afterbegin', domeSvg(st, names, halo));
    read.innerHTML = heavensLine();
    dome.querySelector('svg')!.addEventListener('click', (e) => {
      if (!adapted) return;
      const svg = e.currentTarget as SVGSVGElement;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const q = pt.matrixTransform(svg.getScreenCTM()!.inverse());
      void liftEyes(q.x, q.y);
    });
  };

  const lastKept = (id: string): AscentEntry | null => {
    for (let i = journal.entries.length - 1; i >= 0; i--) {
      const e = journal.entries[i]!;
      if (isAscent(e) && e.plate === id && e.status === 'kept' && e.line) return e;
    }
    return null;
  };

  const where = (plate: SkyPlate, beaconId: HeavenId | string, az: number) => {
    const dir = compass(az);
    if (plate.kind === 'heaven') {
      const sign = signOf(st.positions[beaconId as HeavenId].lon);
      return st.day && beaconId === 'sun'
        ? `By day the Sun stands alone, in ${sign}, the fourth heaven.`
        : `You looked to the ${dir}. ${plate.name} stands there, in ${sign}, the ${ORDINALS[plate.n ?? 0]} heaven.`;
    }
    return `You looked to the ${dir}. ${plate.name}${plate.id === 'milkyway' ? ' stands' : ' has risen'} there.`;
  };

  async function liftEyes(x: number, y: number): Promise<void> {
    if (busy || drewOn(journal, env.now())) return;
    busy = true;
    out.innerHTML = '';
    returnBox.innerHTML = '';
    const result = liftAt(st, x, y);
    let plate: SkyPlate;
    let target: [number, number];
    let text: string;
    if (result.kind === 'beyond') {
      plate = pickBeyond(beyond, lastBeyond, env.random);
      lastBeyond = plate.id;
      target = [x, y];
      text = 'You looked past the stars.';
    } else {
      const found = plates.get(result.beacon.id);
      if (!found) throw new Error(`No plate for ${result.beacon.id}`);
      plate = found;
      target = [result.beacon.x, result.beacon.y];
      text = where(plate, result.beacon.id, result.beacon.az);
    }
    const haloEl = dome.querySelector<SVGGElement>('[data-halo]');
    const [x0, y0] = halo;
    await animate(1100, (p) => {
      haloEl?.setAttribute(
        'transform',
        `translate(${f(x0 + (target[0] - x0) * p)} ${f(y0 + (target[1] - y0) * p)}) scale(${f(1.5 - 0.5 * p)})`,
      );
    });
    halo = target;
    current = plate;
    cue.textContent = text;
    const previous = lastKept(plate.id);
    if (previous)
      returnBox.innerHTML = `<div class="return"><span class="rk">When ${esc(plate.name.toLowerCase())} last opened for you · ${esc(niceDate(previous.iso))}</span><span>“${esc(previous.line)}”</span></div>`;
    out.innerHTML = `<div class="drawn"><div class="cardslot"><div class="cardbox">${sphereFace(plate, st)}</div></div><div><p class="look" id="sky-look">Look at the plate before the book. What does it stir in you?</p><div class="actions"><button class="sbtn" type="button" id="sky-open">Open the book</button></div><div id="sky-book" class="out"></div></div></div>`;
    byId(out, 'sky-open').addEventListener('click', openBook);
    busy = false;
  }

  const openBook = () => {
    if (!current) return;
    const c = current;
    byId(out, 'sky-open').hidden = true;
    byId(out, 'sky-look').hidden = true;
    const kicker =
      c.kind === 'heaven'
        ? `The ${ORDINALS[c.n ?? 0]} heaven · ${c.name} in ${signOf(st.positions[c.id as HeavenId].lon)}`
        : c.kind === 'stars'
          ? `The fixed stars · ${c.alt}`
          : `Beyond the stars · ${c.alt}`;
    const passage = c.passages[Math.floor(env.random() * c.passages.length)]!;
    byId(out, 'sky-book').innerHTML =
      `<div class="book"><p class="bk-kicker">${esc(kicker)}</p><h4 class="bk-title">${esc(c.name)}</h4><p class="above">${esc(fill(c.above, st))}</p><div class="below"><p><span>Set down</span>${esc(c.set)}</p><p><span>Receive</span>${esc(c.receive)}</p></div>${passageHtml(passage)}${question('Sit with', c.question)}${keepForm('sky', 'Keep', 'Let it set', 'One line, in your own words')}</div>`;
    byId(out, 'sky-keep').addEventListener('click', () => finish('kept'));
    byId(out, 'sky-set').addEventListener('click', () => finish('set'));
  };

  const finish = (status: 'kept' | 'set') => {
    if (!current) return;
    const line = byId<HTMLTextAreaElement>(out, 'sky-line').value.trim();
    const entry: AscentEntry = {
      iso: env.now().toISOString(),
      plate: current.id,
      heavens: read.textContent ?? '',
      line,
      status,
    };
    save(withEntry(journal, entry, env.now()));
    const note =
      status === 'kept'
        ? line
          ? 'Kept, with the heavens as they stood. It will be the first thing you read when this one opens again.'
          : 'Kept, without a line.'
        : 'Let set. It will not be shown again.';
    byId(out, 'sky-book').querySelector('.keep')!.innerHTML =
      `<p class="bk-note">${note} The heavens close until tomorrow.</p>`;
    cue.textContent = 'The heavens are closed for tonight.';
  };

  const closedState = () => {
    closed.hidden = false;
    closed.textContent = 'You climbed tonight. The heavens close until tomorrow.';
    cue.textContent = 'The heavens are closed for tonight.';
  };

  render();
  let started = false;
  const startAdapt = () => {
    if (started) return;
    started = true;
    root.classList.add('adapting');
    if (reducedMotion()) adapt.classList.add('gone-now');
    else requestAnimationFrame(() => requestAnimationFrame(() => adapt.classList.add('gone')));
    void wait(ADAPT_MS).then(() => {
      adapted = true;
      adapt.remove();
      root.classList.add('adapted');
      if (!current && !drewOn(journal, env.now())) cue.textContent = READY;
    });
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startAdapt();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(dome);
  } else startAdapt();
  if (drewOn(journal, env.now())) closedState();
}
