import { isLocale, type Locale } from '@/domain/locale';
import { resolveTheme, type Theme } from '@/domain/theme';
import {
  readThemePreference,
  saveThemePreference,
  THEME_STORAGE_KEY,
} from '@/infrastructure/theme-preference';
import { createThemeViewModel } from '../view-models/theme-view-model';

/** Browser events and DOM bindings; theme decisions remain in pure models. */
export class ThemeToggleElement extends HTMLElement {
  private preference: Theme | undefined;
  private system: MediaQueryList | undefined;
  private listeners: AbortController | undefined;
  private locale: Locale = 'en';

  connectedCallback(): void {
    this.listeners?.abort();
    this.listeners = new AbortController();
    const options = { signal: this.listeners.signal };
    const locale = document.documentElement.lang;
    this.locale = isLocale(locale) ? locale : 'en';
    this.preference = readThemePreference();
    this.system = window.matchMedia('(prefers-color-scheme: dark)');
    const button = this.querySelector('button');

    if (!button) {
      return;
    }

    this.render();
    button.hidden = false;
    button.addEventListener(
      'click',
      () => {
        const current = resolveTheme(
          this.preference,
          this.system?.matches ?? false,
        );
        this.preference = createThemeViewModel(current, this.locale).nextTheme;
        saveThemePreference(this.preference);
        this.render();
      },
      options,
    );
    this.system.addEventListener('change', () => this.render(), options);
    window.addEventListener(
      'storage',
      (event) => {
        if (event.key === THEME_STORAGE_KEY || event.key === null) {
          this.preference = readThemePreference();
          this.render();
        }
      },
      options,
    );
  }

  disconnectedCallback(): void {
    this.listeners?.abort();
  }

  private render(): void {
    const theme = resolveTheme(this.preference, this.system?.matches ?? false);
    const model = createThemeViewModel(theme, this.locale);
    const root = document.documentElement;
    root.dataset['theme'] = model.theme;
    const button = this.querySelector('button');
    button?.setAttribute('aria-pressed', String(model.pressed));
    button?.setAttribute('title', model.actionLabel);

    for (const meta of document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )) {
      meta.content = window.getComputedStyle(root).backgroundColor;
    }
  }
}
