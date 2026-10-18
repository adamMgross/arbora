import { defineConfig, devices } from '@playwright/test';

const dir = process.env.E2E_DIR ?? 'dist';
const port = Number(process.env.E2E_PORT ?? 4173);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    serviceWorkers: 'block',
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
  },
  webServer: { command: `node tests/e2e/serve.mjs ${dir} ${port}`, port, reuseExistingServer: false },
  projects: [{ name: 'e2e', use: { ...devices['Desktop Chrome'] } }],
});
