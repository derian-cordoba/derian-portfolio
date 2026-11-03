import { afterEach, describe, expect, it, vi } from 'vitest';
import { NetlifyInquiryTransport } from '@/infrastructure/netlify-inquiry-transport';
import { createInquiryViewModel } from '@/presentation/view-models/inquiry-view-model';

afterEach(() => vi.useRealTimers());

describe('inquiry feedback', () => {
  it('disables repeated submission while waiting and offers a localized recovery action', () => {
    expect(createInquiryViewModel('submitting', 'en')).toMatchObject({
      busy: true,
      buttonLabel: 'Sending…',
      message: '',
    });
    expect(createInquiryViewModel('unconfirmed', 'es')).toMatchObject({
      busy: false,
      buttonLabel: 'Intentar de nuevo',
    });
    expect(createInquiryViewModel('unconfirmed', 'es').message).toContain(
      'Tu mensaje sigue aquí',
    );
    expect(createInquiryViewModel('idle', 'en')).toMatchObject({
      busy: false,
      buttonLabel: 'Send message',
      message: '',
    });
  });
});

describe('Netlify inquiry transport', () => {
  it('URL-encodes special characters and forwards the form identity', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('Accepted', { status: 200 }));
    const transport = new NetlifyInquiryTransport(request);
    const body = new URLSearchParams({
      'form-name': 'portfolio-inquiry-es',
      name: 'Córdoba & Team',
      message: 'A + B',
    });
    expect(
      await transport.submit(
        'https://portfolio.example/es/thanks/',
        body,
        new AbortController().signal,
      ),
    ).toBe(true);
    expect(request).toHaveBeenCalledWith(
      'https://portfolio.example/es/thanks/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      }),
    );
  });

  it.each([404, 503])('does not report HTTP %s as success', async (status) => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('Failed', { status }));
    expect(
      await new NetlifyInquiryTransport(request).submit(
        '/thanks/',
        new URLSearchParams(),
        new AbortController().signal,
      ),
    ).toBe(false);
  });

  it('returns an unconfirmed result on network failure', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new TypeError('Network unavailable'));
    expect(
      await new NetlifyInquiryTransport(request).submit(
        '/thanks/',
        new URLSearchParams(),
        new AbortController().signal,
      ),
    ).toBe(false);
  });

  it('cancels a stalled request after its deadline and clears its timer', async () => {
    vi.useFakeTimers();
    const request = vi.fn<typeof fetch>(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener(
            'abort',
            () => reject(new Error('Aborted')),
            { once: true },
          );
        }),
    );
    const result = new NetlifyInquiryTransport(request).submit(
      '/thanks/',
      new URLSearchParams(),
      new AbortController().signal,
    );
    await vi.advanceTimersByTimeAsync(15_000);
    expect(await result).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('propagates lifecycle cancellation to the pending request', async () => {
    const request = vi.fn<typeof fetch>(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener(
            'abort',
            () => reject(new Error('Aborted')),
            { once: true },
          );
        }),
    );
    const signal = new AbortController();
    const pending = new NetlifyInquiryTransport(request).submit(
      '/thanks/',
      new URLSearchParams(),
      signal.signal,
    );
    signal.abort();
    expect(await pending).toBe(false);
  });
});
