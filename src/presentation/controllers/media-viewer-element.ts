import { containFocus } from './focus-containment';

export class MediaViewerElement extends HTMLElement {
  private listeners: AbortController | undefined;
  private previousOverflow = '';

  connectedCallback(): void {
    this.listeners?.abort();
    this.listeners = new AbortController();
    const options = { signal: this.listeners.signal };
    const dialog = this.querySelector('dialog');
    const trigger = this.querySelector<HTMLButtonElement>('[data-media-open]');
    if (!dialog || !trigger || typeof dialog.showModal !== 'function') {
      return;
    }
    trigger.hidden = false;
    trigger.addEventListener(
      'click',
      () => {
        this.previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        dialog.showModal();
        dialog.querySelector<HTMLButtonElement>('[data-media-close]')?.focus();
      },
      options,
    );
    dialog.addEventListener(
      'keydown',
      (event) => containFocus(event, dialog),
      options,
    );
    this.querySelector('[data-media-close]')?.addEventListener(
      'click',
      () => dialog.close(),
      options,
    );
    dialog.addEventListener(
      'close',
      () => {
        document.documentElement.style.overflow = this.previousOverflow;
        if (this.isConnected) {
          trigger.focus({ preventScroll: true });
        }
      },
      options,
    );
  }

  disconnectedCallback(): void {
    const dialog = this.querySelector('dialog');
    if (dialog?.open) {
      dialog.close();
      document.documentElement.style.overflow = this.previousOverflow;
    }
    this.listeners?.abort();
  }
}
