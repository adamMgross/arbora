import { expect, test, type Page } from '@playwright/test';

const SPRING_MORNING = new Date('2026-04-22T09:00:00-07:00');

async function openToday(page: Page, at: Date = SPRING_MORNING) {
  await page.addInitScript(() => {
    let a = 0x9e3779b9;
    Math.random = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  await page.clock.setFixedTime(at);
  await page.goto('/today.html');
}

test.describe('navigation', () => {
  test('mobile menu toggle opens and closes the link list and reports aria-expanded', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/cosmology.html');
    const toggle = page.locator('.nav-toggle');
    const links = page.locator('.nav-links');
    await toggle.click();
    await expect(links).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.click();
    await expect(links).not.toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('canon sub-pages highlight only the Canon link as active', async ({ page }) => {
    await page.goto('/canon-stoics.html');
    await expect(page.locator('.nav-links a.active')).toHaveText(['Canon']);
  });

  test('the nav hides when scrolling down and returns when scrolling up', async ({ page }) => {
    await page.goto('/cosmology.html');
    const nav = page.locator('.site-nav');
    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect(nav).toHaveClass(/scrolled/);
    await expect(nav).toHaveClass(/nav-hidden/);
    await page.evaluate(() => window.scrollTo(0, 1300));
    await expect(nav).not.toHaveClass(/nav-hidden/);
  });
});

test.describe('content pages', () => {
  test('the scroll progress bar tracks position down to full width at the bottom', async ({ page }) => {
    await page.goto('/cosmology.html');
    const bar = page.locator('.scroll-progress');
    await expect(bar).toHaveCSS('width', '0px');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(async () => bar.evaluate((el) => (el as HTMLElement).style.width)).toBe('100%');
  });

  test('every blockquote gets a copy button that confirms after copying', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/canon-stoics.html');
    const quotes = page.locator('.page-content blockquote');
    const count = await quotes.count();
    expect(count).toBeGreaterThan(5);
    await expect(page.locator('.page-content blockquote .copy-btn')).toHaveCount(count);
    const first = quotes.first();
    await first.locator('.copy-btn').click();
    await expect(first.locator('.copy-btn')).toHaveText('copied');
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain('Constantly regard the universe');
  });

  test('headings are revealed once scrolled into view', async ({ page }) => {
    await page.goto('/cosmology.html');
    const last = page.locator('.page-content h2').last();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toHaveClass(/revealed/);
  });

  test('focusing a tree branch link reveals its leaf labels and blurring hides them', async ({ page }) => {
    await page.goto('/tree.html');
    const branch = page.locator('.tree-branch').first();
    const leaf = branch.locator('.leaf-label').first();
    await expect(leaf).toHaveCSS('opacity', '0');
    await branch.locator('a').focus();
    await expect(leaf).toHaveCSS('opacity', '0.8');
    await branch.locator('a').blur();
    await expect(leaf).toHaveCSS('opacity', '0');
  });

  test('the offline bar appears when the browser goes offline', async ({ page, context }) => {
    await page.goto('/cosmology.html');
    const bar = page.locator('.offline-bar');
    await expect(bar).not.toHaveClass(/visible/);
    await context.setOffline(true);
    await expect(bar).toHaveClass(/visible/);
  });
});

test.describe('today', () => {
  test('fills the greeting, morning, reading, and evening content and marks the current time of day', async ({
    page,
  }) => {
    await openToday(page);
    await expect(page.locator('#season-greeting')).toHaveText('The world is waking. So may you.');
    for (const id of ['morning-text', 'reading-text', 'reading-source', 'evening-text']) {
      expect((await page.locator(`#${id}`).innerText()).trim().length).toBeGreaterThan(10);
    }
    await expect(page.locator('#morning-heading')).toContainText('now');
    await expect(page.locator('#reading-heading')).not.toContainText('now');
    await expect(page.locator('#reading-canon-link')).toHaveText(/^Explore .+ →$/);
  });

  test('picks the same content on the same day and different content on another day', async ({ page }) => {
    await openToday(page);
    const first = await page.locator('#reading-text').innerText();
    await page.reload();
    expect(await page.locator('#reading-text').innerText()).toBe(first);
    await openToday(page, new Date('2026-04-23T09:00:00-07:00'));
    expect(await page.locator('#reading-text').innerText()).not.toBe(first);
  });

  test('shuffling replaces the morning invocation with a different one', async ({ page }) => {
    await openToday(page);
    const before = await page.locator('#morning-text').innerText();
    await page.locator('.shuffle-btn[data-section="morning"]').click();
    await expect.poll(() => page.locator('#morning-text').innerText()).not.toBe(before);
  });

  test('a reading can be saved, survives a reload, and can be removed', async ({ page }) => {
    await openToday(page);
    const text = ((await page.locator('#reading-text').textContent()) ?? '').replace(/copy$/, '').trim();
    const bookmark = page.locator('#reading-bookmark');
    await expect(bookmark).toHaveText('save');
    await bookmark.click();
    await expect(bookmark).toHaveText('saved ♥');
    await page.reload();
    await expect(bookmark).toHaveText('saved ♥');
    await expect(page.locator('#saved-readings-section')).toHaveClass(/is-visible/);
    await expect(page.locator('.saved-item-text')).toHaveText([text]);
    await page.locator('.saved-remove-btn').click();
    await expect(bookmark).toHaveText('save');
    await expect(page.locator('#saved-readings-section')).not.toHaveClass(/is-visible/);
  });

  test('readings saved in the original {text, source} shape still render', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'arbora-saved-readings',
        JSON.stringify([{ text: 'An older saved line', source: 'Old Source' }]),
      );
    });
    await openToday(page);
    await expect(page.locator('.saved-item-text')).toHaveText(['An older saved line']);
    await expect(page.locator('.saved-item-source')).toHaveText(['— Old Source']);
  });

  test('the reading carries a copy button after load', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openToday(page);
    await expect(page.locator('#reading-text .copy-btn')).toHaveCount(1);
  });
});
