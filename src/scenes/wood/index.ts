import type { WoodCard, WoodData } from '../../lib/decks';
import { loadJournal, storeJournal, updateEntry, withEntry, type Journal } from '../../lib/journal';
import { esc } from '../../lib/svg';
import {
  lastKept,
  lightSpots,
  pickFrom,
  POSITION_LABEL,
  WALKS,
  WOODS,
  type Circle,
  type Slot,
  type WalkEntry,
  type WalkMode,
} from '../../lib/wood-walk';
import { byId, credit, keepForm, niceDate, passageHtml, question, readData } from '../book';
import type { SceneEnv } from '../env';
import { reveal, wait } from '../motion';
import { woodBack, woodFace, woodScene } from './art';

const KEY = 'arbora-wood';
const SLOTS: Slot[] = ['left', 'center', 'right'];

const STAGE = `
<svg class="wood-bg" id="wood-bg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg>
<div class="wood-dark" id="wood-dark"></div>
<div class="wood-hold" id="wood-hold">
  <p class="q">What do I need to see about this?</p>
  <div class="actions"><button class="sbtn" id="wood-enter" type="button">Walk in</button></div>
  <div class="modes" role="radiogroup" aria-label="How to walk">
    <label><input type="radio" name="wood-mode" id="wood-one" value="one" checked> One light</label>
    <label><input type="radio" name="wood-mode" id="wood-three" value="three"> Three</label>
    <label><input type="radio" name="wood-mode" id="wood-table" value="table"> For the table</label>
  </div>
</div>
<div class="wood-play" id="wood-play" hidden role="group" aria-label="Lights among the trees"></div>
<div class="trip" id="wood-trip" hidden>
  <figure class="wing"><div id="wood-slot-left" class="slot-empty"></div></figure>
  <figure><div id="wood-slot-center" class="slot-empty"></div></figure>
  <figure class="wing"><div id="wood-slot-right" class="slot-empty"></div></figure>
</div>
<div class="out" id="wood-out" hidden>
  <div class="actions"><button class="sbtn" id="wood-open" type="button">Read</button><button class="sbtn quiet" id="wood-again" type="button">Walk again</button></div>
  <div id="wood-book" class="out"></div>
</div>
<div class="actions"><button class="sbtn quiet" id="wood-past" type="button" hidden>The last line you kept</button></div>
<div id="wood-return"></div>`;

interface Drawn {
  slot: Slot;
  card: WoodCard;
}

export function mount(root: HTMLElement, env: SceneEnv): void {
  const data = readData<WoodData>(root);
  root.insertAdjacentHTML('beforeend', STAGE);
  const pools: Record<Circle, WoodCard[]> = { Elder: [], Spirit: [], Passage: [] };
  for (const card of data.cards) pools[card.circle].push(card);
  const bg = byId(root, 'wood-bg');
  const dark = byId(root, 'wood-dark');
  const hold = byId(root, 'wood-hold');
  const play = byId(root, 'wood-play');
  const trip = byId(root, 'wood-trip');
  const out = byId(root, 'wood-out');
  const openButton = byId<HTMLButtonElement>(root, 'wood-open');
  const book = byId(root, 'wood-book');
  const pastButton = byId<HTMLButtonElement>(root, 'wood-past');
  const returnBox = byId(root, 'wood-return');

  let journal: Journal = loadJournal(env.storage, KEY);
  const save = (next: Journal) => {
    journal = next;
    storeJournal(env.storage, KEY, journal);
  };
  let mode: WalkMode = 'one';
  let step = 0;
  let drawn: Drawn[] = [];
  let busy = false;

  const setScene = (wood: (typeof WOODS)[number]) => {
    bg.style.opacity = '0';
    void wait(400).then(() => {
      bg.innerHTML = woodScene(wood);
      bg.style.opacity = '1';
    });
  };
  bg.innerHTML = woodScene('coast');

  const slot = (s: Slot) => byId(trip, `wood-slot-${s}`);

  const fillSlot = (s: Slot, card: WoodCard) => {
    const el = slot(s);
    el.className = '';
    const { width, height } = card.picture;
    el.innerHTML = `<div class="flip arrive" style="--ar:${width}/${height}"><div class="flip-inner"><div class="flip-face">${woodBack()}</div><div class="flip-face flip-front">${woodFace(card)}</div></div></div>`;
    const flip = el.firstElementChild!;
    void wait(700).then(() => flip.classList.add('flipped'));
  };

  const resetSlots = () => {
    trip.classList.remove('spread');
    const used = new Set(WALKS[mode].map((s) => s.slot));
    for (const s of SLOTS) {
      const el = slot(s);
      el.className = 'slot-empty';
      el.innerHTML = '';
      (el.parentElement as HTMLElement).hidden = !used.has(s);
    }
  };

  const lights = (count: number) => {
    play.innerHTML = lightSpots(step, count)
      .map(
        ([x, y], i) =>
          `<button class="wisp" type="button" style="left:${x}%;top:${y}%;--d:${6 + i * 1.3}s" aria-label="Follow light ${i + 1} of ${count}"></button>`,
      )
      .join('');
    play.querySelectorAll<HTMLButtonElement>('.wisp').forEach((w) => w.addEventListener('click', () => void follow(w)));
  };

  const showPast = () => {
    pastButton.hidden = !lastKept(journal.entries);
  };

  const showReturn = () => {
    const last = lastKept(journal.entries);
    if (!last) {
      returnBox.innerHTML = '';
      return;
    }
    const { entry, index } = last;
    const outcome = entry.outcome
      ? `<span class="rq">What came of it: ${esc(entry.outcome)}</span>`
      : `<span class="rq">What came of it?</span><div class="keep"><label class="sr-only" for="wood-outcome">One line, or leave it</label><input id="wood-outcome" placeholder="One line, or leave it"><div class="actions"><button class="sbtn quiet" id="wood-outcome-save" type="button">Add</button></div></div>`;
    returnBox.innerHTML = `<div class="return"><span class="rk">Last time you walked in · ${esc(niceDate(entry.iso))}</span><span>“${esc(entry.line)}”</span>${outcome}</div>`;
    returnBox.querySelector('#wood-outcome-save')?.addEventListener('click', () => {
      const value = byId<HTMLInputElement>(returnBox, 'wood-outcome').value.trim();
      if (!value) return;
      save(updateEntry(journal, index, { outcome: value }));
      showReturn();
    });
  };

  const toDoor = () => {
    hold.hidden = false;
    play.hidden = true;
    trip.hidden = true;
    out.hidden = true;
    book.innerHTML = '';
    dark.style.opacity = '';
    if (step > 1) setScene('coast');
    step = 0;
    reveal(root);
  };

  const enter = () => {
    mode = (root.querySelector<HTMLInputElement>('input[name="wood-mode"]:checked')?.value ?? 'one') as WalkMode;
    step = 0;
    drawn = [];
    hold.hidden = true;
    returnBox.innerHTML = '';
    trip.hidden = mode !== 'three';
    resetSlots();
    play.hidden = false;
    dark.style.opacity = '0.12';
    lights(3);
    reveal(root);
  };

  async function follow(w: HTMLButtonElement): Promise<void> {
    if (busy) return;
    busy = true;
    play.querySelectorAll('.wisp').forEach((o) => o.classList.add(o === w ? 'chosen' : 'fade'));
    const { slot: s, circle } = WALKS[mode][step]!;
    const card = pickFrom(circle ? pools[circle] : data.cards, env.random);
    drawn.push({ slot: s, card });
    await wait(800);
    trip.hidden = false;
    fillSlot(s, card);
    step += 1;
    dark.style.opacity = String(0.12 + step * 0.14);
    if (step < WALKS[mode].length) {
      setScene(WOODS[step]!);
      await wait(1700);
      lights(3);
      busy = false;
      return;
    }
    play.hidden = true;
    trip.classList.add('spread');
    out.hidden = false;
    openButton.hidden = false;
    reveal(trip);
    busy = false;
  }

  const entryHtml = ({ card }: Drawn) => {
    const kicker = [mode === 'three' ? POSITION_LABEL[card.circle] : null, card.circle, card.from]
      .filter(Boolean)
      .join(' · ');
    const passage = card.passages[Math.floor(env.random() * card.passages.length)]!;
    return `<div class="bk-entry"><p class="bk-kicker">${esc(kicker)}</p><h4 class="bk-title">${esc(card.name)}</h4><p class="bk-teach">${esc(card.story)}</p>${passageHtml(passage)}<p class="bk-note">${esc(card.principle)}</p>${credit(card.picture)}</div>`;
  };

  const openBook = () => {
    openButton.hidden = true;
    const order = [...drawn].sort((a, b) => SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot));
    let h = `<div class="book">${order.map(entryHtml).join('')}`;
    const passageCard = drawn.find((d) => d.card.circle === 'Passage')?.card;
    if (mode === 'table') {
      h += `${question('For the table', passageCard?.table ?? '')}<p class="bk-note">Nothing is saved from a table draw. Pass the phone, or read it aloud.</p></div>`;
      book.innerHTML = h;
      reveal(book);
      return;
    }
    if (passageCard?.question) h += question('Sit with', passageCard.question);
    h += `${keepForm('wood', 'Keep', 'Leave it on a branch', 'One line, in your own words')}</div>`;
    book.innerHTML = h;
    reveal(book);
    byId(book, 'wood-keep').addEventListener('click', () => finish('kept'));
    byId(book, 'wood-set').addEventListener('click', () => finish('branch'));
  };

  const finish = (status: 'kept' | 'branch') => {
    const line = byId<HTMLTextAreaElement>(book, 'wood-line').value.trim();
    const cards: Partial<Record<Circle, string>> = {};
    for (const { card } of drawn) cards[card.circle] = card.name;
    const entry: WalkEntry = { iso: env.now().toISOString(), cards, line, status, outcome: '' };
    save(withEntry(journal, entry));
    const note =
      status === 'kept' ? (line ? 'Kept.' : 'Kept, without a line.') : 'Left on a branch. It will not be shown again.';
    book.querySelector('.keep')!.innerHTML = `<p class="bk-note">${note}</p>`;
    showPast();
  };

  if (location.hash === '#table') {
    byId<HTMLInputElement>(root, 'wood-table').checked = true;
    reveal(root);
  }
  byId(root, 'wood-enter').addEventListener('click', enter);
  byId(root, 'wood-again').addEventListener('click', toDoor);
  openButton.addEventListener('click', openBook);
  pastButton.addEventListener('click', () => {
    if (returnBox.innerHTML) returnBox.innerHTML = '';
    else showReturn();
  });
  showPast();
}
