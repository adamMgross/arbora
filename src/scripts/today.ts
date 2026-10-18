import { dayOfYear, pickIndex, shuffledIndex } from '../lib/daily';
import { loadSaved, removeAt, storeSaved, toggleSaved, isSaved, type SavedReading } from '../lib/saved-readings';
import { seasonOf, timeOfDay } from '../lib/season';
import type { PoolReading, TodayPools } from '../lib/today-pools';
import { byId } from './dom';

const NOW_LABEL =
  '<span style="font-family: var(--font-ui); font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--lichen); vertical-align: middle; margin-left: 0.5em;">now</span>';

const FADE_MS = 200;

function fadeSwap(el: HTMLElement, swap: () => void) {
  el.style.transition = 'opacity 0.25s';
  el.style.opacity = '0';
  setTimeout(() => {
    swap();
    el.style.opacity = '1';
  }, FADE_MS);
}

export function initToday(): void {
  if (!document.getElementById('reading-text')) return;

  const pools = JSON.parse(document.querySelector('script[type="application/json"]')!.textContent ?? '') as TodayPools;
  const { morningInvocations, readings: canonReadings, eveningReflections } = pools;

  const now = new Date();
  const period = timeOfDay(now.getHours());
  const today = dayOfYear(now);
  let morningIndex = pickIndex(today, morningInvocations.length);
  let readingIndex = pickIndex(today, canonReadings.length);
  let eveningIndex = pickIndex(today, eveningReflections.length);

  const morningText = byId('morning-text');
  const readingText = byId('reading-text');
  const readingSource = byId('reading-source');
  const eveningText = byId('evening-text');
  const canonLink = byId<HTMLAnchorElement>('reading-canon-link');
  const bookmark = byId('reading-bookmark');

  byId('season-greeting').textContent = pools.seasonGreetings[seasonOf(now.getMonth())];
  morningText.textContent = morningInvocations[morningIndex]!;
  eveningText.textContent = eveningReflections[eveningIndex]!;

  const setReading = (reading: PoolReading) => {
    readingText.textContent = reading.text;
    readingSource.textContent = '— ' + reading.source;
  };
  setReading(canonReadings[readingIndex]!);

  const setCanonLink = (reading: PoolReading) => {
    if (reading.page) {
      canonLink.href = reading.page;
      canonLink.textContent = 'Explore ' + (reading.label || 'this tradition') + ' →';
      canonLink.style.display = '';
    } else {
      canonLink.style.display = 'none';
    }
  };
  setCanonLink(canonReadings[readingIndex]!);

  const currentReading = (): SavedReading => canonReadings[readingIndex]!;

  const updateBookmark = () => {
    const saved = isSaved(loadSaved(localStorage), currentReading());
    bookmark.textContent = saved ? 'saved ♥' : 'save';
    bookmark.dataset.saved = saved ? 'true' : 'false';
  };

  const savedSection = byId('saved-readings-section');
  const savedList = byId('saved-readings-list');

  const renderSaved = () => {
    const saved = loadSaved(localStorage);
    if (saved.length === 0) {
      savedSection.classList.remove('is-visible');
      return;
    }
    savedSection.classList.add('is-visible');
    savedList.innerHTML = '';
    saved.forEach((reading, i) => {
      const item = document.createElement('div');
      item.className = 'saved-item';
      const quote = document.createElement('p');
      quote.className = 'saved-item-text';
      quote.textContent = reading.text;
      const source = document.createElement('p');
      source.className = 'saved-item-source';
      source.textContent = '— ' + reading.source;
      const remove = document.createElement('button');
      remove.className = 'saved-remove-btn';
      remove.textContent = 'remove';
      remove.addEventListener('click', () => {
        storeSaved(localStorage, removeAt(loadSaved(localStorage), i));
        renderSaved();
        updateBookmark();
      });
      item.append(quote, source, remove);
      savedList.appendChild(item);
    });
  };

  updateBookmark();
  renderSaved();

  bookmark.addEventListener('click', () => {
    storeSaved(localStorage, toggleSaved(loadSaved(localStorage), currentReading()));
    updateBookmark();
    renderSaved();
  });

  byId('clear-saved').addEventListener('click', () => {
    storeSaved(localStorage, []);
    renderSaved();
    updateBookmark();
  });

  const headingFor = { morning: 'morning-heading', afternoon: 'reading-heading', evening: 'evening-heading' } as const;
  byId(headingFor[period]).insertAdjacentHTML('beforeend', NOW_LABEL);

  document.querySelectorAll<HTMLElement>('.shuffle-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const section = button.dataset.section;
      if (section === 'morning') {
        morningIndex = shuffledIndex(morningIndex, morningInvocations.length, Math.random);
        const next = morningInvocations[morningIndex]!;
        fadeSwap(morningText.parentElement!, () => (morningText.textContent = next));
      } else if (section === 'reading') {
        readingIndex = shuffledIndex(readingIndex, canonReadings.length, Math.random);
        const next = canonReadings[readingIndex]!;
        const faded = [readingText, readingSource, canonLink];
        for (const el of faded) {
          el.style.transition = 'opacity 0.25s';
          el.style.opacity = '0';
        }
        setTimeout(() => {
          setReading(next);
          setCanonLink(next);
          updateBookmark();
          for (const el of faded) el.style.opacity = '1';
        }, FADE_MS);
      } else {
        eveningIndex = shuffledIndex(eveningIndex, eveningReflections.length, Math.random);
        const next = eveningReflections[eveningIndex]!;
        fadeSwap(eveningText.parentElement!, () => (eveningText.textContent = next));
      }
    });
  });
}
