import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { captureSite, ensureFontsHar } from './capture.mjs';
import { compareData, compareImages } from './compare.mjs';
import { listFiles, listPages, prepareSite, repoRoot, serve } from './site.mjs';

const { values } = parseArgs({
  options: {
    base: { type: 'string', default: 'HEAD~1' },
    candidate: { type: 'string', default: 'dist' },
    pages: { type: 'string' },
    'no-screenshots': { type: 'boolean', default: false },
    'allow-missing': { type: 'string' },
  },
});

const baseDir = prepareSite(values.base);
const candidateDir = prepareSite(values.candidate);
const basePages = listPages(baseDir);
const candidatePages = new Set(listPages(candidateDir));
const filter = values.pages?.split(',');
const pages = basePages.filter((p) => !filter || filter.some((f) => p.includes(f)));

const NOT_SITE_FILES = /^(\.gitignore|\.nojekyll|README\.md|CHARTER\.md|DESIGN\.md|CLAUDE\.md|test-results\/.*)$/;
const allowMissing = new Set(values['allow-missing']?.split(',') ?? []);
const candidateFiles = new Set(listFiles(candidateDir));
const failures = [];
for (const file of listFiles(baseDir)) {
  if (NOT_SITE_FILES.test(file) || candidateFiles.has(file) || allowMissing.has(file)) continue;
  failures.push({ key: file, kind: 'route', detail: 'missing in candidate' });
}

const [baseServer, candidateServer] = await Promise.all([serve(baseDir), serve(candidateDir)]);
const launch = () => chromium.launch();
const harPath = join(repoRoot, '.parity/fonts.har');
const screenshots = !values['no-screenshots'];

try {
  const fontBrowser = await launch();
  await ensureFontsHar(fontBrowser, baseServer.url, basePages, harPath);
  await fontBrowser.close();
  const [baseResults, candidateResults] = await Promise.all([
    captureSite({ launch, baseUrl: baseServer.url, pages, harPath, screenshots }),
    captureSite({
      launch,
      baseUrl: candidateServer.url,
      pages: pages.filter((p) => candidatePages.has(p)),
      harPath,
      screenshots,
    }),
  ]);
  const diffDir = join(repoRoot, '.parity/diff');
  let shots = 0;
  for (const [key, base] of baseResults) {
    const candidate = candidateResults.get(key);
    if (!candidate) continue;
    failures.push(...compareData(key, base.data, candidate.data));
    if (base.png && candidate.png) {
      shots++;
      const result = compareImages(base.png, candidate.png);
      if (!result.ok) {
        failures.push({ key, kind: 'screenshot', detail: result.reason });
        if (result.diffPng) {
          mkdirSync(diffDir, { recursive: true });
          writeFileSync(join(diffDir, `${key.replace(/[^\w.-]+/g, '_')}.png`), result.diffPng);
        }
      }
    }
  }
  console.log(`pages ${pages.length}, captures ${baseResults.size}, screenshots ${shots}, failures ${failures.length}`);
} finally {
  baseServer.close();
  candidateServer.close();
}

for (const f of failures.slice(0, 40)) {
  console.log(`FAIL ${f.kind} ${f.key}${f.detail ? ` ${f.detail}` : ''}${f.reordered ? ' (order changed)' : ''}`);
  for (const line of (f.onlyBase ?? []).slice(0, 3)) console.log(`  - ${line.slice(0, 160)}`);
  for (const line of (f.onlyCandidate ?? []).slice(0, 3)) console.log(`  + ${line.slice(0, 160)}`);
}
if (failures.length > 40) console.log(`... ${failures.length - 40} more`);
process.exit(failures.length ? 1 : 0);
