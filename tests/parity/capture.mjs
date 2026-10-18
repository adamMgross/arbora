import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { normalizeText } from './normalize.mjs';

const FONT_URL = /fonts\.(googleapis|gstatic)\.com/;
const DEFAULT_TIME = '2026-04-22T09:00:00-07:00';

export const SCREENSHOT_CONFIGS = [375, 768, 1280].flatMap((width) =>
  ['light', 'dark'].map((scheme) => ({ width, scheme, label: `${width}-${scheme}` })),
);

export function todayTimes() {
  const times = [];
  for (let i = 0; i < 16; i++) {
    const doy = 10 + i * 23;
    const date = new Date(Date.UTC(2026, 0, doy)).toISOString().slice(0, 10);
    const offset = doy >= 68 && doy <= 304 ? '-07:00' : '-08:00';
    const hour = String([8, 14, 20][i % 3]).padStart(2, '0');
    times.push(`${date}T${hour}:00:00${offset}`);
  }
  return times;
}

const seedRandom = `(() => {
  let a = 0x9e3779b9;
  Math.random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();`;

export async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export async function ensureFontsHar(browser, baseUrl, pages, harPath) {
  if (existsSync(harPath)) return;
  mkdirSync(dirname(harPath), { recursive: true });
  const context = await browser.newContext({
    serviceWorkers: 'block',
    recordHar: { path: harPath, urlFilter: FONT_URL, content: 'embed', mode: 'minimal' },
  });
  for (const file of pages) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}/${file}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready.then(() => 0));
    await page.close();
  }
  await context.close();
}

async function withContext(browser, { width, scheme, time, harPath }, fn) {
  const context = await browser.newContext({
    viewport: { width, height: 800 },
    colorScheme: scheme,
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
    deviceScaleFactor: 1,
    serviceWorkers: 'block',
  });
  try {
    await context.addInitScript(seedRandom);
    await context.clock.setFixedTime(new Date(time));
    await context.routeFromHAR(harPath, { url: FONT_URL, notFound: 'abort' });
    return await fn(context);
  } finally {
    await context.close();
  }
}

function extract() {
  const local = (value) => {
    const u = new URL(value, location.href);
    return u.origin === location.origin ? u.pathname + u.search + u.hash : u.href;
  };
  const head = [...document.head.children]
    .filter((el) => ['META', 'LINK', 'TITLE'].includes(el.tagName) && el.getAttribute('name') !== 'generator')
    .map((el) => {
      if (
        el.tagName === 'LINK' &&
        el.getAttribute('rel') === 'stylesheet' &&
        new URL(el.href, location.href).origin === location.origin
      ) {
        return 'link[local-stylesheet]';
      }
      const attrs = [...el.attributes]
        .map((a) => [a.name, a.name === 'href' ? local(a.value).replace(/\/_astro\/[^?#]+/, '/_astro/*') : a.value])
        .sort(([x], [y]) => (x < y ? -1 : 1));
      return el.tagName.toLowerCase() + JSON.stringify(attrs) + (el.tagName === 'TITLE' ? el.textContent : '');
    })
    .filter((entry, i, all) => entry !== 'link[local-stylesheet]' || all.indexOf(entry) === i)
    .sort();
  return {
    text: document.body.innerText,
    head,
    ids: [...document.querySelectorAll('[id]')].map((el) => el.id),
    links: [...document.querySelectorAll('a[href]')].map((a) => local(a.getAttribute('href'))),
  };
}

async function capturePage(context, baseUrl, file, { screenshot }) {
  const page = await context.newPage();
  try {
    await page.goto(`${baseUrl}/${file}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready.then(() => 0));
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
      window.scrollTo(0, 0);
    });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const data = await page.evaluate(extract);
    data.text = normalizeText(data.text);
    const png = screenshot
      ? await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide', timeout: 120000 })
      : null;
    return { data, png };
  } finally {
    await page.close();
  }
}

export async function captureSite({ launch, baseUrl, pages, harPath, screenshots }) {
  const results = new Map();
  const inBrowser = async (fn) => {
    const browser = await launch();
    try {
      await fn(browser);
    } finally {
      await browser.close();
    }
  };
  const jobs = SCREENSHOT_CONFIGS.map((config) =>
    inBrowser((browser) =>
      withContext(browser, { ...config, time: DEFAULT_TIME, harPath }, (context) =>
        mapLimit(pages, 1, async (file) => {
          results.set(
            `${file}@${config.label}`,
            await capturePage(context, baseUrl, file, { screenshot: screenshots }),
          );
        }),
      ),
    ),
  );
  if (pages.includes('today.html')) {
    jobs.push(
      inBrowser(async (browser) => {
        for (const time of todayTimes()) {
          await withContext(browser, { width: 375, scheme: 'light', time, harPath }, async (context) => {
            results.set(`today.html@${time}`, await capturePage(context, baseUrl, 'today.html', { screenshot: false }));
          });
        }
      }),
    );
  }
  await Promise.all(jobs);
  return results;
}
