import { localizedRoutes } from '../support/routes.ts';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { parseEnv } from 'node:util';

const output = resolve('dist');
// Match production build-file precedence; explicit shell/CI variables take priority.
const buildEnvironment = Object.assign(
  {},
  ...['.env', '.env.local', '.env.production', '.env.production.local']
    .filter((filename) => existsSync(filename))
    .map((filename) => parseEnv(readFileSync(filename, 'utf8'))),
  process.env,
) as Record<string, string | undefined>;

function htmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = join(directory, entry.name);

    if (entry.isDirectory()) {
      return htmlFiles(filename);
    }

    return entry.name.endsWith('.html') ? [filename] : [];
  });
}

test('all twenty-four generated pages include localized content and document metadata', () => {
  const files = htmlFiles(output);
  assert.equal(files.length, localizedRoutes.length);

  for (const filename of files) {
    const html = readFileSync(filename, 'utf8');
    const locale = filename.startsWith(join(output, 'es') + '/') ? 'es' : 'en';
    assert.ok(
      html.match(/<html\b[^>]*>/u)?.[0].includes(`lang="${locale}"`),
      filename,
    );
    assert.equal([...html.matchAll(/<h1[\s>]/gu)].length, 1, filename);
    assert.match(html, /<title>[^<]+<\/title>/u, filename);
    assert.match(html, /<meta name="description" content="[^"]+"/u, filename);
    assert.match(html, /<link rel="canonical" href="https:\/\//u, filename);
    assert.match(html, /hreflang="en"/u, filename);
    assert.match(html, /hreflang="es"/u, filename);
    assert.match(html, /hreflang="x-default"/u, filename);
    assert.ok(html.includes('data-theme-init'), filename);
    assert.ok(html.includes('<theme-toggle'), filename);
    assert.match(
      html,
      /name="astro-view-transitions-enabled" content="true"/u,
      filename,
    );
    assert.match(
      html,
      /name="astro-view-transitions-fallback" content="animate"/u,
      filename,
    );
  }
});

test('the generated startup script selects a theme before the body and tolerates blocked storage', () => {
  const html = readFileSync(join(output, 'index.html'), 'utf8');
  const script = html.match(
    /<script\b([^>]*\bdata-theme-init\b[^>]*)>([\s\S]*?)<\/script>/u,
  );
  assert.ok(script?.[1]);
  assert.ok(script[2]);
  assert.ok(html.indexOf('data-theme-init') < html.indexOf('<body'));
  const storageKey = script[1].match(/data-storage-key="([^"]+)"/u)?.[1];
  assert.equal(storageKey, 'portfolio-theme');

  for (const [preference, systemDark, blocked, expected] of [
    ['dark', false, false, 'dark'],
    ['light', true, false, 'light'],
    [null, true, false, 'dark'],
    ['invalid', false, false, 'light'],
    [null, true, true, 'dark'],
  ] as const) {
    const dataset: Record<string, string> = {};
    runInNewContext(script[2], {
      document: {
        currentScript: { getAttribute: () => storageKey },
        documentElement: { dataset },
      },
      window: {
        get localStorage() {
          if (blocked) {
            throw new Error('Storage disabled');
          }
          return { getItem: () => preference };
        },
        matchMedia: () => ({ matches: systemDark }),
      },
    });
    assert.equal(dataset['theme'], expected);
  }
});

test('every root-relative page link, asset, and fragment points to generated output', () => {
  for (const filename of htmlFiles(output)) {
    const html = readFileSync(filename, 'utf8');

    for (const match of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/gu)) {
      const reference = match[1];

      if (!reference) {
        continue;
      }

      const url = new URL(reference, 'https://portfolio.example');
      const target = url.pathname.endsWith('/')
        ? `${url.pathname}index.html`
        : url.pathname;
      const destination = join(output, decodeURIComponent(target));
      assert.ok(existsSync(destination), `${filename}: missing ${reference}`);

      if (url.hash && destination.endsWith('.html')) {
        const targetHtml = readFileSync(destination, 'utf8');
        assert.ok(
          targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
          `${filename}: missing fragment ${reference}`,
        );
      }
    }
  }
});

test('CV and discovery files are valid build artifacts', () => {
  assert.equal(
    readFileSync(join(output, 'Derian-Cordoba-CV-2026-ES.pdf'), 'utf8').slice(
      0,
      5,
    ),
    '%PDF-',
  );
  assert.equal(
    readFileSync(join(output, 'Derian-Cordoba-CV-2026.pdf'), 'utf8').slice(
      0,
      5,
    ),
    '%PDF-',
  );
  assert.match(
    readFileSync(join(output, 'robots.txt'), 'utf8'),
    /Sitemap: https:\/\//u,
  );
  assert.match(
    readFileSync(join(output, 'sitemap-index.xml'), 'utf8'),
    /<sitemapindex/u,
  );
});

test('every English page has a matching Spanish page and reciprocal language links', () => {
  for (const filename of htmlFiles(output).filter(
    (file) => !file.startsWith(join(output, 'es') + '/'),
  )) {
    const relative = filename.slice(output.length).replace(/index\.html$/u, '');
    const englishPath = relative;
    const spanishPath =
      relative === '/404.html' ? '/es/404/' : `/es${relative}`;
    const spanishFile = join(
      output,
      spanishPath.endsWith('/') ? `${spanishPath}index.html` : spanishPath,
    );
    assert.ok(existsSync(spanishFile), spanishPath);
    const english = readFileSync(filename, 'utf8');
    const spanish = readFileSync(spanishFile, 'utf8');
    assert.ok(english.includes(`href="${spanishPath}"`), filename);
    assert.ok(spanish.includes(`href="${englishPath}"`), spanishFile);
    assert.ok(spanish.includes('Leer esta página en español'), spanishFile);
    assert.ok(
      spanish.includes('Creado con criterio. Siempre evolucionando.'),
      spanishFile,
    );
    assert.ok(
      !spanish.includes('Thoughtfully built. Always evolving.'),
      spanishFile,
    );
    assert.ok(spanish.includes('/Derian-Cordoba-CV-2026-ES.pdf'), spanishFile);
  }
});

test('Spanish case studies and simulation are pre-rendered in Spanish', () => {
  for (const directory of ['work', 'projects']) {
    for (const filename of htmlFiles(join(output, 'es', directory))) {
      const html = readFileSync(filename, 'utf8');
      assert.ok(html.includes('Mi función'), filename);
      assert.ok(html.includes('min de lectura'), filename);
      assert.ok(!html.includes('My role'), filename);
      assert.ok(!html.includes('The problem'), filename);
    }
  }
  const html = readFileSync(
    join(output, 'es/projects/api-gateway/index.html'),
    'utf8',
  ).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gu, '');
  assert.ok(html.includes('Simular fallo del servicio de destino'));
  assert.ok(html.includes('lang="es"'));
  assert.ok(html.includes('Circuito'));
  assert.ok(!html.includes('Simulate upstream failure'));
});

test('hiring, notes, and evidence are complete static documents in both languages', () => {
  for (const prefix of ['', 'es/']) {
    const hiring = readFileSync(
      join(output, prefix, 'hiring/index.html'),
      'utf8',
    );
    const notes = readFileSync(
      join(output, prefix, 'notes/index.html'),
      'utf8',
    );
    const gateway = readFileSync(
      join(output, prefix, 'projects/api-gateway/index.html'),
      'utf8',
    );
    assert.ok(hiring.includes(`href="/${prefix}notes/"`));
    for (const id of ['failure-controls', 'consistent-experiments']) {
      assert.ok(notes.includes(`href="/${prefix}notes/${id}/"`));
      assert.ok(existsSync(join(output, prefix, `notes/${id}/index.html`)));
    }
    assert.equal(
      [...gateway.matchAll(/data-walkthrough-scenario=/gu)].length,
      3,
    );
    assert.ok(gateway.includes('id="walkthrough"'));
    assert.ok(gateway.includes('tests/integration/timeout.test.ts'));
    assert.ok(gateway.includes('&quot;timeout&quot;: 100'));
    const experiment = readFileSync(
      join(output, prefix, 'projects/experimentation/index.html'),
      'utf8',
    );
    assert.ok(
      experiment.includes('src="/images/experimentation-dashboard.png"'),
    );
    const thanks = readFileSync(
      join(output, prefix, 'thanks/index.html'),
      'utf8',
    );
    assert.ok(thanks.includes('content="noindex, follow"'));
  }
});

test('optional inquiries use native Netlify POST handling and localized success pages', () => {
  const enabled = buildEnvironment['PUBLIC_CONTACT_FORM_ENABLED'] === 'true';
  for (const prefix of ['', 'es/']) {
    const html = readFileSync(
      join(output, prefix, 'hiring/index.html'),
      'utf8',
    );
    assert.equal(html.includes('data-inquiry-form'), enabled);
    if (enabled) {
      assert.ok(html.includes('method="POST"'));
      assert.ok(html.includes('data-netlify="true"'));
      assert.ok(html.includes('netlify-honeypot="website"'));
      assert.ok(html.includes('data-astro-reload'));
      assert.ok(html.includes(`action="/${prefix}thanks/"`));
    }
  }
});

test('the production sitemap omits confirmation and error pages', () => {
  const sitemap = readFileSync(join(output, 'sitemap-0.xml'), 'utf8');
  assert.ok(!sitemap.includes('/thanks/'));
  assert.ok(!sitemap.includes('/404/'));
  assert.ok(sitemap.includes('/notes/failure-controls/'));
});

test('project subjects, dated note openings, and reciprocal references survive static rendering', () => {
  for (const prefix of ['', 'es/']) {
    for (const [path, subject] of [
      ['projects/api-gateway', 'API Gateway'],
      ['projects/experimentation', 'Laravel'],
      ['projects/secure-keys', 'Secure Keys'],
      ['work/saas-modernization', 'Laravel'],
    ] as const) {
      const html = readFileSync(
        join(output, prefix, path, 'index.html'),
        'utf8',
      );
      assert.ok(
        html.match(/<title>([^<]*)<\/title>/u)?.[1]?.includes(subject),
        path,
      );
      assert.ok(
        html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/u)?.[1]?.includes(subject),
        path,
      );
    }
    for (const [project, note] of [
      ['api-gateway', 'failure-controls'],
      ['experimentation', 'consistent-experiments'],
    ] as const) {
      const html = readFileSync(
        join(output, prefix, `notes/${note}/index.html`),
        'utf8',
      );
      assert.match(html, /<time datetime="2026-11-03">/u);
      const article =
        html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/u)?.[1] ?? '';
      assert.match(article.trimStart(), /^<p>/u);
      assert.ok(article.indexOf('</p>') < article.indexOf('<h2'), note);
      const projectHtml = readFileSync(
        join(output, prefix, `projects/${project}/index.html`),
        'utf8',
      );
      assert.ok(
        projectHtml.includes(`href="/${prefix}notes/${note}/"`),
        project,
      );
      assert.ok(html.includes(`href="/${prefix}projects/${project}/`), note);
    }
  }
});

test('the optional Search Console verification value is emitted only when configured', () => {
  const html = readFileSync(join(output, 'index.html'), 'utf8');
  const enabled = Boolean(
    buildEnvironment['PUBLIC_GOOGLE_SITE_VERIFICATION']?.trim(),
  );
  assert.equal(html.includes('name="google-site-verification"'), enabled);
});

test('optional analytics can select the public deployment host independently of canonical metadata', () => {
  const html = readFileSync(join(output, 'index.html'), 'utf8');
  const enabled = Boolean(
    buildEnvironment['PUBLIC_PLAUSIBLE_SCRIPT_URL']?.trim(),
  );
  assert.equal(html.includes('name="portfolio-analytics"'), enabled);
  if (enabled) {
    const canonical = html.match(/rel="canonical" href="([^"]+)"/u)?.[1];
    assert.ok(canonical);
    const host =
      buildEnvironment['PUBLIC_ANALYTICS_HOSTNAME']?.trim() ||
      new URL(canonical).hostname;
    assert.ok(html.includes(`data-host="${host}"`));
  }
});
