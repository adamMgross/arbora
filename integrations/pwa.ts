import type { AstroIntegration } from 'astro';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderServiceWorker, type BuiltFile } from './service-worker';

function walk(dir: string, prefix = ''): BuiltFile[] {
  return readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((entry) => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory() ? walk(dir, rel) : [{ path: rel, bytes: readFileSync(join(dir, rel)) }];
  });
}

export function pwa(templatePath: string): AstroIntegration {
  return {
    name: 'arbora-pwa',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const out = fileURLToPath(dir);
        writeFileSync(join(out, 'sw.js'), renderServiceWorker(readFileSync(templatePath, 'utf8'), walk(out)));
      },
    },
  };
}
