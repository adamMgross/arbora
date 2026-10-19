import { createHash } from 'node:crypto';

export interface BuiltFile {
  path: string;
  bytes: string | Uint8Array;
}

const WORKER = 'sw.js';

export function renderServiceWorker(template: string, files: BuiltFile[]): string {
  if (!template.includes('__CACHE_NAME__') || !template.includes('__PRECACHE_URLS__')) {
    throw new Error('Service worker template is missing a placeholder');
  }
  const shipped = files.filter((f) => f.path !== WORKER).sort((a, b) => a.path.localeCompare(b.path));
  const hash = createHash('sha256');
  for (const file of shipped) hash.update(file.path).update('\0').update(file.bytes).update('\0');
  return template
    .replace('__CACHE_NAME__', `arbora-${hash.digest('hex').slice(0, 10)}`)
    .replace('__PRECACHE_URLS__', JSON.stringify(['./', ...shipped.map((f) => f.path)]));
}
