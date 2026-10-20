import type { CardPicture, DeckPassage } from '../lib/decks';
import { esc } from '../lib/svg';

export const passageHtml = (p: DeckPassage): string =>
  `<blockquote class="bk-pass"><p>${p.html}</p><cite>${p.attributionHtml}</cite></blockquote>`;

export const credit = ({ title, artist, year, source }: CardPicture): string =>
  `<p class="bk-credit">Picture: <a href="${esc(source)}" target="_blank" rel="noopener">${esc(title)}</a>, ${esc(artist)}, ${esc(year)}</p>`;

export const niceDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export function keepForm(id: string, keepLabel: string, setLabel: string, placeholder: string): string {
  return `<div class="keep"><label class="sr-only" for="${id}-line">${esc(placeholder)}</label><textarea id="${id}-line" placeholder="${esc(placeholder)}"></textarea><div class="actions"><button class="sbtn" id="${id}-keep" type="button">${esc(keepLabel)}</button><button class="sbtn quiet" id="${id}-set" type="button">${esc(setLabel)}</button></div></div>`;
}

export const question = (label: string, text: string): string =>
  `<p class="bk-q"><span>${esc(label)}</span>${esc(text)}</p>`;

export const svgOpen = (label?: string): string =>
  `<svg viewBox="0 0 280 480" class="cardsvg" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>`;

export function readData<T>(root: HTMLElement): T {
  const script = root.querySelector('script[type="application/json"]');
  if (!script) throw new Error('A scene needs its data script');
  return JSON.parse(script.textContent ?? '') as T;
}

export function byId<T extends HTMLElement = HTMLElement>(root: ParentNode, id: string): T {
  const el = root.querySelector<T>(`#${id}`);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}
