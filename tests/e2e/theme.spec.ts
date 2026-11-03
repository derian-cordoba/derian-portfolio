import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

for (const locale of [
  {
    path: '/',
    label: 'Dark theme',
    alternate: 'ES — Leer esta página en español',
  },
  {
    path: '/es/',
    label: 'Tema oscuro',
    alternate: 'EN — Read this page in English',
  },
]) {
  test(`dark palette is accessible on ${locale.path}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(locale.path);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(
      page.getByRole('button', { name: locale.label, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      await page
        .locator('body')
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    ).toBe('rgb(11, 20, 32)');
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const violations = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: typeof import('axe-core') }).axe;
      return (await axe.run(document)).violations;
    });
    expect(violations).toEqual([]);
  });

  test(`keyboard theme selection persists across reload and language changes from ${locale.path}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(locale.path);
    const button = page.getByRole('button', {
      name: locale.label,
      exact: true,
    });
    await button.focus();
    await button.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(
      await page.evaluate(() => localStorage.getItem('portfolio-theme')),
    ).toBe('light');
    await page
      .getByRole('link', { name: locale.alternate, exact: true })
      .click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
}

test('system preference changes apply until an explicit choice is saved', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('blocked storage does not prevent changing the current page theme', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage disabled');
      },
    });
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Dark theme', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('CSS follows a dark system preference without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/es/');
  expect(
    await page
      .locator('body')
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).toBe('rgb(11, 20, 32)');
  await expect(page.locator('theme-toggle button')).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Buenos sistemas.',
  );
  await context.close();
});
