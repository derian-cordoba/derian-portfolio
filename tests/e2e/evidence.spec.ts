import { test, expect } from '@playwright/test';

test('leadership evidence links to a localized case study', async ({
  page,
}) => {
  for (const prefix of ['', '/es']) {
    await page.goto(`${prefix}/hiring/`);
    const link = page.locator(`a[href="${prefix}/work/engineering-delivery/"]`);
    await link.click();
    await expect(page.locator('h1')).toContainText(
      prefix ? 'Liderazgo técnico' : 'Technical Leadership',
    );
    await expect(page.locator('article')).toContainText('Bitbucket Pipelines');
  }
});

test('captured gateway evidence remains readable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/es/projects/api-gateway/`);
    await expect(page.locator('#recorded-run video')).toHaveAttribute(
      'controls',
      '',
    );
    const transcript = page.locator('#recording-transcript');
    await transcript.locator('summary').click();
    await expect(transcript.locator('li')).toHaveCount(6);
    await expect(transcript).toContainText('CIRCUIT_OPEN');
    await expect(transcript).toContainText('Sondeo de recuperación');
  } finally {
    await context.close();
  }
});

test('inquiry analytics distinguish an unconfirmed attempt from an accepted retry', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.addEventListener('portfolio:engagement', (event) => {
      const detail = (event as CustomEvent).detail as { name: string };
      if (detail.name.startsWith('Inquiry ')) {
        const events = JSON.parse(
          sessionStorage.getItem('test-inquiry-events') ?? '[]',
        ) as string[];
        sessionStorage.setItem(
          'test-inquiry-events',
          JSON.stringify([...events, detail.name]),
        );
      }
    });
  });
  await page.goto('/hiring/');
  const form = page.locator('[data-inquiry-form]');
  test.skip(
    (await form.count()) === 0,
    'Enable PUBLIC_CONTACT_FORM_ENABLED for inquiry coverage.',
  );
  await expect(form).toHaveAttribute('aria-busy', 'false');
  let accepted = false;
  await page.route('**/thanks/', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: accepted ? 200 : 503,
        body: accepted ? 'Accepted' : 'Unavailable',
      });
    } else {
      await route.continue();
    }
  });
  await form.getByLabel('Name', { exact: true }).fill('Example');
  await form.getByLabel('Email', { exact: true }).fill('example@example.com');
  await form
    .getByLabel('What would you like to discuss?')
    .fill('A backend engineering opportunity.');
  await form.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(form.getByRole('alert')).toBeVisible();
  accepted = true;
  await form.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page).toHaveURL(/\/thanks\/$/u);
  expect(
    await page.evaluate(() =>
      JSON.parse(sessionStorage.getItem('test-inquiry-events') ?? '[]'),
    ),
  ).toEqual([
    'Inquiry submitted',
    'Inquiry unconfirmed',
    'Inquiry submitted',
    'Inquiry accepted',
  ]);
});
