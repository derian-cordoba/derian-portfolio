import { englishPaths as paths } from '../support/routes.ts';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attributes, canonical, getPage, meta } from './support.ts';
import { localizePath } from '../../src/i18n/routing.ts';

test('deployed pages expose consistent bilingual SEO metadata', async (t) => {
  const home = await getPage('/');
  assert.equal(
    home.status,
    200,
    'The deployment must be public; a 401 prevents inspection.',
  );
  // Validate declared metadata consistency without fetching or provisioning the future domain.
  const declaredOrigin = new URL(canonical(home.html)).origin;
  for (const locale of ['en', 'es'] as const) {
    for (const original of paths) {
      const path = localizePath(original, locale);
      await t.test(path, async () => {
        const page = await getPage(path);
        const errorPage = original === '/404.html';
        assert.ok(
          errorPage ? [200, 404].includes(page.status) : page.status === 200,
          `${path}: HTTP ${page.status}`,
        );
        assert.equal(attributes(page.html, 'html')[0]?.['lang'], locale);
        assert.equal([...page.html.matchAll(/<h1(?:\s|>)/gu)].length, 1);
        assert.match(page.html, /<title>[^<]*Derian Córdoba[^<]*<\/title>/u);
        assert.ok(
          meta(page.html, 'description')?.trim(),
          `${path}: missing description`,
        );
        assert.equal(canonical(page.html), new URL(path, declaredOrigin).href);
        assert.equal(meta(page.html, 'og:url'), canonical(page.html));
        assert.ok(meta(page.html, 'og:image')?.startsWith('https://'));
        const links = attributes(page.html, 'link');
        for (const language of ['en', 'es'] as const) {
          assert.equal(
            links.find(
              (item) =>
                item['rel'] === 'alternate' && item['hreflang'] === language,
            )?.['href'],
            new URL(localizePath(path, language), declaredOrigin).href,
          );
        }
        const noindex = meta(page.html, 'robots')?.includes('noindex') ?? false;
        assert.equal(noindex, errorPage || original === '/thanks/');
      });
    }
  }
});

test('project titles identify their subject and link to the relevant dated notes', async () => {
  for (const locale of ['en', 'es'] as const) {
    for (const [project, subject, note] of [
      ['api-gateway', 'API Gateway', 'failure-controls'],
      ['experimentation', 'Laravel', 'consistent-experiments'],
    ] as const) {
      const projectPath = localizePath(`/projects/${project}/`, locale);
      const notePath = localizePath(`/notes/${note}/`, locale);
      const projectPage = await getPage(projectPath);
      const notePage = await getPage(notePath);
      assert.ok(
        projectPage.html
          .match(/<title>([^<]*)<\/title>/u)?.[1]
          ?.includes(subject),
      );
      assert.ok(
        attributes(projectPage.html, 'a').some(
          (link) => link['href'] === notePath,
        ),
        `${projectPath}: missing note link`,
      );
      assert.ok(
        attributes(notePage.html, 'a').some((link) =>
          link['href']?.startsWith(projectPath),
        ),
        `${notePath}: missing project link`,
      );
      assert.ok(
        attributes(notePage.html, 'time').some((time) =>
          /^\d{4}-\d{2}-\d{2}$/u.test(time['datetime'] ?? ''),
        ),
        `${notePath}: missing publication date`,
      );
    }
  }
});

test('robots and sitemap use the same declared canonical origin', async () => {
  const home = await getPage('/');
  const origin = new URL(canonical(home.html)).origin;
  const robots = await getPage('/robots.txt');
  const sitemap = await getPage('/sitemap-0.xml');
  assert.equal(robots.status, 200);
  assert.equal(sitemap.status, 200);
  assert.ok(robots.html.includes(`Sitemap: ${origin}/sitemap-index.xml`));
  assert.ok(sitemap.html.includes(`${origin}/notes/failure-controls/`));
  assert.ok(!sitemap.html.includes('/thanks/'));
});
