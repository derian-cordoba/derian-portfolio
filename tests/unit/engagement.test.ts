import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  allowsMeasurement,
  initializeMeasurement,
  trackEngagement,
  trackPageView,
} from '@/infrastructure/engagement';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('optional analytics adapter', () => {
  it('respects both browser privacy preferences', () => {
    vi.stubGlobal('navigator', { doNotTrack: '1' });
    expect(allowsMeasurement()).toBe(false);
    vi.stubGlobal('navigator', { globalPrivacyControl: true });
    expect(allowsMeasurement()).toBe(false);
    vi.stubGlobal('navigator', {});
    expect(allowsMeasurement()).toBe(true);
  });

  it('loads no third-party script on previews or without configuration', () => {
    const append = vi.fn();
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('location', { hostname: 'deploy-preview.example' });
    vi.stubGlobal('document', {
      querySelector: () => ({
        content: 'https://plausible.io/js/pa-example.js',
        dataset: { host: 'derian-cordoba.me' },
      }),
      head: { append },
    });
    initializeMeasurement();
    expect(append).not.toHaveBeenCalled();
    vi.stubGlobal('document', { querySelector: () => null, head: { append } });
    initializeMeasurement();
    expect(append).not.toHaveBeenCalled();
  });

  it('queues events until the provider loads and sanitizes page locations', () => {
    const append = vi.fn();
    const script = {};
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('location', {
      hostname: 'derian-cordoba.me',
      origin: 'https://derian-cordoba.me',
      pathname: '/es/hiring/',
      search: '?email=private',
    });
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });
    vi.stubGlobal('document', {
      querySelector: () => ({
        content: 'https://plausible.io/js/pa-example.js',
        dataset: { host: 'derian-cordoba.me' },
      }),
      createElement: () => script,
      head: { append },
    });
    initializeMeasurement();
    trackPageView();
    trackEngagement('CV downloaded');
    expect(append).toHaveBeenCalledWith(script);
    expect(window.plausible?.q).toEqual([
      ['pageview', { u: 'https://derian-cordoba.me/es/hiring/' }],
      [
        'CV downloaded',
        { props: { locale: 'es' }, u: 'https://derian-cordoba.me/es/hiring/' },
      ],
    ]);
    expect(window.plausible?.o).toMatchObject({
      autoCapturePageviews: false,
      formSubmissions: false,
    });
    const configuration = window.plausible?.o as {
      transformRequest: (payload: object) => object;
    };
    expect(
      configuration.transformRequest({
        u: 'https://derian-cordoba.me/notes/?email=private#contact',
        r: 'https://example.com/?private=value',
      }),
    ).toEqual({
      u: 'https://derian-cordoba.me/notes/',
      r: 'https://example.com/',
    });
  });
});
