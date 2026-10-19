import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'allow' });

test('the installed worker serves pages offline and keeps exactly one arbora cache', async ({ page, context }) => {
  await page.goto('today.html');
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);

  await context.setOffline(true);
  await page.goto('cosmology.html');
  await expect(page.locator('h1')).toHaveText('Cosmology');

  const caches = await page.evaluate(() => globalThis.caches.keys());
  expect(caches).toHaveLength(1);
  expect(caches[0]).toMatch(/^arbora-[0-9a-f]{10}$/);
});
