import {
  createEngagementContext,
  type EngagementContext,
  type EngagementEvent,
} from '@/domain/engagement';

type EventOptions = { readonly props?: EngagementContext; readonly u?: string };
interface Plausible {
  (name: string, options?: EventOptions): void;
  q?: [string, EventOptions | undefined][];
  o?: object;
  init?: (options: object) => void;
}
declare global {
  interface Window {
    plausible?: Plausible;
  }
}

export function allowsMeasurement(): boolean {
  const browser = navigator as Navigator & { globalPrivacyControl?: boolean };
  return navigator.doNotTrack !== '1' && !browser.globalPrivacyControl;
}

function sanitizeUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol)
      ? `${url.origin}${url.pathname}`
      : null;
  } catch {
    return null;
  }
}

export function trackEngagement(
  name: EngagementEvent,
  scenario?: string,
): void {
  if (!allowsMeasurement()) {
    return;
  }
  const context = createEngagementContext(location.pathname, scenario);
  window.dispatchEvent(
    new CustomEvent('portfolio:engagement', { detail: { name, ...context } }),
  );
  window.plausible?.(name, {
    props: context,
    u: `${location.origin}${location.pathname}`,
  });
}

/** Configure only on the declared production host; no tracker on previews by default. */
export function initializeMeasurement(): void {
  const config = document.querySelector<HTMLMetaElement>(
    'meta[name="portfolio-analytics"]',
  );
  const source = config?.content;
  const host = config?.dataset['host'];
  if (!source || location.hostname !== host || !allowsMeasurement()) {
    return;
  }
  const queued: Plausible = (name, options) => {
    (queued.q ??= []).push([name, options]);
  };
  queued.init = (options) => {
    queued.o = options;
  };
  window.plausible ??= queued;
  window.plausible.init?.({
    autoCapturePageviews: false,
    outboundLinks: false,
    fileDownloads: false,
    formSubmissions: false,
    transformRequest: (payload: Record<string, unknown>) => ({
      ...payload,
      u: sanitizeUrl(payload['u']) ?? `${location.origin}${location.pathname}`,
      r: sanitizeUrl(payload['r']),
    }),
  });
  const script = document.createElement('script');
  script.src = source;
  script.async = true;
  script.id = 'portfolio-analytics-provider';
  document.head.append(script);
}

export function trackPageView(): void {
  if (allowsMeasurement()) {
    window.plausible?.('pageview', {
      u: `${location.origin}${location.pathname}`,
    });
  }
}
