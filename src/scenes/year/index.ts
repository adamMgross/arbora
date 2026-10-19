import type { YearData } from '../../lib/decks';
import { loadJournal, storeJournal, withEntry, type Journal, type JournalEntry } from '../../lib/journal';
import { esc, f } from '../../lib/svg';
import {
  formatRange,
  needleAngle,
  pickOtherWindow,
  previousSeason,
  seasonOf,
  windowFor,
  windowRange,
} from '../../lib/year-windows';
import { byId, passageHtml, question, readData } from '../book';
import type { SceneEnv } from '../env';
import { reveal, wait } from '../motion';
import { ringSvg, windowFace, yearBack, type WindowCard } from './art';

const KEY = 'arbora-year';

interface NoteEntry extends JournalEntry {
  w: number;
  y: number;
  text: string;
}

const isNote = (e: JournalEntry): e is NoteEntry =>
  typeof e.w === 'number' && typeof e.y === 'number' && typeof e.text === 'string';

const STAGE = `
<div class="year-layout">
  <div class="ring" id="year-ring"></div>
  <div class="actions year-actions"><button class="sbtn" id="year-draw" type="button">Turn the needle</button><button class="sbtn quiet" id="year-open" type="button" hidden>Read</button></div>
  <div class="pair" id="year-pair"></div>
</div>
<div id="year-book" class="out"></div>
<div class="actions"><button class="sbtn quiet" id="year-notes" type="button" aria-expanded="false">Notebook</button></div>
<div id="year-notes-box" hidden>
  <div class="notebook" id="year-notebook"></div>
  <div class="actions"><button class="sbtn quiet" id="year-review" type="button">Review the season just ended</button><button class="sbtn quiet" id="year-copy" type="button">Copy the whole notebook as text</button></div>
</div>`;

export function mount(root: HTMLElement, env: SceneEnv): void {
  const data = readData<YearData>(root);
  root.insertAdjacentHTML('beforeend', STAGE);
  const now = env.now();
  const today = windowFor(now, data.terms);
  const year = now.getFullYear();
  const ring = byId(root, 'year-ring');
  const pair = byId(root, 'year-pair');
  const drawButton = byId<HTMLButtonElement>(root, 'year-draw');
  const openButton = byId<HTMLButtonElement>(root, 'year-open');
  const notesButton = byId<HTMLButtonElement>(root, 'year-notes');
  const notesBox = byId(root, 'year-notes-box');
  const reviewButton = byId<HTMLButtonElement>(root, 'year-review');
  const book = byId(root, 'year-book');
  const notebook = byId(root, 'year-notebook');

  const card = (index: number): WindowCard => ({
    index,
    name: data.windows[index]!,
    season: seasonOf(index, data.seasons),
  });

  let journal: Journal = loadJournal(env.storage, KEY);
  const save = (next: Journal) => {
    journal = next;
    storeJournal(env.storage, KEY, journal);
  };
  let drawn: number | null = null;
  let rotation = needleAngle(today);
  let busy = false;
  let reviewing = false;

  const setNeedle = () => {
    const el = ring.querySelector<SVGGElement>('[data-needle]');
    if (el) el.style.transform = `rotate(${f(rotation)}deg)`;
  };
  const drawRing = (highlight: string | null) => {
    ring.innerHTML = ringSvg(today, data.seasons, highlight);
    setNeedle();
  };

  const renderPair = (fresh: boolean) => {
    const yours =
      drawn === null
        ? `<div class="cardbox">${yearBack()}</div>`
        : `<div class="cardbox${fresh ? ' new' : ''}">${windowFace(card(drawn))}</div>`;
    pair.innerHTML = `<figure><div class="cardbox">${windowFace(card(today))}</div></figure><figure>${yours}</figure>`;
  };

  const notes = (w: number) =>
    journal.entries
      .filter(isNote)
      .filter((n) => n.w === w)
      .sort((a, b) => a.y - b.y);

  const notebookText = () =>
    journal.entries
      .filter(isNote)
      .sort((a, b) => a.w - b.w || a.y - b.y)
      .map((n) => `${n.w + 1}. ${data.windows[n.w]} · ${n.y}: ${n.text}`)
      .join('\n');

  const renderNotebook = () => {
    const all = notes(today);
    const mine = all.find((n) => n.y === year);
    const others = all.filter((n) => n.y !== year);
    let h = `<h4>Window ${today + 1} · ${esc(data.windows[today]!)}<span>Notebook · this device</span></h4>`;
    if (others.length) {
      for (const n of others)
        h += `<div class="nb-line"><span class="seal">${n.y}</span><span>${esc(n.text)}</span></div>`;
    } else {
      h += `<div class="nb-line ghost"><span class="seal">${year - 1}</span><span>Nothing written here in other years yet. Next year, whatever you write today is the first thing you will see in this window.</span></div>`;
    }
    if (mine) h += `<div class="nb-line"><span class="seal">${year}</span><span>${esc(mine.text)}</span></div>`;
    else
      h += `<div class="nb-line"><span class="seal">${year}</span><div class="keep"><label class="sr-only" for="year-note">One line. What did you see outside today?</label><textarea id="year-note" placeholder="One line. What did you see outside today?"></textarea><div class="actions"><button class="sbtn" id="year-write" type="button">Write it on the page</button></div></div></div>`;
    notebook.innerHTML = h;
    notebook.querySelector('#year-write')?.addEventListener('click', () => {
      const text = byId<HTMLTextAreaElement>(notebook, 'year-note').value.trim();
      if (!text) return;
      save(withEntry(journal, { iso: env.now().toISOString(), w: today, y: year, text }));
      renderNotebook();
    });
  };

  const openBook = () => {
    if (drawn === null) return;
    openButton.hidden = true;
    const yours = card(drawn);
    const world = card(today);
    const others = notes(today).filter((n) => n.y !== year);
    const passage = yours.season.passages[Math.floor(env.random() * yours.season.passages.length)]!;
    let h = `<div class="book"><p class="bk-kicker">Window ${today + 1} and window ${drawn + 1}</p><h4 class="bk-title">${esc(yours.name)}</h4>`;
    h += `<p class="bk-teach">The world is in ${esc(world.season.name.toLowerCase())}: ${esc(world.name.toLowerCase())}. You drew a window in ${esc(yours.season.name.toLowerCase())}, ${esc(formatRange(windowRange(drawn, year, data.terms)))}. Hold the two together for a moment before deciding what they mean.</p>`;
    h += passageHtml(passage);
    h += `<p class="bk-note">In Japan's old calendar, the world's window is called “${esc(data.ko[today]!)}.”${others.length ? ` A year ago in this window you wrote: “${esc(others[others.length - 1]!.text)}”` : ''}</p>`;
    h += question('Sit with', 'What in you belongs to the window you drew, while the world moves through this one?');
    book.innerHTML = `${h}</div>`;
    reveal(book);
  };

  const turn = () => {
    if (busy) return;
    busy = true;
    drawButton.disabled = true;
    openButton.hidden = true;
    book.innerHTML = '';
    const pick = pickOtherWindow(today, env.random);
    const current = ((rotation % 360) + 360) % 360;
    const delta = (((needleAngle(pick) - current) % 360) + 360) % 360;
    rotation += 720 + delta;
    setNeedle();
    reveal(ring);
    void wait(2900).then(() => {
      drawn = pick;
      renderPair(true);
      openButton.hidden = false;
      drawButton.disabled = false;
      busy = false;
      reveal(pair.lastElementChild!, 'nearest');
    });
  };

  const toggleNotes = () => {
    const open = notesBox.hidden;
    notesBox.hidden = !open;
    notesButton.setAttribute('aria-expanded', String(open));
    if (open) reveal(notesBox, 'nearest');
  };

  const review = () => {
    reviewing = !reviewing;
    reviewButton.textContent = reviewing ? 'Close the review' : 'Review the season just ended';
    if (!reviewing) {
      drawRing(null);
      renderNotebook();
      return;
    }
    const ended = previousSeason(seasonOf(today, data.seasons), data.seasons);
    drawRing(ended.key);
    let h = `<h4>The season just ended · ${esc(ended.name)}<span>Feast-day review</span></h4><div class="review">`;
    for (let w = ended.from; w <= ended.to; w++) {
      const ns = notes(w);
      h += `<div class="nb-line${ns.length ? '' : ' ghost'}"><span class="seal">${w + 1}</span><span><b>${esc(data.windows[w]!)}.</b> ${ns.length ? ns.map((n) => `${n.y}: ${esc(n.text)}`).join(' · ') : 'nothing written yet'}</span></div>`;
    }
    h += `</div><p class="bk-note">At the equinox or solstice that closes a season, the ring lights it and the notebook opens every page of it.</p>${passageHtml(ended.passages[0]!)}`;
    notebook.innerHTML = h;
    reveal(notebook);
  };

  drawRing(null);
  renderPair(false);
  renderNotebook();
  const copyButton = byId<HTMLButtonElement>(root, 'year-copy');
  copyButton.addEventListener('click', () => {
    void navigator.clipboard.writeText(notebookText()).then(() => {
      copyButton.textContent = 'Copied';
      setTimeout(() => (copyButton.textContent = 'Copy the whole notebook as text'), 1500);
    });
  });
  drawButton.addEventListener('click', turn);
  openButton.addEventListener('click', openBook);
  notesButton.addEventListener('click', toggleNotes);
  reviewButton.addEventListener('click', review);
}
