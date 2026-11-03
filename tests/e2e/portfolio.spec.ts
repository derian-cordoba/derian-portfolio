import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

test('homepage is readable, linked, and free of critical accessibility findings', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Good systems.',
  );
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: typeof import('axe-core') }).axe;
    return (await axe.run(document)).violations;
  });
  expect(violations).toEqual([]);

  const links = await page.locator('a[href^="/"]').evaluateAll((anchors) => {
    return [
      ...new Set(
        anchors
          .map((anchor) => anchor.getAttribute('href')?.split('#')[0])
          .filter(Boolean),
      ),
    ];
  });
  for (const href of links) {
    if (href) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
    }
  }
  const width = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(width.content).toBeLessThanOrEqual(width.viewport);
});

test('gateway simulation supports failure and recovery', async ({ page }) => {
  await page.goto('/projects/api-gateway/');
  await page.getByRole('button', { name: 'Simulate upstream failure' }).click();
  await expect(page.locator('[data-status]')).toHaveText('503');
  await expect(page.getByRole('status')).toContainText('open circuit');
  await page.getByRole('button', { name: 'Restore upstream' }).click();
  await expect(page.locator('[data-status]')).toHaveText('200');
});

test('navigation and earlier experience work with keyboard-accessible disclosure controls', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByLabel('Toggle navigation').click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Experience' })
      .click();
    await expect(page.locator('[data-mobile-menu]')).not.toHaveAttribute(
      'open',
    );
  }
  await page.getByText('Earlier experience · 2019—2022').click();
  await expect(
    page.getByRole('heading', { name: 'Quality Service Nicaragua' }),
  ).toBeVisible();
});

test('professional content remains available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/work/saas-modernization/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'The result', exact: true }),
  ).toBeVisible();
  await context.close();
});
