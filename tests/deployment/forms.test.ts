import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attributes, deployment, getPage } from './support.ts';
import { localizePath } from '../../src/i18n/routing.ts';

for (const locale of ['en', 'es'] as const) {
  test(`Netlify has processed the ${locale} inquiry form and serves its confirmation`, async () => {
    const page = await getPage(localizePath('/', locale));
    assert.equal(page.status, 200);
    const form = attributes(page.html, 'form').find(
      (item) => 'data-inquiry-form' in item,
    );
    assert.ok(form, 'No inquiry form found. Check the production build flag.');
    assert.equal(form['name'], `portfolio-inquiry-${locale}`);
    assert.equal(form['method']?.toUpperCase(), 'POST');
    assert.equal(form['action'], localizePath('/thanks/', locale));
    assert.ok(
      !('data-netlify' in form) && !('netlify' in form),
      'Netlify has not processed the form. Enable Forms detection and redeploy.',
    );
    assert.ok(
      attributes(page.html, 'input').some(
        (input) =>
          input['name'] === 'form-name' && input['value'] === form['name'],
      ),
    );
    const confirmation = await getPage(form['action']);
    assert.equal(confirmation.status, 200);
  });

  test(
    `live ${locale} inquiry POST reaches the confirmation page`,
    { skip: process.env['SUBMIT_TEST_INQUIRIES'] !== 'true' },
    async () => {
      const target = localizePath('/thanks/', locale);
      const response = await fetch(new URL(target, deployment), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': `portfolio-inquiry-${locale}`,
          language: locale,
          website: '',
          name: `Portfolio deployment check (${locale})`,
          email: 'portfolio-diagnostic@example.com',
          message:
            'Diagnostic submission requested by the portfolio owner during deployment verification. This is a test and requires no reply.',
        }),
        signal: AbortSignal.timeout(20_000),
      });
      assert.equal(
        response.status,
        200,
        `Inquiry POST returned HTTP ${response.status}`,
      );
      const html = await response.text();
      assert.match(
        html,
        locale === 'es'
          ? /Gracias por contactarme/u
          : /Thanks for reaching out/u,
      );
      assert.ok(attributes(html, 'html')[0]?.['lang'] === locale);
    },
  );
}
