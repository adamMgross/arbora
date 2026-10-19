import type { SkyData, SkyPlate } from '../../lib/decks';
import { loadJournal, storeJournal, withEntry, type Journal, type JournalEntry } from '../../lib/journal';
import {
  compass,
  drawPlate,
  landing,
  ORDINALS,
  skyState,
  standings,
  type HeavenId,
  type Landing,
  type SkyState,
} from '../../lib/sky-dome';
import { loadPlace, storePlace } from '../../lib/place';
import { signOf } from '../../lib/sky-math';
import { esc, f } from '../../lib/svg';
import { byId, keepForm, niceDate, passageHtml, question, readData } from '../book';
import type { SceneEnv } from '../env';
import { animate, reducedMotion, reveal, wait } from '../motion';
import { domeSvg, sphereFace } from './art';

const KEY = 'arbora-sky';
const ADAPT_MS = 12000;
const PLURAL = new Set(['pleiades', 'twins', 'weaver']);
const READY = 'Lift your eyes.';
const PHONE = '(max-width: 640px)';

interface AscentEntry extends JournalEntry {
  plate: string;
  heavens: string;
  line: string;
  status: 'kept' | 'set';
}

const isAscent = (e: JournalEntry): e is AscentEntry =>
  typeof e.plate === 'string' && typeof e.line === 'string' && (e.status === 'kept' || e.status === 'set');

const STAGE = `
<div class="stage-top"><p class="stage-cue" id="sky-cue"></p></div>
<div class="dome" id="sky-dome"><div class="adapt" id="sky-adapt"><div class="adapt-msg">LET YOUR EYES ADJUST</div></div></div>
<div class="out" id="sky-out"></div>
<div class="actions place"><button class="sbtn quiet" id="sky-place" type="button"></button><span class="place-note" id="sky-place-note" role="status"></span></div>`;

const fill = (text: string, st: SkyState) => text.replace(/\{sign\}/g, st.sign).replace(/\{phase\}/g, st.moon.name);

export function mount(root: HTMLElement, env: SceneEnv): void {
  const data = readData<SkyData>(root);
  root.insertAdjacentHTML('beforeend', STAGE);
  const names = Object.fromEntries(data.plates.map((p) => [p.id, p.name]));
  const dome = byId(root, 'sky-dome');
  const adapt = byId(root, 'sky-adapt');
  const cue = byId(root, 'sky-cue');
  const out = byId(root, 'sky-out');

  let journal: Journal = loadJournal(env.storage, KEY);
  const save = (next: Journal) => {
    journal = next;
    storeJournal(env.storage, KEY, journal);
  };
  const placeButton = byId<HTMLButtonElement>(root, 'sky-place');
  const placeNote = byId(root, 'sky-place-note');
  let own = loadPlace(env.storage);
  const place = () => own ?? data.place;
  let st = skyState(env.now(), place());
  let halo: [number, number] = [300, 262];
  let adapted = false;
  let busy = false;
  let current: { plate: SkyPlate; spot: Landing } | null = null;

  const heavensText = () =>
    `Tonight · ${standings(st)
      .map((s) => `${names[s.id] ?? s.id} in ${s.sign}${s.phase ? `, ${s.phase}` : ''}, ${s.state}`)
      .join(' · ')}`;

  const phone = matchMedia(PHONE);
  const render = () => {
    st = skyState(env.now(), place());
    dome.classList.toggle('day', st.day);
    dome.querySelector('svg')?.remove();
    dome.insertAdjacentHTML('afterbegin', domeSvg(st, names, halo, phone.matches ? 15 : 10));
    const svg = dome.querySelector('svg')!;
    svg.setAttribute(
      'aria-label',
      `The heavens over ${own ? 'where you are' : 'California'} now, drawn as an atlas. Tap to lift your eyes.`,
    );
    placeButton.textContent = own ? 'Return to the California sky' : 'Read the sky over where you are';
    svg.addEventListener('click', (e) => {
      if (!adapted) return;
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

  const where = (plate: SkyPlate, spot: Landing): string => {
    if (spot.risen === null) return '';
    const az = st.places[plate.id as keyof typeof st.places]!.az;
    if (plate.kind === 'heaven') {
      const sign = signOf(st.positions[plate.id as HeavenId].lon);
      const heaven = `in ${sign}, the ${ORDINALS[plate.n ?? 0]} heaven`;
      if (st.day && plate.id === 'sun') return `By day the Sun stands alone, ${heaven}.`;
      return spot.risen
        ? `${plate.name} stands in the ${compass(az)}, ${heaven}.`
        : `${plate.name} is below the horizon now, ${heaven}.`;
    }
    const plural = PLURAL.has(plate.id) || plate.id === 'falling';
    if (!spot.risen) return `${plate.name} ${plural ? 'are' : 'is'} below the horizon now.`;
    const verb =
      plate.id === 'milkyway' ? 'stands' : plate.id === 'falling' ? 'are falling' : plural ? 'have risen' : 'has risen';
    return `${plate.name} ${verb} in the ${compass(az)}${st.day ? ', hidden by the day' : ''}.`;
  };

  async function liftEyes(x: number, y: number): Promise<void> {
    if (busy) return;
    busy = true;
    const plate = drawPlate(data.plates, current?.plate.id ?? null, env.random);
    const spot = landing(st, plate.id, [x, y]);
    out.innerHTML = '';
    cue.textContent = '';
    const haloEl = dome.querySelector<SVGGElement>('[data-halo]');
    const [x0, y0] = halo;
    haloEl?.setAttribute('opacity', spot.risen === false ? '.45' : '1');
    await animate(1100, (p) => {
      haloEl?.setAttribute(
        'transform',
        `translate(${f(x0 + (spot.x - x0) * p)} ${f(y0 + (spot.y - y0) * p)}) scale(${f(1.5 - 0.5 * p)})`,
      );
    });
    halo = [spot.x, spot.y];
    current = { plate, spot };
    out.innerHTML = `<div class="drawn"><div class="cardslot"><div class="cardbox">${sphereFace(plate, st)}</div></div><div><div class="actions"><button class="sbtn" type="button" id="sky-open">Read</button><button class="sbtn quiet" type="button" id="sky-again">Look again</button></div><div id="sky-book" class="out"></div></div></div>`;
    byId(out, 'sky-open').addEventListener('click', openBook);
    byId(out, 'sky-again').addEventListener('click', lookAgain);
    reveal(out);
    busy = false;
  }

  const lookAgain = () => {
    out.innerHTML = '';
    cue.textContent = READY;
    reveal(dome);
  };

  const openBook = () => {
    if (!current) return;
    const { plate: c, spot } = current;
    byId(out, 'sky-open').hidden = true;
    const kicker =
      c.kind === 'heaven'
        ? `The ${ORDINALS[c.n ?? 0]} heaven · ${c.name} in ${signOf(st.positions[c.id as HeavenId].lon)}`
        : c.kind === 'stars'
          ? `The fixed stars · ${c.alt}`
          : `Beyond the stars · ${c.alt}`;
    const standing = where(c, spot);
    const previous = lastKept(c.id);
    const remembered = previous
      ? `<div class="return"><span class="rk">When ${esc(c.name.toLowerCase())} last opened for you · ${esc(niceDate(previous.iso))}</span><span>“${esc(previous.line)}”</span></div>`
      : '';
    const passage = c.passages[Math.floor(env.random() * c.passages.length)]!;
    byId(out, 'sky-book').innerHTML =
      `<div class="book">${remembered}<p class="bk-kicker">${esc(kicker)}</p><h4 class="bk-title">${esc(c.name)}</h4>${standing ? `<p class="bk-note">${esc(standing)}</p>` : ''}<p class="above">${esc(fill(c.above, st))}</p><div class="below"><p><span>Set down</span>${esc(c.set)}</p><p><span>Receive</span>${esc(c.receive)}</p></div>${passageHtml(passage)}${question('Sit with', c.question)}${keepForm('sky', 'Keep', 'Let it set', 'One line, in your own words')}</div>`;
    reveal(byId(out, 'sky-book'));
    byId(out, 'sky-keep').addEventListener('click', () => finish('kept'));
    byId(out, 'sky-set').addEventListener('click', () => finish('set'));
  };

  const finish = (status: 'kept' | 'set') => {
    if (!current) return;
    const line = byId<HTMLTextAreaElement>(out, 'sky-line').value.trim();
    const entry: AscentEntry = {
      iso: env.now().toISOString(),
      plate: current.plate.id,
      heavens: heavensText(),
      line,
      status,
    };
    save(withEntry(journal, entry));
    const note =
      status === 'kept'
        ? line
          ? 'Kept, with the heavens as they stood. It will be the first thing you read when this one opens again.'
          : 'Kept, without a line.'
        : 'Let set. It will not be shown again.';
    byId(out, 'sky-book').querySelector('.keep')!.innerHTML = `<p class="bk-note">${note}</p>`;
  };

  placeButton.addEventListener('click', () => {
    if (own) {
      own = null;
      storePlace(env.storage, null);
      placeNote.textContent = '';
      render();
      return;
    }
    placeButton.disabled = true;
    placeNote.textContent = 'Asking your browser where you are.';
    env
      .locate()
      .then((found) => {
        storePlace(env.storage, found);
        own = loadPlace(env.storage);
        placeNote.textContent = 'The sky over where you are, kept on this device only.';
        render();
      })
      .catch(() => {
        placeNote.textContent = 'Your browser did not share a location, so the sky stays over California.';
      })
      .finally(() => {
        placeButton.disabled = false;
      });
  });

  render();
  phone.addEventListener('change', render);
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
      if (!current) cue.textContent = READY;
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
}
