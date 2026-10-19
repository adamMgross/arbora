import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, posix } from 'node:path';

function walk(dir, prefix = '') {
  return readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((entry) => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory() ? walk(dir, rel) : [rel];
  });
}

const REFERENCE = /\b(?:href|src)="([^"]+)"/g;
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

export function verifyDist(dir, base = '/') {
  const problems = [];
  const root = base.endsWith('/') ? base : `${base}/`;
  const files = new Set(walk(dir));
  const pages = [...files].filter((f) => f.endsWith('.html'));

  const sitemap = files.has('sitemap.xml') ? readFileSync(join(dir, 'sitemap.xml'), 'utf8') : '';
  const listed = new Set([...sitemap.matchAll(/<loc>[^<]*\/([^/<]+\.html)<\/loc>/g)].map((m) => m[1]));
  for (const page of pages) if (!listed.has(page)) problems.push(`${page} is built but missing from sitemap.xml`);
  for (const href of listed) if (!files.has(href)) problems.push(`sitemap.xml lists ${href}, which was not built`);

  for (const page of pages) {
    const pageUrl = `${root}${page}`;
    for (const [, ref] of readFileSync(join(dir, page), 'utf8').matchAll(REFERENCE)) {
      if (EXTERNAL.test(ref)) continue;
      const path = ref.split(/[?#]/)[0];
      if (!path) continue;
      const resolved = path.startsWith('/') ? path : posix.join(posix.dirname(pageUrl), path);
      if (!resolved.startsWith(root)) {
        problems.push(`${page}: "${ref}" resolves outside the base path ${root}`);
      } else if (!files.has(resolved.slice(root.length)) && resolved !== root) {
        problems.push(`${page}: "${ref}" points at ${resolved.slice(root.length)}, which was not built`);
      }
    }
  }

  if (files.has('sw.js')) {
    const worker = readFileSync(join(dir, 'sw.js'), 'utf8');
    const list = worker.match(/PRECACHE_URLS = (\[.*\]);/);
    if (!list) problems.push('sw.js has no precache list');
    else {
      for (const url of JSON.parse(list[1])) {
        if (url !== './' && !files.has(url)) problems.push(`sw.js precaches ${url}, which was not built`);
      }
    }
  } else {
    problems.push('sw.js was not generated');
  }
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [dir = 'dist', base = '/'] = process.argv.slice(2);
  if (!existsSync(dir)) {
    console.error(`No build output at ${dir}`);
    process.exit(2);
  }
  const problems = verifyDist(dir, base);
  for (const problem of problems) console.error(problem);
  console.log(problems.length ? `${problems.length} problem(s)` : `ok: ${dir} verified under ${base}`);
  process.exit(problems.length ? 1 : 0);
}
