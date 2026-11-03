import { test, expect } from '@playwright/test';
import { navigateAndWaitForPageLoad } from './support/navigation';

test('new content is localized and linked through the shared navigation', async ({
  page,
}) => {
  await page.goto('/hiring/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'how I can contribute',
  );
  await page
    .getByRole('link', { name: 'ES — Leer esta página en español' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'cómo puedo contribuir',
  );
  await page.goto('/es/notes/');
  await page.getByRole('link', { name: 'Leer nota' }).first().click();
  await expect(page).toHaveURL(/\/es\/notes\/failure-controls\/$/u);
  await expect(page.locator('article')).toContainText('presupuesto');
  await page
    .getByRole('link', { name: 'EN — Read this page in English' })
    .click();
  await expect(page.locator('article')).toContainText('request budget');
});

test('all failure traces work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/es/projects/api-gateway/`);
  for (const [scenario, expected] of [
    ['authentication', '401'],
    ['timeout', '504'],
    ['circuit', '503'],
  ] as const) {
    const panel = page.locator(`[data-walkthrough-scenario="${scenario}"]`);
    await panel.locator('summary').click();
    await expect(panel).toHaveAttribute('open');
    await expect(panel.locator('ol')).toContainText(expected);
    await expect(panel.locator('pre')).toBeVisible();
  }
  await context.close();
});

test('copy email reports success and failure after client navigation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });
  await page.goto('/hiring/');
  await page.getByRole('button', { name: 'Copy email', exact: true }).click();
  await expect(page.locator('copy-email [role="status"]')).toHaveText(
    'Email copied.',
  );
  await page
    .getByRole('link', { name: 'ES — Leer esta página en español' })
    .click();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Blocked');
        },
      },
    });
  });
  await page
    .getByRole('button', { name: 'Copiar correo', exact: true })
    .click();
  await expect(page.locator('copy-email [role="status"]')).toContainText(
    'No se pudo copiar',
  );
});

test('analytics events contain no query, email, or form fields and do not duplicate after navigation', async ({
  page,
}) => {
  await page.goto('/projects/api-gateway/?email=private@example.com');
  await expect(page.locator('theme-toggle button')).toBeVisible();
  await page.evaluate(() => {
    Object.assign(window, { portfolioEvents: [] });
    window.addEventListener('portfolio:engagement', (event) => {
      (
        window as unknown as { portfolioEvents: unknown[] }
      ).portfolioEvents.push((event as CustomEvent).detail);
    });
  });
  await page.locator('[data-walkthrough-scenario="timeout"] summary').click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { portfolioEvents: unknown[] }).portfolioEvents
            .length,
      ),
    )
    .toBe(1);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { portfolioEvents: unknown[] }).portfolioEvents,
    ),
  ).toEqual([
    { name: 'Walkthrough explored', locale: 'en', scenario: 'timeout' },
  ]);
  await navigateAndWaitForPageLoad(page, () =>
    page
      .getByRole('link', { name: 'ES — Leer esta página en español' })
      .click(),
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  const spanishPanel = page.locator(
    'html[lang="es"] [data-walkthrough-scenario="timeout"]',
  );
  await expect(spanishPanel).not.toHaveAttribute('open');
  await spanishPanel.locator('summary').click();
  await expect(spanishPanel).toHaveAttribute('open');
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { portfolioEvents: unknown[] }).portfolioEvents
            .length,
      ),
    )
    .toBe(2);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { portfolioEvents: unknown[] }).portfolioEvents,
    ),
  ).toEqual([
    { name: 'Walkthrough explored', locale: 'en', scenario: 'timeout' },
    { name: 'Walkthrough explored', locale: 'es', scenario: 'timeout' },
  ]);
});

test('an accepted inquiry opens the localized confirmation URL', async ({
  page,
}) => {
  await page.goto('/es/hiring/');
  const form = page.locator('[data-inquiry-form]');
  test.skip(
    (await form.count()) === 0,
    'Netlify Forms is disabled for this build.',
  );
  await expect(form).toHaveAttribute('aria-busy', 'false');
  await expect(form).toHaveAttribute('method', 'POST');
  await expect(form).toHaveAttribute('action', '/es/thanks/');
  await expect(form).toHaveAttribute('data-astro-reload');
  await page.route('**/es/thanks/', async (route) => {
    if (route.request().method() === 'POST') {
      expect(route.request().postData()).toContain(
        'form-name=portfolio-inquiry-es',
      );
    }
    await route.fulfill({
      status: 200,
      body: '<h1>Received</h1>',
      contentType: 'text/html',
    });
  });
  await form.getByLabel('Nombre', { exact: true }).fill('Example');
  await form
    .getByLabel('Correo electrónico', { exact: true })
    .fill('example@example.com');
  await form
    .getByLabel('¿Sobre qué te gustaría conversar?')
    .fill('A conversation about a backend role.');
  await form.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('heading', { name: 'Received' })).toBeVisible();
});
