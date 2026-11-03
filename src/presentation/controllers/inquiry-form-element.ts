import type { InquiryState } from '@/domain/inquiry';
import { isLocale, type Locale } from '@/domain/locale';
import { NetlifyInquiryTransport } from '@/infrastructure/netlify-inquiry-transport';
import { createInquiryViewModel } from '../view-models/inquiry-view-model';

export class InquiryFormElement extends HTMLElement {
  private state: InquiryState = 'idle';
  private locale: Locale = 'en';
  private listeners: AbortController | undefined;
  private request: AbortController | undefined;
  private readonly transport = new NetlifyInquiryTransport();

  connectedCallback(): void {
    this.listeners?.abort();
    this.listeners = new AbortController();
    this.state = 'idle';
    const locale = this.getAttribute('lang') ?? undefined;
    this.locale = isLocale(locale) ? locale : 'en';
    this.querySelector('form')?.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        if (this.state === 'submitting') {
          event.stopPropagation();
          return;
        }
        void this.submit();
      },
      { signal: this.listeners.signal },
    );
    this.render();
  }

  disconnectedCallback(): void {
    this.listeners?.abort();
    this.request?.abort();
  }

  private async submit(): Promise<void> {
    const form = this.querySelector('form');
    if (!form || !form.reportValidity()) {
      return;
    }
    const body = new URLSearchParams();
    for (const [name, value] of new FormData(form)) {
      if (typeof value === 'string') {
        body.append(name, value);
      }
    }
    const request = new AbortController();
    this.request = request;
    this.state = 'submitting';
    this.render();
    const accepted = await this.transport.submit(
      form.action,
      body,
      request.signal,
    );
    if (!this.isConnected || request.signal.aborted) {
      return;
    }
    if (accepted) {
      window.location.assign(form.action);
      return;
    }
    this.state = 'unconfirmed';
    this.render();
    this.querySelector<HTMLElement>('[data-inquiry-feedback]')?.focus();
  }

  private render(): void {
    const model = createInquiryViewModel(this.state, this.locale);
    const form = this.querySelector('form');
    const button = this.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    const label = this.querySelector('[data-submit-label]');
    const feedback = this.querySelector<HTMLElement>('[data-inquiry-feedback]');
    form?.setAttribute('aria-busy', String(model.busy));
    for (const field of this.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >('input:not([type="hidden"]), textarea')) {
      field.readOnly = model.busy;
    }
    if (button) {
      button.disabled = model.busy;
    }
    if (label) {
      label.textContent = model.buttonLabel;
    }
    if (feedback) {
      feedback.hidden = !model.message;
      feedback.textContent = model.message;
    }
  }
}
