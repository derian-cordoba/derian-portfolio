import { defineConfig, devices } from '@playwright/test';

const chromiumChannel = process.env['PLAYWRIGHT_CHANNEL'];
const chromiumOptions = chromiumChannel ? { channel: chromiumChannel } : {};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  ...(process.env['CI'] && { workers: 1 }),
  retries: process.env['CI'] ? 2 : 0,
  globalTimeout: 10 * 60 * 1000,
  reporter: process.env['CI']
    ? [['github'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: '**/browser-smoke.spec.ts',
      use: { ...devices['Desktop Chrome'], ...chromiumOptions },
    },
    {
      name: 'mobile',
      testIgnore: '**/browser-smoke.spec.ts',
      use: {
        ...devices['iPhone 13'],
        defaultBrowserType: 'chromium',
        ...chromiumOptions,
      },
    },
    {
      name: 'webkit',
      testMatch: '**/browser-smoke.spec.ts',
      use: { ...devices['iPhone 13'], browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4321 --ignore-lock',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env['CI'],
  },
});
