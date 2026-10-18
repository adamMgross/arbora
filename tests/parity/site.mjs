import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, symlinkSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

export const repoRoot = resolve(import.meta.dirname, '../..');

const git = (args) => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();

export function prepareSite(ref) {
  if (ref === 'dist') return join(repoRoot, 'dist');
  if (existsSync(ref) && statSync(ref).isDirectory()) return resolve(ref);
  const sha = git(['rev-parse', `${ref}^{commit}`]);
  const dir = join(repoRoot, '.parity/sites', sha.slice(0, 12));
  if (!existsSync(dir)) {
    const partial = `${dir}.partial`;
    rmSync(partial, { recursive: true, force: true });
    mkdirSync(partial, { recursive: true });
    execFileSync('sh', ['-c', 'git archive "$0" | tar -x -C "$1"', sha, partial], { cwd: repoRoot });
    renameSync(partial, dir);
  }
  if (!existsSync(join(dir, 'astro.config.mjs'))) return dir;
  const dist = join(dir, 'dist');
  if (!existsSync(dist)) {
    if (!existsSync(join(dir, 'node_modules'))) symlinkSync(join(repoRoot, 'node_modules'), join(dir, 'node_modules'));
    execFileSync('npx', ['astro', 'build'], {
      cwd: dir,
      stdio: 'inherit',
      env: { ...process.env, BASE_PATH: '/', SITE: 'http://127.0.0.1' },
    });
  }
  return dist;
}

export function listFiles(dir, prefix = '') {
  return readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((entry) => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory() ? listFiles(dir, rel) : [rel];
  });
}

export function listPages(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .sort();
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

export function serve(dir) {
  const server = createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = normalize(join(dir, pathname));
    if (!file.startsWith(dir)) return void res.writeHead(403).end();
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) return void res.writeHead(404).end('not found');
    res.writeHead(200, {
      'content-type': types[extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(readFileSync(file));
  });
  return new Promise((ok) =>
    server.listen(0, '127.0.0.1', () =>
      ok({ url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() }),
    ),
  );
}
