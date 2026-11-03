import { defineConfig, devices } from '@playwright/test';

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
    ...(process.env['PLAYWRIGHT_CHANNEL'] && { channel: process.env['PLAYWRIGHT_CHANNEL'] }),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env['CI'],
  },
});
