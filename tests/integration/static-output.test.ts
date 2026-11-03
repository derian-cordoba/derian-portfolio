import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const output = resolve('dist');

function htmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = join(directory, entry.name);

    if (entry.isDirectory()) {
      return htmlFiles(filename);
    }

    return entry.name.endsWith('.html') ? [filename] : [];
  });
}

test('all seven generated pages include their content and document metadata', () => {
  const files = htmlFiles(output);
  assert.equal(files.length, 7);

  for (const filename of files) {
    const html = readFileSync(filename, 'utf8');
    assert.match(html, /<html lang="en">/u, filename);
    assert.equal([...html.matchAll(/<h1[\s>]/gu)].length, 1, filename);
    assert.match(html, /<title>[^<]+<\/title>/u, filename);
    assert.match(html, /<meta name="description" content="[^"]+"/u, filename);
    assert.match(html, /<link rel="canonical" href="https:\/\//u, filename);
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
          targetHtml.includes(`id="${url.hash.slice(1)}"`),
          `${filename}: missing fragment ${reference}`,
        );
      }
    }
  }
});

test('CV and discovery files are valid build artifacts', () => {
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
