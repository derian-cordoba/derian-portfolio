import { test, expect } from '@playwright/test';
import { navigateAndWaitForPageLoad } from './support/navigation';

test('Safari mobile hiring path, theme, and localized project navigation', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Toggle navigation').click();
  const mobileNavigation = page.getByRole('navigation', {
    name: 'Mobile navigation',
    exact: true,
  });
  await expect(
    mobileNavigation.getByRole('link', {
      name: 'Download full résumé',
      exact: true,
    }),
  ).toHaveAttribute('download');
  await mobileNavigation
    .getByRole('link', { name: 'Hiring overview', exact: true })
    .click();
  await expect(page).toHaveURL(/\/hiring\/$/u);
  await page.getByRole('button', { name: 'Dark theme', exact: true }).click();
  await navigateAndWaitForPageLoad(page, () =>
    page
      .getByRole('link', { name: 'ES — Leer esta página en español' })
      .click(),
  );
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page
    .getByRole('link', {
      name: 'API Gateway en TypeScript: enrutamiento y resiliencia',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('heading', { name: 'De un vistazo', exact: true }),
  ).toBeVisible();
  await expect(page.locator('#study-summary-heading')).toBeVisible();
  await test.info().attach('mobile-es-dark-case-study', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('Safari header theme choice persists across reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/es/');
  await page.getByRole('button', { name: 'Tema oscuro', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('Safari screenshot preview closes with Escape and restores focus', async ({
  page,
}) => {
  await page.goto('/es/projects/experimentation/');
  const trigger = page.getByRole('button', {
    name: 'Ampliar captura',
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('Safari announces a failed inquiry and retains the message', async ({
  page,
}) => {
  await page.goto('/es/hiring/');
  const form = page.locator('[data-inquiry-form]');
  test.skip(
    (await form.count()) === 0,
    'Enable PUBLIC_CONTACT_FORM_ENABLED for inquiry coverage.',
  );
  await expect(form).toHaveAttribute('aria-busy', 'false');
  await page.route('**/es/thanks/', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' }),
  );
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
  await expect(form.getByRole('alert')).toContainText('Tu mensaje sigue aquí');
  await expect(
    form.getByRole('button', { name: 'Intentar de nuevo', exact: true }),
  ).toBeEnabled();
});
