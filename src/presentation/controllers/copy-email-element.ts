import { trackEngagement } from '@/infrastructure/engagement';

export class CopyEmailElement extends HTMLElement {
  private listeners: AbortController | undefined;

  connectedCallback(): void {
    this.listeners?.abort();
    this.listeners = new AbortController();
    const button = this.querySelector('button');
    if (!button) {
      return;
    }
    button.hidden = false;
    button.addEventListener(
      'click',
      () => {
        void this.copy();
      },
      { signal: this.listeners.signal },
    );
  }

  disconnectedCallback(): void {
    this.listeners?.abort();
  }

  private async copy(): Promise<void> {
    const feedback = this.querySelector('[data-feedback]');
    if (!feedback) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.dataset['email'] ?? '');
      feedback.textContent = this.dataset['success'] ?? '';
      trackEngagement('Email copied');
    } catch {
      feedback.textContent = this.dataset['error'] ?? '';
    }
  }
}
