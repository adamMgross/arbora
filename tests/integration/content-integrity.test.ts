import { spawnSync } from 'node:child_process';
import { stripVTControlCharacters } from 'node:util';
import { appendFileSync, cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const repo = join(import.meta.dirname, '../..');
let work: string;

function build(dir: string) {
  const result = spawnSync('npx', ['astro', 'build'], {
    cwd: dir,
    encoding: 'utf8',
    env: { ...process.env, BASE_PATH: '/' },
  });
  return { ok: result.status === 0, output: stripVTControlCharacters(`${result.stdout}${result.stderr}`) };
}

function freshCopy() {
  const dir = mkdtempSync(join(tmpdir(), 'arbora-integrity-'));
  for (const entry of ['package.json', 'astro.config.mjs', 'tsconfig.json', 'src', 'public', 'integrations']) {
    cpSync(join(repo, entry), join(dir, entry), { recursive: true });
  }
  symlinkSync(join(repo, 'node_modules'), join(dir, 'node_modules'));
  return dir;
}

describe('content integrity', () => {
  beforeAll(() => {
    work = freshCopy();
  });
  afterAll(() => rmSync(work, { recursive: true, force: true }));

  it('builds an unmodified copy, so the failures below are caused by the injected defects', () => {
    expect(build(work).ok).toBe(true);
  }, 120_000);

  it('fails the build on a duplicate passage id', () => {
    const dir = freshCopy();
    appendFileSync(join(dir, 'src/content/passages/stoics.yml'), '- id: stoics-marcus-aurelius-1\n  text: duplicate\n');
    const { ok, output } = build(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(ok).toBe(false);
    expect(output).toContain('Duplicate id "stoics-marcus-aurelius-1" in collection "passages"');
  }, 120_000);

  it('fails the build when a page references a passage that does not exist', () => {
    const dir = freshCopy();
    const page = join(dir, 'src/content/canon/stoics.mdx');
    writeFileSync(page, readFileSync(page, 'utf8').replace('id="stoics-marcus-aurelius-1"', 'id="no-such-passage"'));
    const { ok, output } = build(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(ok).toBe(false);
    expect(output).toContain('Unknown passage id "no-such-passage"');
  }, 120_000);

  it('fails the build when a canon entry points at a neighbor that does not exist', () => {
    const dir = freshCopy();
    const file = join(dir, 'src/content/canon/stoics.mdx');
    writeFileSync(file, readFileSync(file, 'utf8').replace('next: fragments', 'next: no-such-entry'));
    const { ok, output } = build(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(ok).toBe(false);
    expect(output).toContain('no-such-entry');
  }, 120_000);

  it('fails the build when a deck card quotes a canon passage that does not exist', () => {
    const dir = freshCopy();
    appendFileSync(
      join(dir, 'src/content/decks/wood.yml'),
      [
        '- id: wood-ghost',
        '  circle: Spirit',
        '  name: Ghost',
        '  from: Nowhere',
        '  art: kodama',
        '  principle: principle-1',
        '  story: A card that quotes nothing.',
        '  passages:',
        '    - ref: no-such-passage',
        '',
      ].join('\n'),
    );
    const { ok, output } = build(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(ok).toBe(false);
    expect(output).toContain('no-such-passage');
  }, 120_000);

  it('fails the build when a deck card names art that is not drawn', () => {
    const dir = freshCopy();
    const file = join(dir, 'src/content/decks/wood.yml');
    writeFileSync(file, readFileSync(file, 'utf8').replace('art: kodama', 'art: sasquatch'));
    const { ok, output } = build(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(ok).toBe(false);
    expect(output).toContain('art: Invalid option');
  }, 120_000);

  it('fails the build on a field the schema does not define', () => {
    const dir = freshCopy();
    appendFileSync(join(dir, 'src/content/passages/stoics.yml'), '- id: stoics-extra\n  text: x\n  surprise: true\n');
    const { ok } = build(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(ok).toBe(false);
  }, 120_000);
});
