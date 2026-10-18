import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';
import { parse } from 'yaml';

export function yamlListLoader(path: string): Loader {
  return {
    name: 'yaml-list-loader',
    load: async ({ collection, store, parseData, generateDigest, config, watcher }) => {
      const root = join(fileURLToPath(config.root), path);
      const files = () =>
        statSync(root).isDirectory()
          ? readdirSync(root)
              .filter((f) => f.endsWith('.yml'))
              .sort()
              .map((f) => join(root, f))
          : [root];
      const loadAll = async () => {
        store.clear();
        const seen = new Map<string, string>();
        for (const file of files()) {
          const items = parse(readFileSync(file, 'utf8')) as Array<{ id: string }>;
          for (const { id, ...fields } of items) {
            const first = seen.get(id);
            if (first) throw new Error(`Duplicate id "${id}" in collection "${collection}": ${file} and ${first}`);
            seen.set(id, file);
            const data = await parseData({ id, data: fields, filePath: file });
            store.set({ id, data, digest: generateDigest(data) });
          }
        }
      };
      await loadAll();
      watcher?.add(root);
      watcher?.on('change', (changed) => {
        if (changed.startsWith(root)) void loadAll();
      });
    },
  };
}
