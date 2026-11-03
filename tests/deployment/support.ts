import assert from 'node:assert/strict';

const configured = process.env['DEPLOYMENT_URL'];
assert.ok(configured, 'Set DEPLOYMENT_URL to the public deployment to check.');
export const deployment = new URL(configured);
assert.equal(
  deployment.protocol,
  'https:',
  'Deployment checks require a public HTTPS URL.',
);

interface Page {
  readonly status: number;
  readonly html: string;
  readonly url: string;
}
const pages = new Map<string, Promise<Page>>();

/** Read-only checks share responses to avoid repeatedly requesting the same page. */
export function getPage(path: string): Promise<Page> {
  const existing = pages.get(path);
  if (existing) {
    return existing;
  }
  const request = fetch(new URL(path, deployment), {
    signal: AbortSignal.timeout(20_000),
  }).then(async (response) => ({
    status: response.status,
    html: await response.text(),
    url: response.url,
  }));
  pages.set(path, request);
  return request;
}

/** Attribute inspection for the project's generated HTML; no scripts are executed. */
export function attributes(
  html: string,
  tag: string,
): Record<string, string>[] {
  const elements = html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'giu'));
  return [...elements].map((element) => {
    const result: Record<string, string> = {};
    for (const match of (element[1] ?? '').matchAll(
      /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu,
    )) {
      const name = match[1];
      if (name) {
        result[name.toLowerCase()] = (
          match[2] ??
          match[3] ??
          match[4] ??
          ''
        ).replaceAll('&amp;', '&');
      }
    }
    return result;
  });
}

export function meta(html: string, name: string): string | undefined {
  return attributes(html, 'meta').find(
    (item) => item['name'] === name || item['property'] === name,
  )?.['content'];
}

export function canonical(html: string): string {
  const href = attributes(html, 'link').find(
    (item) => item['rel'] === 'canonical',
  )?.['href'];
  assert.ok(href, 'Missing canonical link.');
  return href;
}
