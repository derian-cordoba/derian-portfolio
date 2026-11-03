import { test, expect } from '@playwright/test';
import { navigateAndWaitForPageLoad } from './support/navigation';

test('language switching preserves the corresponding translated article section', async ({
  page,
}) => {
  await page.goto('/projects/api-gateway/#the-problem');
  await navigateAndWaitForPageLoad(page, () =>
    page
      .getByRole('link', { name: 'ES — Leer esta página en español' })
      .click(),
  );
  await expect(page).toHaveURL(/\/es\/projects\/api-gateway\/#el-problema$/u);
  await expect(page.locator('#el-problema')).toBeInViewport();
  await navigateAndWaitForPageLoad(page, () =>
    page.getByRole('link', { name: 'EN — Read this page in English' }).click(),
  );
  await expect(page).toHaveURL(/\/projects\/api-gateway\/#the-problem$/u);
});

test('case facts precede the article and section links resolve in both languages', async ({
  page,
}) => {
  for (const prefix of ['', '/es']) {
    await page.goto(`${prefix}/projects/api-gateway/`);
    const summary = page.locator('[aria-labelledby="study-summary-heading"]');
    await expect(summary).toContainText(
      prefix ? 'Autor del proyecto' : 'Project author',
    );
    expect(
      await summary.evaluate((element) => {
        const article = document.querySelector('article.case-prose');
        return Boolean(
          article &&
          element.compareDocumentPosition(article) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        );
      }),
    ).toBe(true);
    await expect(
      page.locator(
        'aside a[href="#the-problem"], aside a[href="#el-problema"]',
      ),
    ).toHaveCount(1);
    await expect(page.locator('a[href="#walkthrough"]')).toHaveCount(2);
  }
});

test('mobile navigation provides the localized CV without leaving the current page', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The desktop header already contains its CV control.');
  await page.goto('/es/');
  await page.getByLabel('Abrir o cerrar navegación').click();
  const resume = page
    .getByRole('navigation', { name: 'Navegación móvil' })
    .getByRole('link', { name: 'Descargar currículum completo', exact: true });
  await expect(resume).toHaveAttribute(
    'href',
    '/Derian-Cordoba-CV-2026-ES.pdf',
  );
  await expect(resume).toHaveAttribute('download');
});

test('inquiry failures preserve input, announce recovery, and prevent duplicate submissions', async ({
  page,
}) => {
  await page.goto('/es/hiring/');
  const form = page.locator('[data-inquiry-form]');
  test.skip(
    (await form.count()) === 0,
    'Enable PUBLIC_CONTACT_FORM_ENABLED for inquiry coverage.',
  );
  await expect(form).toHaveAttribute('aria-busy', 'false');
  let requests = 0;
  let release: (() => void) | undefined;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/es/thanks/', async (route) => {
    requests += 1;
    await pending;
    await route.fulfill({ status: 503, body: 'Unavailable' });
  });
  await form.getByLabel('Nombre', { exact: true }).fill('Example');
  await form
    .getByLabel('Correo electrónico', { exact: true })
    .fill('example@example.com');
  await form
    .getByLabel('¿Sobre qué te gustaría conversar?')
    .fill('A meaningful project discussion.');
  await form
    .getByRole('button', { name: 'Enviar mensaje', exact: true })
    .click();
  await expect(
    form.getByRole('button', { name: 'Enviando…', exact: true }),
  ).toBeDisabled();
  await expect.poll(() => requests).toBe(1);
  await form.evaluate((element) =>
    (element as HTMLFormElement).requestSubmit(),
  );
  expect(requests).toBe(1);
  release?.();
  await expect(form.getByRole('alert')).toContainText(
    'No pudimos confirmar el envío',
  );
  await expect(form.getByRole('alert')).toBeFocused();
  await expect(
    form.getByLabel('¿Sobre qué te gustaría conversar?'),
  ).toHaveValue('A meaningful project discussion.');
  await expect(
    form.getByRole('button', { name: 'Intentar de nuevo', exact: true }),
  ).toBeEnabled();
  await expect(page).toHaveURL(/\/es\/hiring\/$/u);
});

test('screenshot enlargement is keyboard accessible after client navigation', async ({
  page,
}) => {
  await page.goto('/');
  await navigateAndWaitForPageLoad(page, () =>
    page.locator('#projects h3 a[href="/projects/experimentation/"]').click(),
  );
  const trigger = page.getByRole('button', {
    name: 'Enlarge screenshot',
    exact: true,
  });
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('inquiry submission still works natively without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/es/hiring/`);
    const form = page.locator('[data-inquiry-form]');
    test.skip(
      (await form.count()) === 0,
      'Enable PUBLIC_CONTACT_FORM_ENABLED for inquiry coverage.',
    );
    await page.route('**/es/thanks/', async (route) => {
      expect(route.request().method()).toBe('POST');
      expect(route.request().postData()).toContain(
        'form-name=portfolio-inquiry-es',
      );
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
      .fill('A meaningful project discussion.');
    await form
      .getByRole('button', { name: 'Enviar mensaje', exact: true })
      .click();
    await expect(page.getByRole('heading', { name: 'Received' })).toBeVisible();
  } finally {
    await context.close();
  }
});
