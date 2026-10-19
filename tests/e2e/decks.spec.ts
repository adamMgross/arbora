import { expect, test, type Page } from '@playwright/test';

const SPRING_NIGHT = new Date('2026-04-22T21:00:00-07:00');
const SPRING_NOON = new Date('2026-04-22T12:00:00-07:00');
const NEXT_NIGHT = new Date('2026-04-23T21:00:00-07:00');

async function openDeck(page: Page, path: string, at: Date, seed?: () => void) {
  await page.addInitScript(() => {
    let a = 0x9e3779b9;
    Math.random = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  if (seed) await page.addInitScript(seed);
  await page.clock.install({ time: at });
  await page.goto(path);
  await page.locator('arbora-scene.mounted').waitFor();
}

const adjustEyes = async (page: Page, ms = 12500) => {
  await page.locator('#sky-dome').scrollIntoViewIfNeeded();
  await expect(page.locator('arbora-scene')).toHaveClass(/adapting/);
  await page.clock.runFor(ms);
};

const journal = (page: Page, key: string) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null') as unknown, key);

test.describe('the hub', () => {
  test('links to the three decks and loads no deck code on pages without one', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));
    await page.goto('oracles.html');
    await expect(page.locator('.deck-link')).toHaveCount(3);
    await expect(page.locator('.deck-link .cardsvg')).toHaveCount(3);
    await page.goto('cosmology.html');
    await page.waitForLoadState('networkidle');
    expect(requests.some((u) => /_astro\/(wood|sky|year)\./.test(u))).toBe(false);
    await page.goto('wood.html');
    await page.locator('arbora-scene.mounted').waitFor();
    expect(requests.some((u) => /_astro\/wood\./.test(u))).toBe(true);
    expect(requests.some((u) => /_astro\/(sky|year)\./.test(u))).toBe(false);
  });
});

test.describe('the year', () => {
  test('shows the window for the date, draws a different companion once a day, and reopens tomorrow', async ({
    page,
  }) => {
    await openDeck(page, 'year.html', SPRING_NOON);
    await expect(page.locator('[data-today]')).toHaveText('16');
    const world = page.locator('#year-pair figure').first().locator('.cardsvg');
    await expect(world).toHaveAttribute('aria-label', 'Window 16: Goldfields carpet the valley floor');
    await expect(page.locator('#year-open')).toBeDisabled();
    await page.locator('#year-draw').click();
    await page.clock.runFor(3000);
    const yours = page.locator('#year-pair figure').nth(1).locator('.cardsvg');
    await expect(yours).toHaveAttribute('aria-label', /^Window \d+: /);
    const label = await yours.getAttribute('aria-label');
    expect(label).not.toContain('Window 16:');
    await expect(page.locator('#year-draw')).toBeDisabled();
    await expect(page.locator('#year-closed')).toContainText('You drew today');
    await page.locator('#year-open').click();
    await expect(page.locator('#year-book .bk-title')).toBeVisible();
    await expect(page.locator('#year-book .bk-kicker')).toHaveText(/^Window 16 and window \d+$/);
    await expect(page.locator('#year-book .bk-pass cite')).not.toBeEmpty();
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#year-pair figure').nth(1).locator('.cardsvg')).toHaveAttribute('aria-label', label!);
    await expect(page.locator('#year-draw')).toBeDisabled();
    await page.clock.setSystemTime(NEXT_NIGHT);
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#year-draw')).toBeEnabled();
  });

  test('a notebook line lands on the page of the day under its year and is the first thing shown a year later', async ({
    page,
  }) => {
    await openDeck(page, 'year.html', SPRING_NOON);
    await expect(page.locator('.notebook h4')).toContainText('Window 16');
    await expect(page.locator('.nb-line.ghost')).toHaveCount(1);
    await page.locator('#year-note').fill('Goldfields all the way to the levee.');
    await page.locator('#year-write').click();
    await expect(page.locator('.nb-line')).toHaveCount(2);
    await expect(page.locator('.nb-line').nth(1).locator('.seal')).toHaveText('2026');
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('.nb-line').nth(1)).toContainText('Goldfields all the way to the levee.');
    expect(await journal(page, 'arbora-year')).toMatchObject({ lastDay: null });
    await page.clock.setSystemTime(new Date('2027-04-22T12:00:00-07:00'));
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('.nb-line').first()).toContainText('Goldfields all the way to the levee.');
    await expect(page.locator('.nb-line').first().locator('.seal')).toHaveText('2026');
    await expect(page.locator('#year-note')).toBeVisible();
  });

  test('the whole notebook can be copied out as plain text', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openDeck(page, 'year.html', SPRING_NOON, () => {
      if (localStorage.getItem('arbora-year')) return;
      localStorage.setItem(
        'arbora-year',
        JSON.stringify({
          entries: [
            { iso: 'a', w: 15, y: 2025, text: 'Levee gold.' },
            { iso: 'b', w: 2, y: 2026, text: 'Bees in the manzanita.' },
          ],
          lastDay: null,
          draw: null,
        }),
      );
    });
    await page.locator('#year-copy').click();
    await expect(page.locator('#year-copy')).toHaveText('Copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '3. Manzanita bells hum with bees · 2026: Bees in the manzanita.\n16. Goldfields carpet the valley floor · 2025: Levee gold.',
    );
  });

  test('the review lights the season just ended and lists every one of its windows', async ({ page }) => {
    await openDeck(page, 'year.html', SPRING_NOON);
    await page.locator('#year-review').click();
    await expect(page.locator('.notebook h4')).toContainText('The season just ended · Rain');
    await expect(page.locator('.review .nb-line')).toHaveCount(20);
    await expect(page.locator('.review .nb-line .seal').first()).toHaveText('53');
    await page.locator('#year-review').click();
    await expect(page.locator('.notebook h4')).toContainText('Window 16');
  });
});

test.describe('the sky', () => {
  test('opens the heavens after the eyes adjust, reads a plate above and below, and closes until tomorrow', async ({
    page,
  }) => {
    await openDeck(page, 'sky.html', SPRING_NIGHT);
    await expect(page.locator('#sky-cue')).toHaveText('Let your eyes adjust.');
    await expect(page.locator('#sky-read')).toContainText('Tonight · The Moon in');
    await expect(page.locator('#sky-dome')).not.toHaveClass(/day/);
    await page.locator('#sky-dome svg').click({ position: { x: 300, y: 250 }, force: true });
    await expect(page.locator('#sky-out .cardbox')).toHaveCount(0);
    await adjustEyes(page);
    await expect(page.locator('arbora-scene')).toHaveClass(/adapted/);
    await expect(page.locator('#sky-cue')).toHaveText('Lift your eyes. The heavens are open where the lights stand.');
    const svg = page.locator('#sky-dome svg');
    const box = (await svg.boundingBox())!;
    await svg.click({ position: { x: box.width / 2, y: box.height * 0.45 } });
    await page.clock.runFor(1500);
    await expect(page.locator('#sky-cue')).toHaveText(/^(You looked|By day)/);
    await expect(page.locator('#sky-out .cardbox .cardsvg')).toHaveCount(1);
    await page.locator('#sky-open').click();
    await expect(page.locator('#sky-book .above')).not.toBeEmpty();
    await expect(page.locator('#sky-book .below p').first()).toContainText('Set down');
    await expect(page.locator('#sky-book .below p').nth(1)).toContainText('Receive');
    await expect(page.locator('#sky-book .bk-pass cite')).not.toBeEmpty();
    await page.locator('#sky-line').fill('Quiet, and the moon low.');
    await page.locator('#sky-keep').click();
    await expect(page.locator('#sky-cue')).toHaveText('The heavens are closed for tonight.');
    const stored = (await journal(page, 'arbora-sky')) as { entries: Array<Record<string, unknown>>; lastDay: string };
    expect(stored.lastDay).toBe('2026-04-22');
    expect(stored.entries).toHaveLength(1);
    expect(stored.entries[0]).toMatchObject({ line: 'Quiet, and the moon low.', status: 'kept' });
    expect(String(stored.entries[0]!.heavens)).toContain('Tonight');
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#sky-closed')).toBeVisible();
    await adjustEyes(page);
    await svg.click({ position: { x: box.width / 2, y: box.height * 0.45 } });
    await page.clock.runFor(1500);
    await expect(page.locator('#sky-out .cardbox')).toHaveCount(0);
  });

  test('by day the Sun stands alone and any look opens the fourth heaven', async ({ page }) => {
    await openDeck(page, 'sky.html', SPRING_NOON);
    await expect(page.locator('#sky-dome')).toHaveClass(/day/);
    await expect(page.locator('#sky-dome svg text')).toContainText(['N', 'E', 'S', 'W', 'THE SUN']);
    await expect(page.locator('#sky-dome svg .beacon')).toHaveCount(0);
    await adjustEyes(page);
    const svg = page.locator('#sky-dome svg');
    const box = (await svg.boundingBox())!;
    await svg.click({ position: { x: box.width * 0.3, y: box.height * 0.5 } });
    await page.clock.runFor(1500);
    await expect(page.locator('#sky-cue')).toHaveText(/^By day the Sun stands alone, in \w+, the fourth heaven\.$/);
    await expect(page.locator('#sky-out .cardsvg')).toHaveAttribute('aria-label', 'The Sun, the center');
  });

  test('a line kept under a heaven is the first thing read when it opens again', async ({ page }) => {
    await openDeck(page, 'sky.html', SPRING_NOON, () => {
      localStorage.setItem(
        'arbora-sky',
        JSON.stringify({
          entries: [
            {
              iso: '2026-03-01T20:00:00.000Z',
              plate: 'sun',
              heavens: 'x',
              line: 'Give light without deciding to.',
              status: 'kept',
            },
          ],
          lastDay: '2026-03-01',
          draw: null,
        }),
      );
    });
    await adjustEyes(page);
    const svg = page.locator('#sky-dome svg');
    const box = (await svg.boundingBox())!;
    await svg.click({ position: { x: box.width * 0.5, y: box.height * 0.5 } });
    await page.clock.runFor(1500);
    await expect(page.locator('#sky-return .return')).toContainText('When the sun last opened for you');
    await expect(page.locator('#sky-return .return')).toContainText('Give light without deciding to.');
  });

  test('with reduced motion the firmament is open at once', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openDeck(page, 'sky.html', SPRING_NIGHT);
    await adjustEyes(page, 50);
    await expect(page.locator('arbora-scene')).toHaveClass(/adapted/);
  });
});

test.describe('the wood', () => {
  const walk = async (page: Page, lights: number) => {
    for (let i = 0; i < lights; i++) {
      await expect(page.locator('.wisp')).toHaveCount(3);
      await page.locator('.wisp').first().click({ force: true });
      await page.clock.runFor(3000);
    }
  };

  test('three lights fill the triptych, the book opens, a line is kept, and the wood closes for the day', async ({
    page,
  }) => {
    await openDeck(page, 'wood.html', SPRING_NIGHT);
    await expect(page.locator('#wood-trip')).toBeHidden();
    await page.locator('#wood-enter').click();
    await expect(page.locator('#wood-hold')).toBeHidden();
    await expect(page.locator('#wood-trip')).toBeVisible();
    await walk(page, 3);
    await expect(page.locator('#wood-trip .flip.flipped')).toHaveCount(3);
    await expect(page.locator('#wood-slot-Elder .flip-front .cardsvg')).toHaveAttribute('aria-label', /^Elder: /);
    await expect(page.locator('#wood-slot-Spirit .flip-front .cardsvg')).toHaveAttribute('aria-label', /^Spirit: /);
    await expect(page.locator('#wood-slot-Passage .flip-front .cardsvg')).toHaveAttribute('aria-label', /^Passage: /);
    await expect(page.locator('#wood-cue')).toHaveText('The three lights led here.');
    await page.locator('#wood-open').click();
    await expect(page.locator('#wood-book .bk-entry')).toHaveCount(3);
    await expect(page.locator('#wood-book .bk-pass cite')).toHaveCount(3);
    await expect(page.locator('#wood-book .bk-q span')).toHaveText('Sit with');
    const passageName = await page.locator('#wood-book .bk-entry').nth(2).locator('.bk-title').innerText();
    await page.locator('#wood-line').fill('I have been walking in circles on purpose.');
    await page.locator('#wood-keep').click();
    await expect(page.locator('#wood-cue')).toHaveText('The wood is closed for today.');
    const stored = (await journal(page, 'arbora-wood')) as { entries: Array<Record<string, unknown>>; lastDay: string };
    expect(stored.lastDay).toBe('2026-04-22');
    expect(stored.entries[0]).toMatchObject({ status: 'kept', line: 'I have been walking in circles on purpose.' });
    expect((stored.entries[0]!.cards as Record<string, string>).Passage).toBe(passageName);
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#wood-closed')).toContainText('The wood is closed until tomorrow');
    await expect(page.locator('#wood-enter')).toBeHidden();
    await expect(page.locator('#wood-trip .flip.flipped')).toHaveCount(3);
    await expect(page.locator('#wood-slot-Passage .flip-front .cardsvg')).toHaveAttribute(
      'aria-label',
      new RegExp(`^Passage: ${passageName}`),
    );
  });

  test('the next day the door returns the kept line and takes what came of it', async ({ page }) => {
    await openDeck(page, 'wood.html', NEXT_NIGHT, () => {
      if (localStorage.getItem('arbora-wood')) return;
      localStorage.setItem(
        'arbora-wood',
        JSON.stringify({
          entries: [
            {
              iso: '2026-04-23T04:10:00.000Z',
              cards: { Elder: 'The Aspen', Spirit: 'Kodama', Passage: 'The Nurse Log' },
              line: 'Let the old job be the log.',
              status: 'kept',
              outcome: '',
            },
          ],
          lastDay: '2026-04-22',
          draw: null,
        }),
      );
    });
    await expect(page.locator('#wood-enter')).toBeVisible();
    await expect(page.locator('#wood-return .return')).toContainText('Let the old job be the log.');
    await expect(page.locator('#wood-return .return')).toContainText('What came of it?');
    await page.locator('#wood-outcome').fill('It fed the garden.');
    await page.locator('#wood-outcome-save').click();
    await expect(page.locator('#wood-return .return')).toContainText('What came of it: It fed the garden.');
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#wood-return .return')).toContainText('What came of it: It fed the garden.');
  });

  test('a line left on a branch is never shown again', async ({ page }) => {
    await openDeck(page, 'wood.html', NEXT_NIGHT, () => {
      localStorage.setItem(
        'arbora-wood',
        JSON.stringify({
          entries: [
            { iso: 'x', cards: { Passage: 'The Dark Wood' }, line: 'A hard one.', status: 'branch', outcome: '' },
          ],
          lastDay: '2026-04-22',
          draw: null,
        }),
      );
    });
    await expect(page.locator('#wood-return .return')).toHaveCount(0);
    await expect(page.locator('#wood-enter')).toBeVisible();
  });

  test('for the table, one light draws one passage and nothing is saved', async ({ page }) => {
    await openDeck(page, 'wood.html', SPRING_NIGHT);
    await page.locator('#wood-table').check();
    await page.locator('#wood-enter').click();
    await expect(page.locator('#wood-cue')).toHaveText('One light for the table. Follow it.');
    await walk(page, 1);
    await expect(page.locator('#wood-trip .flip.flipped')).toHaveCount(1);
    await expect(page.locator('#wood-slot-Elder')).toBeHidden();
    await page.locator('#wood-open').click();
    await expect(page.locator('#wood-book .bk-entry')).toHaveCount(1);
    await expect(page.locator('#wood-book .bk-q span')).toHaveText('For the table');
    await expect(page.locator('#wood-keep')).toHaveCount(0);
    expect(await journal(page, 'arbora-wood')).toBeNull();
  });
});
