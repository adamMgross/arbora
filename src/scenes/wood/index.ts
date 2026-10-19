import type { WoodCard, WoodData } from '../../lib/decks';
import { drewOn, loadJournal, storeJournal, updateEntry, withEntry, type Journal } from '../../lib/journal';
import { esc } from '../../lib/svg';
import {
  lastKept,
  lastWalk,
  lightSpots,
  pickFrom,
  POSITION_LABEL,
  TABLE_ORDER,
  WALK_ORDER,
  WOODS,
  type Circle,
  type WalkEntry,
} from '../../lib/wood-walk';
import { byId, keepForm, niceDate, passageHtml, question, readData } from '../book';
import type { SceneEnv } from '../env';
import { wait } from '../motion';
import { woodBack, woodFace, woodScene } from './art';

const KEY = 'arbora-wood';
const EMPTY: Record<Circle, string> = { Elder: 'an elder', Spirit: 'a spirit', Passage: 'a passage' };
const HOLD_CUE = 'Hold a question. Then walk in.';

const STAGE = `
<svg class="wood-bg" id="wood-bg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg>
<div class="wood-dark" id="wood-dark"></div>
<div class="stage-top"><p class="stage-cue" id="wood-cue">${HOLD_CUE}</p></div>
<div class="wood-hold" id="wood-hold">
  <p class="q">What do I need to see about this?</p>
  <p>Hold it. You will not be asked to write it down. Not “will it happen” and not “what are they thinking”. The wood answers questions about the one who walks in. It is a mirror, not a telescope.</p>
  <div id="wood-return"></div>
  <div class="actions"><button class="sbtn" id="wood-enter" type="button">Walk in</button><label class="switch"><input type="checkbox" id="wood-table"> For the table</label></div>
  <p class="closed" id="wood-closed" hidden></p>
</div>
<div class="wood-play" id="wood-play" hidden role="group" aria-label="Lights among the trees"></div>
<div class="trip" id="wood-trip" hidden>
  <figure class="wing"><div id="wood-slot-Elder" class="slot-empty">an elder</div><figcaption>Where you stand</figcaption></figure>
  <figure><div id="wood-slot-Passage" class="slot-empty">a passage</div><figcaption>What is happening</figcaption></figure>
  <figure class="wing"><div id="wood-slot-Spirit" class="slot-empty">a spirit</div><figcaption>What meets you</figcaption></figure>
</div>
<div class="out" id="wood-out" hidden>
  <p class="look" id="wood-look">Look at the plates first. Who is in them, and where are they?</p>
  <div class="actions"><button class="sbtn" id="wood-open" type="button">Open the book</button></div>
  <div id="wood-book" class="out"></div>
</div>`;

export function mount(root: HTMLElement, env: SceneEnv): void {
  const data = readData<WoodData>(root);
  root.insertAdjacentHTML('beforeend', STAGE);
  const pools: Record<Circle, WoodCard[]> = { Elder: [], Spirit: [], Passage: [] };
  for (const card of data.cards) pools[card.circle].push(card);
  const bg = byId(root, 'wood-bg');
  const dark = byId(root, 'wood-dark');
  const cue = byId(root, 'wood-cue');
  const hold = byId(root, 'wood-hold');
  const play = byId(root, 'wood-play');
  const trip = byId(root, 'wood-trip');
  const out = byId(root, 'wood-out');
  const enterButton = byId<HTMLButtonElement>(root, 'wood-enter');
  const tableSwitch = byId<HTMLInputElement>(root, 'wood-table');
  const closed = byId(root, 'wood-closed');
  const returnBox = byId(root, 'wood-return');
  const look = byId(root, 'wood-look');
  const openButton = byId<HTMLButtonElement>(root, 'wood-open');
  const book = byId(root, 'wood-book');

  let journal: Journal = loadJournal(env.storage, KEY);
  const save = (next: Journal) => {
    journal = next;
    storeJournal(env.storage, KEY, journal);
  };
  let order: Circle[] = WALK_ORDER;
  let step = 0;
  let chosen: Partial<Record<Circle, WoodCard>> = {};
  let tableMode = false;
  let busy = false;

  const setScene = (wood: (typeof WOODS)[number]) => {
    bg.style.opacity = '0';
    void wait(400).then(() => {
      bg.innerHTML = woodScene(wood);
      bg.style.opacity = '1';
    });
  };
  bg.innerHTML = woodScene('coast');

  const slot = (circle: Circle) => byId(trip, `wood-slot-${circle}`);

  const fillSlot = (circle: Circle, card: WoodCard, arriving: boolean) => {
    const el = slot(circle);
    el.className = '';
    el.innerHTML = `<div class="flip${arriving ? ' arrive' : ''}"><div class="flip-inner"><div class="flip-face">${woodBack()}</div><div class="flip-face flip-front">${woodFace(card)}</div></div></div>`;
    const flip = el.firstElementChild!;
    if (arriving) void wait(700).then(() => flip.classList.add('flipped'));
    else flip.classList.add('flipped');
  };

  const resetSlots = () => {
    for (const circle of WALK_ORDER) {
      const el = slot(circle);
      el.className = 'slot-empty';
      el.textContent = EMPTY[circle];
      (el.parentElement as HTMLElement).hidden = false;
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

  const findCard = (circle: Circle, name: string) => pools[circle].find((c) => c.name === name);

  const closedState = () => {
    enterButton.hidden = true;
    tableSwitch.closest('label')!.hidden = true;
    closed.hidden = false;
    closed.textContent = 'You walked today. The wood is closed until tomorrow.';
    cue.textContent = 'The wood is closed for today.';
    dark.style.opacity = '0.5';
    const last = lastWalk(journal.entries);
    if (last && last.status === 'kept') {
      trip.hidden = false;
      for (const circle of WALK_ORDER) {
        const name = last.cards[circle];
        const card = name && findCard(circle, name);
        if (card) fillSlot(circle, card, false);
        else (slot(circle).parentElement as HTMLElement).hidden = true;
      }
    }
  };

  const enter = () => {
    tableMode = tableSwitch.checked;
    order = tableMode ? TABLE_ORDER : WALK_ORDER;
    step = 0;
    chosen = {};
    hold.hidden = true;
    trip.hidden = false;
    resetSlots();
    if (tableMode) {
      (slot('Elder').parentElement as HTMLElement).hidden = true;
      (slot('Spirit').parentElement as HTMLElement).hidden = true;
    }
    play.hidden = false;
    dark.style.opacity = '0.12';
    cue.textContent = tableMode ? 'One light for the table. Follow it.' : 'Lights move between the firs. Follow one.';
    lights(3);
  };

  async function follow(w: HTMLButtonElement): Promise<void> {
    if (busy) return;
    busy = true;
    play.querySelectorAll('.wisp').forEach((o) => o.classList.add(o === w ? 'chosen' : 'fade'));
    const circle = order[step]!;
    const card = pickFrom(pools[circle], env.random);
    chosen[circle] = card;
    await wait(800);
    fillSlot(circle, card, true);
    step += 1;
    dark.style.opacity = String(0.12 + step * 0.14);
    if (step < order.length) {
      setScene(WOODS[step]!);
      cue.textContent =
        step === 1
          ? 'Higher. Spruce and aspen now. Follow another.'
          : 'Colder. Fir and birch. One more, and the center waits.';
      await wait(1700);
      lights(3);
      busy = false;
      return;
    }
    play.hidden = true;
    cue.textContent = tableMode ? 'The light led here.' : 'The three lights led here.';
    out.hidden = false;
    look.hidden = false;
    openButton.hidden = false;
    book.innerHTML = '';
    busy = false;
  }

  const openBook = () => {
    openButton.hidden = true;
    look.hidden = true;
    let h = '<div class="book">';
    for (const circle of order) {
      const card = chosen[circle]!;
      const passage = card.passages[Math.floor(env.random() * card.passages.length)]!;
      h += `<div class="bk-entry"><p class="bk-kicker">${esc(POSITION_LABEL[circle])} · ${esc(circle)} · ${esc(card.from)}</p><h4 class="bk-title">${esc(card.name)}</h4><p class="bk-teach">${esc(card.story)}</p>${passageHtml(passage)}<p class="bk-note">${esc(card.principle)}</p></div>`;
    }
    const passageCard = chosen.Passage!;
    if (tableMode) {
      h += `${question('For the table', passageCard.table ?? '')}<p class="bk-note">Nothing is saved from a table draw. Pass the phone, or read it aloud.</p></div>`;
      book.innerHTML = h;
      return;
    }
    h += `${question('Sit with', passageCard.question ?? '')}${keepForm('wood', 'Keep', 'Leave it on a branch', 'One line, in your own words')}</div>`;
    book.innerHTML = h;
    byId(book, 'wood-keep').addEventListener('click', () => finish('kept'));
    byId(book, 'wood-set').addEventListener('click', () => finish('branch'));
  };

  const finish = (status: 'kept' | 'branch') => {
    const line = byId<HTMLTextAreaElement>(book, 'wood-line').value.trim();
    const cards: Partial<Record<Circle, string>> = {};
    for (const circle of order) cards[circle] = chosen[circle]!.name;
    const entry: WalkEntry = { iso: env.now().toISOString(), cards, line, status, outcome: '' };
    save(withEntry(journal, entry, env.now()));
    const note =
      status === 'kept'
        ? line
          ? 'Kept. It will be waiting at the door next time.'
          : 'Kept, without a line.'
        : 'Left on a branch. It will not be shown again.';
    book.querySelector('.keep')!.innerHTML = `<p class="bk-note">${note} The wood is closed until tomorrow.</p>`;
    cue.textContent = 'The wood is closed for today.';
  };

  if (location.hash === '#table') tableSwitch.checked = true;
  enterButton.addEventListener('click', enter);
  openButton.addEventListener('click', openBook);
  showReturn();
  if (drewOn(journal, env.now())) closedState();
}
