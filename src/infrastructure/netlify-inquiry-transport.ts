import type { InquiryTransport } from '@/application/ports/inquiry-transport';

/** A successful HTTP response confirms handling, not inbox delivery. */
export class NetlifyInquiryTransport implements InquiryTransport {
  constructor(
    private readonly request: typeof fetch = fetch.bind(globalThis),
  ) {}

  async submit(
    url: string,
    body: URLSearchParams,
    signal: AbortSignal,
  ): Promise<boolean> {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal.addEventListener('abort', cancel, { once: true });
    if (signal.aborted) {
      cancel();
    }
    const timeout = setTimeout(cancel, 15_000);
    try {
      const response = await this.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: controller.signal,
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener('abort', cancel);
    }
  }
}
