import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { PICTURE_BUDGET, verifyDist } from '../../scripts/verify-dist.mjs';

const dirs: string[] = [];
afterEach(() => dirs.splice(0).forEach((d) => rmSync(d, { recursive: true, force: true })));

function site(files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), 'arbora-dist-'));
  dirs.push(dir);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
}

const sitemap = (...hrefs: string[]) =>
  `<urlset>${hrefs.map((h) => `<url><loc>https://x.io/arbora/${h}</loc></url>`).join('')}</urlset>`;
const worker = (...urls: string[]) => `const PRECACHE_URLS = ${JSON.stringify(urls)};`;
const healthy = (): Record<string, string> => ({
  'index.html':
    '<a href="today.html">t</a><link rel="stylesheet" href="/arbora/_astro/a.css"><a href="https://example.org">x</a><a href="#top">y</a>',
  'today.html': '<a href="index.html">home</a>',
  '_astro/a.css': 'a{}',
  'sitemap.xml': sitemap('index.html', 'today.html'),
  'sw.js': worker('./', 'index.html', 'today.html', '_astro/a.css'),
});

describe('verifyDist', () => {
  it('accepts a consistent build under a base path', () => {
    expect(verifyDist(site(healthy()), '/arbora/')).toEqual([]);
  });

  it('reports a deck picture over the budget, so a phone never downloads an oversized draw', () => {
    const files = {
      ...healthy(),
      '_astro/fits.webp': 'x'.repeat(PICTURE_BUDGET),
      '_astro/heavy.webp': 'x'.repeat(PICTURE_BUDGET + 1),
    };
    expect(verifyDist(site(files), '/arbora/')).toEqual(['_astro/heavy.webp is 601 KB, over the picture budget']);
  });

  it('reports a page that is built but absent from the sitemap', () => {
    const files = { ...healthy(), 'orphan.html': '', 'sitemap.xml': sitemap('index.html', 'today.html') };
    expect(verifyDist(site(files), '/arbora/')).toEqual(['orphan.html is built but missing from sitemap.xml']);
  });

  it('reports a sitemap entry that was not built', () => {
    const files = { ...healthy(), 'sitemap.xml': sitemap('index.html', 'today.html', 'gone.html') };
    expect(verifyDist(site(files), '/arbora/')).toEqual(['sitemap.xml lists gone.html, which was not built']);
  });

  it('reports a relative link to a page that does not exist', () => {
    const files = { ...healthy(), 'today.html': '<a href="nowhere.html">x</a>' };
    expect(verifyDist(site(files), '/arbora/')).toEqual([
      'today.html: "nowhere.html" points at nowhere.html, which was not built',
    ]);
  });

  it('reports an absolute asset URL that ignores the base path', () => {
    const files = { ...healthy(), 'today.html': '<link href="/_astro/a.css">' };
    expect(verifyDist(site(files), '/arbora/')).toEqual([
      'today.html: "/_astro/a.css" resolves outside the base path /arbora/',
    ]);
  });

  it('reports a precache entry that was not built and a missing worker', () => {
    const stale = { ...healthy(), 'sw.js': worker('./', 'src/css/style.css') };
    expect(verifyDist(site(stale), '/arbora/')).toEqual(['sw.js precaches src/css/style.css, which was not built']);
    const { 'sw.js': _omitted, ...withoutWorker } = healthy();
    expect(verifyDist(site(withoutWorker), '/arbora/')).toEqual(['sw.js was not generated']);
  });
});
