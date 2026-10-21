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

async function settle(page: Page) {
  let last = -1;
  for (;;) {
    const y = await page.evaluate(() => scrollY);
    if (y === last) return;
    last = y;
    await page.waitForTimeout(150);
  }
}

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

const readDeck = <T>(page: Page) =>
  page.locator('arbora-scene script[type="application/json"]').evaluate((el) => JSON.parse(el.textContent ?? '') as T);

test.describe('the year', () => {
  test('shows the window for the date and draws a different companion every time the needle turns', async ({
    page,
  }) => {
    await openDeck(page, 'year.html', SPRING_NOON);
    await expect(page.locator('[data-today]')).toHaveText('16');
    const world = page.locator('#year-pair > div').first().locator('.face');
    await expect(world).toHaveAttribute('aria-label', 'Window 16: Lupine paints the hillsides');
    await expect(world.locator('figcaption')).toHaveText('16 Lupine paints the hillsides');
    await expect(world.locator('img')).toHaveAttribute('alt', /\w/);
    await expect(world.locator('img')).toHaveJSProperty('complete', true);
    await expect(page.locator('#year-open')).toBeHidden();
    const yours = page.locator('#year-pair > div').nth(1).locator('.face');
    for (let i = 0; i < 3; i++) {
      await page.locator('#year-draw').click();
      await expect(page.locator('#year-draw')).toBeDisabled();
      await page.clock.runFor(3000);
      await expect(yours).toHaveAttribute('aria-label', /^Window \d+: /);
      expect(await yours.getAttribute('aria-label')).not.toContain('Window 16:');
      await expect(page.locator('#year-draw')).toBeEnabled();
      await expect(page.locator('#year-open')).toBeVisible();
      await expect(page.locator('#year-book')).toBeEmpty();
    }
    await page.locator('#year-open').click();
    await expect(page.locator('#year-book .bk-title')).toBeVisible();
    await expect(page.locator('#year-book .bk-kicker')).toHaveText(/^Window 16 and window \d+$/);
    await expect(page.locator('#year-book .bk-pass cite')).not.toBeEmpty();
    await expect(page.locator('#year-book .bk-credit a')).toHaveCount(2);
    await page.locator('#year-draw').click();
    await expect(page.locator('#year-book')).toBeEmpty();
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#year-pair > div').nth(1).locator('.face')).toHaveCount(0);
    await expect(page.locator('#year-draw')).toBeEnabled();
  });

  test('a notebook line lands on the page of the day under its year and is the first thing shown a year later', async ({
    page,
  }) => {
    await openDeck(page, 'year.html', SPRING_NOON);
    await expect(page.locator('.notebook')).toBeHidden();
    await page.locator('#year-notes').click();
    await expect(page.locator('.notebook h4')).toContainText('Window 16');
    await expect(page.locator('.nb-line.ghost')).toHaveCount(1);
    await page.locator('#year-note').fill('Goldfields all the way to the levee.');
    await page.locator('#year-write').click();
    await expect(page.locator('.nb-line')).toHaveCount(2);
    await expect(page.locator('.nb-line').nth(1).locator('.seal')).toHaveText('2026');
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await page.locator('#year-notes').click();
    await expect(page.locator('.nb-line').nth(1)).toContainText('Goldfields all the way to the levee.');
    await page.clock.setSystemTime(new Date('2027-04-22T12:00:00-07:00'));
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await page.locator('#year-notes').click();
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
          lastDay: '2026-04-21',
          draw: { w: 40 },
        }),
      );
    });
    await page.locator('#year-notes').click();
    await page.locator('#year-copy').click();
    await expect(page.locator('#year-copy')).toHaveText('Copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '3. Gray whales turn north · 2026: Bees in the manzanita.\n16. Lupine paints the hillsides · 2025: Levee gold.',
    );
  });

  test('the review lights the season just ended and lists every one of its windows', async ({ page }) => {
    await openDeck(page, 'year.html', SPRING_NOON);
    await page.locator('#year-notes').click();
    await page.locator('#year-review').click();
    await expect(page.locator('.notebook h4')).toContainText('The season just ended · Rain');
    await expect(page.locator('.review .nb-line')).toHaveCount(20);
    await expect(page.locator('.review .nb-line .seal').first()).toHaveText('53');
    await page.locator('#year-review').click();
    await expect(page.locator('.notebook h4')).toContainText('Window 16');
  });
});

test.describe('the sky', () => {
  const look = async (page: Page, x = 0.5, y = 0.45) => {
    const svg = page.locator('#sky-dome svg');
    const box = (await svg.boundingBox())!;
    await svg.click({ position: { x: box.width * x, y: box.height * y } });
    await page.clock.runFor(1500);
  };
  const plateLabel = (page: Page) => page.locator('#sky-out .face').getAttribute('aria-label');

  test('opens the heavens after the eyes adjust, draws a plate showing only its name, and draws again as often as asked', async ({
    page,
  }) => {
    await openDeck(page, 'sky.html', SPRING_NIGHT);
    await expect(page.locator('#sky-cue')).toBeEmpty();
    await expect(page.locator('#sky-dome')).not.toHaveClass(/day/);
    await page.locator('#sky-dome svg').click({ position: { x: 300, y: 250 }, force: true });
    await expect(page.locator('#sky-out .face')).toHaveCount(0);
    await adjustEyes(page);
    await expect(page.locator('arbora-scene')).toHaveClass(/adapted/);
    await expect(page.locator('#sky-cue')).toHaveText('Lift your eyes.');
    await look(page);
    await expect(page.locator('#sky-cue')).toBeEmpty();
    const picture = page.locator('#sky-out .face img');
    await expect(picture).toHaveCount(1);
    await expect(picture).toHaveAttribute('alt', /\w/);
    await expect(picture).toHaveJSProperty('complete', true);
    expect(await picture.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    const first = (await plateLabel(page))!;
    await expect(page.locator('#sky-out .face figcaption')).toHaveText(first.split(', ')[0]!);
    await expect(page.locator('#sky-book')).toBeEmpty();
    await page.locator('#sky-open').click();
    await expect(page.locator('#sky-book .above')).not.toBeEmpty();
    await expect(page.locator('#sky-book .below p').first()).toContainText('Set down');
    await expect(page.locator('#sky-book .below p').nth(1)).toContainText('Receive');
    await expect(page.locator('#sky-book .bk-pass cite')).not.toBeEmpty();
    await expect(page.locator('#sky-book .bk-credit a')).toHaveAttribute(
      'href',
      /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,
    );
    await page.locator('#sky-line').fill('Quiet, and the moon low.');
    await page.locator('#sky-keep').click();
    await page.locator('#sky-again').click();
    await expect(page.locator('#sky-out .face')).toHaveCount(0);
    await expect(page.locator('#sky-cue')).toHaveText('Lift your eyes.');
    await look(page, 0.3, 0.6);
    const second = (await plateLabel(page))!;
    expect(second).not.toBe(first);
    await page.locator('#sky-open').click();
    await page.locator('#sky-keep').click();
    const stored = (await journal(page, 'arbora-sky')) as { entries: Array<Record<string, unknown>> };
    expect(stored.entries).toHaveLength(2);
    expect(stored.entries[0]).toMatchObject({ line: 'Quiet, and the moon low.', status: 'kept' });
    expect(String(stored.entries[0]!.heavens)).toContain('Tonight · The Moon in');
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await adjustEyes(page);
    await look(page);
    await expect(page.locator('#sky-out .face img')).toHaveCount(1);
  });

  test('by day draws from the whole deck, not only the Sun', async ({ page }) => {
    await openDeck(page, 'sky.html', SPRING_NOON);
    await expect(page.locator('#sky-dome')).toHaveClass(/day/);
    await expect(page.locator('#sky-dome svg text')).toContainText(['N', 'E', 'S', 'W', 'THE SUN']);
    await expect(page.locator('#sky-dome svg .beacon')).toHaveCount(0);
    await adjustEyes(page);
    const labels = new Set<string>();
    for (let i = 0; i < 6; i++) {
      await look(page);
      labels.add((await plateLabel(page))!);
      await page.locator('#sky-again').click();
    }
    expect(labels.size).toBeGreaterThan(1);
  });

  test('the book says where the light stands, and a line kept under a plate is the first thing in its book', async ({
    page,
  }) => {
    await openDeck(page, 'sky.html', SPRING_NIGHT);
    const { plates } = await readDeck<{ plates: Array<{ id: string; name: string; alt: string; kind: string }> }>(page);
    await page.evaluate(
      (ids) =>
        localStorage.setItem(
          'arbora-sky',
          JSON.stringify({
            entries: ids.map((plate) => ({
              iso: '2026-03-01T20:00:00.000Z',
              plate,
              heavens: 'x',
              line: `Kept under ${plate}.`,
              status: 'kept',
            })),
          }),
        ),
      plates.map((p) => p.id),
    );
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await adjustEyes(page);
    for (let i = 0; i < 4; i++) {
      await look(page);
      const label = await plateLabel(page);
      const plate = plates.find((p) => `${p.name}, ${p.alt}` === label)!;
      await page.locator('#sky-open').click();
      await expect(page.locator('#sky-book .return')).toContainText('last opened for you');
      await expect(page.locator('#sky-book .return')).toContainText(`Kept under ${plate.id}.`);
      const where = page.locator('#sky-book .bk-title + .bk-note');
      if (plate.kind === 'beyond' || plate.id === 'falling') await expect(where).toHaveCount(0);
      else await expect(where).toHaveText(/ (stands|has risen|have risen|is below|are below) /);
      await page.locator('#sky-again').click();
    }
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
      await settle(page);
      await page.locator('.wisp').first().click({ force: true });
      await expect(page.locator('.wisp.chosen')).toHaveCount(1);
      await page.clock.runFor(3000);
    }
  };
  const face = (page: Page, slot: string) => page.locator(`#wood-slot-${slot} .flip-front .face`);

  test('one light turns one card showing only its picture and name, the book opens on request with the picture credited, and the wood can be walked again at once', async ({
    page,
  }) => {
    await openDeck(page, 'wood.html', SPRING_NIGHT);
    await expect(page.locator('#wood-trip')).toBeHidden();
    await expect(page.locator('#wood-one')).toBeChecked();
    await page.locator('#wood-enter').click();
    await expect(page.locator('#wood-hold')).toBeHidden();
    await walk(page, 1);
    await expect(page.locator('#wood-trip .flip.flipped')).toHaveCount(1);
    await expect(page.locator('#wood-slot-left')).toBeHidden();
    await expect(page.locator('#wood-slot-right')).toBeHidden();
    const picture = face(page, 'center').locator('img');
    await expect(picture).toHaveAttribute('alt', /\w/);
    await expect(picture).toHaveAttribute('width', /^\d+$/);
    await expect(picture).toHaveAttribute('height', /^\d+$/);
    await expect(picture).toHaveJSProperty('complete', true);
    expect(await picture.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(face(page, 'center').locator('figcaption')).toHaveCount(1);
    const name = (await face(page, 'center').locator('figcaption').textContent())!;
    await expect(page.locator('#wood-book')).toBeEmpty();
    await page.locator('#wood-open').click();
    await expect(page.locator('#wood-book .bk-entry')).toHaveCount(1);
    await expect(page.locator('#wood-book .bk-title')).toHaveText(name);
    await expect(page.locator('#wood-book .bk-credit a')).toHaveAttribute(
      'href',
      /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,
    );
    await page.locator('#wood-line').fill('I have been walking in circles on purpose.');
    await page.locator('#wood-keep').click();
    await page.locator('#wood-again').click();
    await expect(page.locator('#wood-hold')).toBeVisible();
    await expect(page.locator('#wood-trip')).toBeHidden();
    await page.locator('#wood-enter').click();
    await walk(page, 1);
    await page.locator('#wood-open').click();
    await page.locator('#wood-set').click();
    const stored = (await journal(page, 'arbora-wood')) as { entries: Array<Record<string, unknown>> };
    expect(stored.entries).toHaveLength(2);
    expect(stored.entries[0]).toMatchObject({ status: 'kept', line: 'I have been walking in circles on purpose.' });
    expect(Object.values(stored.entries[0]!.cards as Record<string, string>)).toEqual([name]);
    expect(stored.entries[1]).toMatchObject({ status: 'branch' });
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#wood-enter')).toBeVisible();
  });

  test('three lights fill the triptych with an elder, a spirit, and a passage, and the book reads them in place', async ({
    page,
  }) => {
    await openDeck(page, 'wood.html', SPRING_NIGHT);
    await page.locator('#wood-three').check();
    await page.locator('#wood-enter').click();
    await walk(page, 3);
    await expect(page.locator('#wood-trip .flip.flipped')).toHaveCount(3);
    await expect(face(page, 'left')).toHaveAttribute('aria-label', /^Elder: /);
    await expect(face(page, 'right')).toHaveAttribute('aria-label', /^Spirit: /);
    await expect(face(page, 'center')).toHaveAttribute('aria-label', /^Passage: /);
    await page.locator('#wood-open').click();
    await expect(page.locator('#wood-book .bk-entry')).toHaveCount(3);
    await expect(page.locator('#wood-book .bk-pass cite')).toHaveCount(3);
    await expect(page.locator('#wood-book .bk-kicker')).toHaveText([
      /^Where you stand · Elder · /,
      /^What is happening · Passage · /,
      /^What meets you · Spirit · /,
    ]);
    await expect(page.locator('#wood-book .bk-q span')).toHaveText('Sit with');
  });

  test('the last line kept waits under the deck and takes what came of it', async ({ page }) => {
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
    await expect(page.locator('#wood-return .return')).toHaveCount(0);
    await page.locator('#wood-past').click();
    await expect(page.locator('#wood-return .return')).toContainText('Let the old job be the log.');
    await expect(page.locator('#wood-return .return')).toContainText('What came of it?');
    await page.locator('#wood-outcome').fill('It fed the garden.');
    await page.locator('#wood-outcome-save').click();
    await expect(page.locator('#wood-return .return')).toContainText('What came of it: It fed the garden.');
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await page.locator('#wood-past').click();
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
        }),
      );
    });
    await expect(page.locator('#wood-past')).toBeHidden();
    await expect(page.locator('#wood-enter')).toBeVisible();
  });

  test('for the table, one light draws one passage and nothing is saved', async ({ page }) => {
    await openDeck(page, 'wood.html', SPRING_NIGHT);
    await page.locator('#wood-table').check();
    await page.locator('#wood-enter').click();
    await walk(page, 1);
    await expect(page.locator('#wood-trip .flip.flipped')).toHaveCount(1);
    await expect(face(page, 'center')).toHaveAttribute('aria-label', /^Passage: /);
    await expect(page.locator('#wood-slot-left')).toBeHidden();
    await page.locator('#wood-open').click();
    await expect(page.locator('#wood-book .bk-entry')).toHaveCount(1);
    await expect(page.locator('#wood-book .bk-q span')).toHaveText('For the table');
    await expect(page.locator('#wood-keep')).toHaveCount(0);
    expect(await journal(page, 'arbora-wood')).toBeNull();
  });
});

test.describe('the sky over where you are', () => {
  test('reads the sky over the reader only when asked, keeps a coarse place, and can return to California', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: -33.86882, longitude: 151.20929 });
    await openDeck(page, 'sky.html', SPRING_NIGHT);
    const button = page.locator('#sky-place');
    await expect(button).toHaveText('Read the sky over where you are');
    await expect(page.locator('#sky-dome svg')).toHaveAttribute('aria-label', /over California/);
    const labels = () => page.locator('#sky-dome svg text').allTextContents();
    const californiaLabels = await labels();
    await button.click();
    await expect(button).toHaveText('Return to the California sky');
    await expect(page.locator('#sky-dome svg')).toHaveAttribute('aria-label', /over where you are/);
    expect(await page.evaluate(() => localStorage.getItem('arbora-place'))).toBe('{"lat":-33.9,"lon":151.2}');
    expect(await labels()).not.toEqual(californiaLabels);
    await page.reload();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#sky-place')).toHaveText('Return to the California sky');
    await page.locator('#sky-place').click();
    await expect(page.locator('#sky-place')).toHaveText('Read the sky over where you are');
    expect(await labels()).toEqual(californiaLabels);
  });

  test('stays over California when the browser refuses', async ({ page }) => {
    await openDeck(page, 'sky.html', SPRING_NIGHT);
    await page.locator('#sky-place').click();
    await expect(page.locator('#sky-place-note')).toHaveText(
      'Your browser did not share a location, so the sky stays over California.',
    );
    await expect(page.locator('#sky-place')).toHaveText('Read the sky over where you are');
  });
});

test.describe('the table from the rituals page', () => {
  test('the weekly gathering links to a table draw with the switch already set', async ({ page }) => {
    await page.goto('rituals.html');
    const link = page.locator('a[href="wood.html#table"]');
    await expect(link).toHaveText('Draw for the table');
    await page.clock.install({ time: SPRING_NIGHT });
    await link.click();
    await page.locator('arbora-scene.mounted').waitFor();
    await expect(page.locator('#wood-table')).toBeChecked();
  });
});
