import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

test('Spanish language switching preserves the project and fragment', async ({
  page,
}) => {
  await page.goto('/projects/api-gateway/#main');
  await page
    .getByRole('link', { name: 'ES — Leer esta página en español' })
    .click();
  await expect(page).toHaveURL(/\/es\/projects\/api-gateway\/#main$/u);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'API Gateway en TypeScript: enrutamiento y resiliencia',
  );
  await page
    .getByRole('button', { name: 'Simular fallo del servicio de destino' })
    .click();
  await expect(page.locator('[data-circuit]')).toHaveText('Abierto');
  await page
    .getByRole('button', { name: 'Restablecer servicio de destino' })
    .click();
  await expect(page.locator('[data-circuit]')).toHaveText('Cerrado');
  await page
    .getByRole('link', { name: 'EN — Read this page in English' })
    .click();
  await expect(page).toHaveURL(/\/projects\/api-gateway\/#main$/u);
});

test('Spanish homepage is accessible and does not overflow narrow screens', async ({
  page,
  isMobile,
}) => {
  await page.goto('/es/');
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: typeof import('axe-core') }).axe;
    return (await axe.run(document)).violations;
  });
  expect(violations).toEqual([]);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Buenos sistemas.',
  );
  if (isMobile) {
    await page.getByLabel('Abrir o cerrar navegación').click();
    await page
      .getByRole('navigation', { name: 'Navegación móvil' })
      .getByRole('link', { name: 'Experiencia' })
      .click();
  }
  await page.getByText('Experiencia anterior · 2019—2022').click();
  await expect(
    page.getByText(
      'Diseño de servicios backend y estructuras de bases de datos para una plataforma utilizada por más de 25 empresas agrícolas.',
    ),
  ).toBeVisible();
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});

test('Spanish content and language links work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/es/work/saas-modernization/');
  await expect(
    page.getByRole('heading', { name: 'El resultado', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'EN — Read this page in English' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'The result', exact: true }),
  ).toBeVisible();
  await context.close();
});

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
  await expect(page.locator('gateway-demo [role="status"]')).toContainText(
    'open circuit',
  );
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
