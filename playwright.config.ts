import { defineConfig, devices } from '@playwright/test';

const dir = process.env.E2E_DIR ?? 'dist';
const port = Number(process.env.E2E_PORT ?? 4173);
const basePath = (process.env.E2E_BASE_PATH ?? '/').replace(/\/?$/, '/');

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath}`,
    serviceWorkers: 'block',
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
  },
  webServer: {
    command: `node tests/e2e/serve.mjs ${dir} ${port} ${basePath.replace(/\/$/, '')}`,
    port,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'e2e', testIgnore: /phone\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    {
      name: 'phone',
      testMatch: /(decks|phone)\.spec\.ts/,
      use: { ...devices['iPhone 15'], browserName: 'chromium' },
    },
  ],
});
