import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { parse } from 'yaml';

const API = 'https://commons.wikimedia.org/w/api.php';
const AGENT = 'ArboraArtFetch/1.0 (https://github.com/adamMgross/arbora)';
const SOURCE_WIDTH = 2400;
const MASTER_EDGE = 1200;

export function cropRegion(width, height, trim = {}) {
  const { top = 0, right = 0, bottom = 0, left = 0 } = trim;
  const region = {
    left: Math.round((width * left) / 100),
    top: Math.round((height * top) / 100),
    width: Math.round((width * (100 - left - right)) / 100),
    height: Math.round((height * (100 - top - bottom)) / 100),
  };
  if (region.width <= 0 || region.height <= 0) throw new Error(`The trim leaves nothing left of the picture`);
  return region;
}

export function commonsTitle(source) {
  const match = /^https:\/\/commons\.wikimedia\.org\/wiki\/(File:.+)$/.exec(source);
  if (!match) throw new Error(`Not a Commons file page: ${source}`);
  return decodeURIComponent(match[1]).replace(/_/g, ' ');
}

async function sourceUrl(source) {
  const query = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'imageinfo',
    iiprop: 'url|size',
    iiurlwidth: String(SOURCE_WIDTH),
    titles: commonsTitle(source),
  });
  const response = await fetch(`${API}?${query}`, { headers: { 'User-Agent': AGENT } });
  const page = Object.values((await response.json()).query.pages)[0];
  const info = page.imageinfo?.[0];
  if (!info) throw new Error(`Commons has no file for ${source}`);
  return info.width > SOURCE_WIDTH ? info.thumburl : info.url;
}

async function writeMaster(picture, out) {
  const response = await fetch(await sourceUrl(picture.source), { headers: { 'User-Agent': AGENT } });
  if (!response.ok) throw new Error(`Download failed (${response.status}) for ${picture.source}`);
  const original = sharp(Buffer.from(await response.arrayBuffer())).rotate();
  const { width, height } = await original.metadata();
  await original
    .extract(cropRegion(width, height, picture.trim))
    .resize({ width: MASTER_EDGE, height: MASTER_EDGE, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .toColorspace('srgb')
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(out);
}

export function deckPictures(deck, yamlText) {
  return parse(yamlText).flatMap((entry) => (entry.picture ? [{ id: entry.id, picture: entry.picture }] : []));
}

function contactSheet(deck, entries) {
  const cells = entries
    .map(
      ({ id, picture }) =>
        `<figure><img src="../src/assets/decks/${deck}/${id}.jpg"><figcaption>${id}<br>${picture.title}</figcaption></figure>`,
    )
    .join('');
  return `<!doctype html><meta charset="utf-8"><title>${deck} masters</title><style>body{font:13px system-ui;display:flex;flex-wrap:wrap;gap:12px}figure{margin:0;width:220px}img{width:100%}</style>${cells}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const decks = args.filter((a) => !a.startsWith('--'));
  for (const deck of decks) {
    const entries = deckPictures(deck, readFileSync(`src/content/decks/${deck}.yml`, 'utf8'));
    const dir = join('src/assets/decks', deck);
    mkdirSync(dir, { recursive: true });
    let written = 0;
    for (const { id, picture } of entries) {
      const out = join(dir, `${id}.jpg`);
      if (existsSync(out) && !force) continue;
      await writeMaster(picture, out);
      written++;
      console.log(`${deck}: ${id}`);
    }
    mkdirSync('.art', { recursive: true });
    writeFileSync(join('.art', `${deck}.html`), contactSheet(deck, entries));
    console.log(`${deck}: ${written} written, ${entries.length} in all, contact sheet at .art/${deck}.html`);
  }
}
