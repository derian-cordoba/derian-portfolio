import { test, expect } from '@playwright/test';
import { navigateAndWaitForPageLoad } from './support/navigation';

const paths = [
  '/',
  '/es/',
  '/404.html',
  '/es/404/',
  ...[
    'work/saas-modernization/',
    'work/agricultural-platform/',
    'projects/api-gateway/',
    'projects/experimentation/',
    'projects/secure-keys/',
    'hiring/',
    'notes/',
    'notes/failure-controls/',
    'notes/consistent-experiments/',
    'thanks/',
  ].flatMap((path) => [`/${path}`, `/es/${path}`]),
];

for (const path of paths) {
  test(`client-side transitions work from ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('theme-toggle button')).toBeVisible();
    await page.evaluate(() => {
      Object.assign(window, {
        portfolioTransitionProbe: true,
        portfolioPageLoads: 0,
      });
      document.addEventListener('astro:page-load', () => {
        const state = window as unknown as { portfolioPageLoads: number };
        state.portfolioPageLoads += 1;
      });
    });
    const spanish = path.startsWith('/es/');
    await page
      .getByRole('link', {
        name: spanish
          ? 'EN — Read this page in English'
          : 'ES — Leer esta página en español',
        exact: true,
      })
      .click();
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      spanish ? 'en' : 'es',
    );
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { portfolioTransitionProbe?: boolean })
            .portfolioTransitionProbe,
      ),
    ).toBe(true);
    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            (window as unknown as { portfolioPageLoads: number })
              .portfolioPageLoads,
        ),
      )
      .toBeGreaterThan(0);
    const toggle = page.getByRole('button', {
      name: spanish ? 'Dark theme' : 'Tema oscuro',
      exact: true,
    });
    await expect(toggle).toBeVisible();
    const initial = await toggle.getAttribute('aria-pressed');
    await toggle.click();
    await expect(toggle).toHaveAttribute(
      'aria-pressed',
      initial === 'true' ? 'false' : 'true',
    );
  });
}

test('project controls, theme, and language fragments survive repeated navigation', async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page
    .locator('#projects a[href="/projects/api-gateway/"]')
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/api-gateway\/$/u);
  await page.getByRole('button', { name: 'Simulate upstream failure' }).click();
  await expect(page.locator('[data-status]')).toHaveText('503');
  await page
    .getByRole('link', { name: 'ES — Leer esta página en español' })
    .click();
  await page
    .getByRole('button', { name: 'Simular fallo del servicio de destino' })
    .click();
  await expect(page.locator('[data-status]')).toHaveText('503');
  await page.locator('a[href="/es/#projects"]').click();
  await expect(page).toHaveURL(/\/es\/#projects$/u);
  await navigateAndWaitForPageLoad(page, () =>
    page.getByRole('link', { name: 'EN — Read this page in English' }).click(),
  );
  await expect(page).toHaveURL(/\/#projects$/u);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  if (isMobile) {
    await page.getByLabel('Toggle navigation').click();
    await expect(page.locator('[data-mobile-menu]')).toHaveAttribute('open');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-mobile-menu]')).not.toHaveAttribute(
      'open',
    );
  }
  await navigateAndWaitForPageLoad(page, () => page.goBack());
  await expect(page).toHaveURL(/\/es\/#projects$/u);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await navigateAndWaitForPageLoad(page, () => page.goForward());
  await expect(page).toHaveURL(/\/#projects$/u);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('router fallback works without native view transitions', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, 'startViewTransition', {
      value: undefined,
      configurable: true,
    });
  });
  await page.goto('/');
  await expect(page.locator('theme-toggle button')).toBeVisible();
  await page.evaluate(() => {
    Object.assign(window, { portfolioTransitionProbe: true });
  });
  await page
    .locator('#projects a[href="/projects/api-gateway/"]')
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/api-gateway\/$/u);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { portfolioTransitionProbe?: boolean })
          .portfolioTransitionProbe,
    ),
  ).toBe(true);
});
