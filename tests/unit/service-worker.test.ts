import { describe, expect, it } from 'vitest';
import { renderServiceWorker } from '../../integrations/service-worker';

const template = "const CACHE_NAME = '__CACHE_NAME__';\nconst PRECACHE_URLS = __PRECACHE_URLS__;\n";
const site = [
  { path: 'index.html', bytes: '<html>home</html>' },
  { path: '_astro/Base.abc123.css', bytes: 'body{}' },
  { path: 'sw.js', bytes: 'old worker' },
];

const precacheOf = (source: string): string[] => JSON.parse(source.match(/PRECACHE_URLS = (\[.*\]);/)![1]!);
const nameOf = (source: string): string => source.match(/CACHE_NAME = '([^']+)'/)![1]!;

describe('renderServiceWorker', () => {
  it('precaches the scope root and every built file except the worker itself', () => {
    expect(precacheOf(renderServiceWorker(template, site)).sort()).toEqual([
      './',
      '_astro/Base.abc123.css',
      'index.html',
    ]);
  });

  it('gives the same cache name for the same build regardless of file order', () => {
    expect(nameOf(renderServiceWorker(template, site))).toBe(
      nameOf(renderServiceWorker(template, [...site].reverse())),
    );
  });

  it('changes the cache name when any built file changes, so stale pages are evicted on the next deploy', () => {
    const before = nameOf(renderServiceWorker(template, site));
    const edited = site.map((f) => (f.path === 'index.html' ? { ...f, bytes: '<html>changed</html>' } : f));
    expect(nameOf(renderServiceWorker(template, edited))).not.toBe(before);
  });

  it('changes the cache name when a file is added or removed', () => {
    const before = nameOf(renderServiceWorker(template, site));
    expect(nameOf(renderServiceWorker(template, [...site, { path: 'new.html', bytes: 'x' }]))).not.toBe(before);
    expect(nameOf(renderServiceWorker(template, site.slice(1)))).not.toBe(before);
  });

  it('ignores the previous worker when naming the cache, so rebuilding is stable', () => {
    const rebuilt = site.map((f) => (f.path === 'sw.js' ? { ...f, bytes: 'different old worker' } : f));
    expect(nameOf(renderServiceWorker(template, rebuilt))).toBe(nameOf(renderServiceWorker(template, site)));
  });

  it('fails if the template lost a placeholder', () => {
    expect(() => renderServiceWorker('const CACHE_NAME = "x";', site)).toThrow('placeholder');
  });
});
