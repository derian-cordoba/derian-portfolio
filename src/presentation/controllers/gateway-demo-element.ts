import {
  createGatewayViewModel,
  type GatewayMode,
} from '../view-models/gateway-view-model';

/** DOM binding only. Presentation decisions live in the pure view-model factory. */
export class GatewayDemoElement extends HTMLElement {
  private mode: GatewayMode = 'healthy';
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
        this.mode = createGatewayViewModel(this.mode).nextMode;
        this.render();
      },
      { signal: this.listeners.signal },
    );
    this.render();
  }

  disconnectedCallback(): void {
    this.listeners?.abort();
  }

  private render(): void {
    const model = createGatewayViewModel(this.mode);
    const bindings = {
      '[data-status]': model.status,
      '[data-status-label]': model.statusLabel,
      '[data-circuit]': model.circuit,
      '[data-message]': model.message,
      button: model.buttonLabel,
    };

    for (const [selector, value] of Object.entries(bindings)) {
      const element = this.querySelector(selector);

      if (element) {
        element.textContent = value;
      }
    }
  }
}
