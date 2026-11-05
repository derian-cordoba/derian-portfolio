import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);
const routes = [
  '/',
  '/es/',
  '/hiring/',
  '/projects/api-gateway/',
  '/projects/experimentation/',
  '/notes/failure-controls/',
];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const route of routes) {
    test(`${route} has no axe violations in ${colorScheme} mode`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const violations = await page.evaluate(async () => {
        const axe = (window as unknown as { axe: typeof import('axe-core') })
          .axe;
        return (await axe.run(document)).violations;
      });
      expect(violations).toEqual([]);
    });
  }
}

test('skip link focuses main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('a[href="#main"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('mobile navigation contains focus, exposes state, and closes on Escape or outside click', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto('/');
  const summary = page.locator('[data-mobile-menu] summary');
  const lastLink = page.locator('#mobile-navigation-panel a').last();
  await expect(summary).toHaveAttribute('aria-expanded', 'false');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(summary).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(lastLink).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(summary).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(summary).toHaveAttribute('aria-expanded', 'false');
  await expect(summary).toBeFocused();
  await summary.click();
  await page.locator('h1').click();
  await expect(summary).toHaveAttribute('aria-expanded', 'false');
});

test('screenshot dialog contains focus and restores it on Escape', async ({
  page,
}) => {
  await page.goto('/projects/experimentation/');
  const trigger = page.locator('[data-media-open]');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const close = page.locator('[data-media-close]');
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
