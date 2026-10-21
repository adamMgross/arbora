import { expect, test, type Locator, type Page } from '@playwright/test';

const NIGHT = new Date('2026-10-18T21:00:00-07:00');

async function open(page: Page, path: string) {
  await page.clock.install({ time: NIGHT });
  await page.goto(path);
  await page.locator('arbora-scene.mounted').waitFor();
}

async function settle(page: Page) {
  let last = -1;
  for (;;) {
    const y = await page.evaluate(() => scrollY);
    if (y === last) return;
    last = y;
    await page.waitForTimeout(150);
  }
}

const box = async (locator: Locator) => (await locator.boundingBox())!;

async function expectNoSideScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

async function expectTouchSized(page: Page) {
  const small = await page.evaluate(() =>
    [
      ...document.querySelectorAll(
        'arbora-scene button, arbora-scene input:not(.modes input), arbora-scene textarea, arbora-scene label:not(.sr-only)',
      ),
    ]
      .map((el) => [el.id || el.className, el.getBoundingClientRect()] as const)
      .filter(([, r]) => r.width > 0 && r.height > 0 && r.height < 44)
      .map(([name, r]) => `${String(name)} ${Math.round(r.width)}x${Math.round(r.height)}`),
  );
  expect(small).toEqual([]);
}

test.describe('on a phone, the hub', () => {
  test('stacks the three decks one to a row', async ({ page }) => {
    await page.goto('oracles.html');
    const links = page.locator('.deck-link');
    await expect(links).toHaveCount(3);
    const [a, b, c] = await Promise.all([0, 1, 2].map((i) => box(links.nth(i))));
    expect(a!.x).toBe(b!.x);
    expect(b!.x).toBe(c!.x);
    expect(b!.y).toBeGreaterThanOrEqual(a!.y + a!.height);
    expect(c!.y).toBeGreaterThanOrEqual(b!.y + b!.height);
    await expectNoSideScroll(page);
  });
});

test.describe('on a phone, every deck', () => {
  for (const deck of ['wood', 'sky', 'year']) {
    test(`${deck} runs edge to edge without side scroll`, async ({ page }) => {
      await open(page, `${deck}.html`);
      const width = page.viewportSize()!.width;
      expect((await box(page.locator('arbora-scene'))).width).toBe(width);
      await expectNoSideScroll(page);
    });
  }
});

test.describe('on a phone, the wood', () => {
  test('on one light shows only the lights, then a card large enough to look at', async ({ page }) => {
    await open(page, 'wood.html');
    await expectTouchSized(page);
    await page.locator('#wood-enter').click();
    await expect(page.locator('#wood-play')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('#wood-trip')).toBeHidden();
    await page.locator('.wisp').first().click({ force: true });
    await page.clock.runFor(3000);
    await settle(page);
    const width = page.viewportSize()!.width;
    expect((await box(page.locator('#wood-slot-center'))).width).toBeGreaterThan(width * 0.55);
    await expect(page.locator('#wood-slot-center')).toBeInViewport({ ratio: 1 });
    const card = await box(page.locator('#wood-slot-center .face'));
    const picture = await box(page.locator('#wood-slot-center .face img'));
    expect(card.height - picture.height).toBeLessThan(80);
    await expect(page.locator('#wood-open')).toBeInViewport({ ratio: 1 });
    await expectNoSideScroll(page);
    await page.locator('#wood-open').click();
    await expect(page.locator('#wood-book .bk-entry').first()).toBeInViewport();
    await expectTouchSized(page);
  });

  test('on three lights keeps the lights and the triptych on one screen, then lays the plates out large', async ({
    page,
  }) => {
    await open(page, 'wood.html');
    await page.locator('#wood-three').check();
    await page.locator('#wood-enter').click();
    await expect(page.locator('#wood-play')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('#wood-trip')).toBeInViewport({ ratio: 1 });
    for (let i = 0; i < 3; i++) {
      await expect(page.locator('.wisp')).toHaveCount(3);
      await page.locator('.wisp').first().click({ force: true });
      await page.clock.runFor(3000);
    }
    await expect(page.locator('#wood-trip')).toHaveClass(/spread/);
    const width = page.viewportSize()!.width;
    for (const slot of ['left', 'center', 'right'])
      expect((await box(page.locator(`#wood-slot-${slot}`))).width).toBeGreaterThan(width * 0.6);
    await expect(page.locator('#wood-slot-left')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('#wood-open')).toBeInViewport({ ratio: 1 });
    await page.locator('#wood-trip').evaluate((el) => el.scrollTo({ left: el.scrollWidth }));
    await expect(page.locator('#wood-slot-right')).toBeInViewport({ ratio: 1 });
    await expectNoSideScroll(page);
  });

  test('a link to the table lands on the deck', async ({ page }) => {
    await open(page, 'wood.html#table');
    await expect(page.locator('#wood-table')).toBeChecked();
    await expect(page.locator('#wood-enter')).toBeInViewport({ ratio: 1 });
  });
});

test.describe('on a phone, the sky', () => {
  test('brings the plate into view after a look, at a size that can be read', async ({ page }) => {
    await open(page, 'sky.html');
    await page.locator('#sky-dome').scrollIntoViewIfNeeded();
    await expect(page.locator('arbora-scene')).toHaveClass(/adapting/);
    await page.clock.runFor(12500);
    await expect(page.locator('arbora-scene')).toHaveClass(/adapted/);
    const label = await page.locator('#sky-dome svg text').last().boundingBox();
    expect(label!.height).toBeGreaterThanOrEqual(9);
    const dome = await box(page.locator('#sky-dome svg'));
    await page.mouse.click(dome.x + dome.width / 2, dome.y + dome.height * 0.45);
    await page.clock.runFor(1500);
    await expect(page.locator('#sky-out .face')).toBeInViewport({ ratio: 1 });
    expect((await box(page.locator('#sky-out .face'))).width).toBeGreaterThanOrEqual(260);
    await page.locator('#sky-open').click();
    await expect(page.locator('#sky-book .book')).toBeInViewport();
    await expectTouchSized(page);
    await expectNoSideScroll(page);
  });

  test('in landscape the firmament fits the screen', async ({ page }) => {
    await page.setViewportSize({ width: 734, height: 343 });
    await open(page, 'sky.html');
    expect((await box(page.locator('#sky-dome'))).height).toBeLessThanOrEqual(343);
    await expectNoSideScroll(page);
  });
});

test.describe('on a phone, the year', () => {
  test('turns the needle from just under the ring and brings each result into view', async ({ page }) => {
    await open(page, 'year.html');
    const ring = await box(page.locator('#year-ring svg'));
    const turn = await box(page.locator('#year-draw'));
    const pair = await box(page.locator('#year-pair'));
    expect(turn.y).toBeGreaterThanOrEqual(ring.y + ring.height);
    expect(turn.y + turn.height).toBeLessThanOrEqual(pair.y);
    expect(ring.width).toBeGreaterThanOrEqual(page.viewportSize()!.width - 40);
    await page.locator('#year-draw').click();
    await expect(page.locator('#year-ring svg')).toBeInViewport({ ratio: 0.9 });
    await settle(page);
    await page.clock.runFor(3000);
    await expect(page.locator('#year-pair > div').nth(1)).toBeInViewport({ ratio: 1 });
    await page.locator('#year-open').click();
    await expect(page.locator('#year-book .book')).toBeInViewport();
    await expectTouchSized(page);
    await expectNoSideScroll(page);
  });
});
