import { isTheme, type Theme } from '@/domain/theme';

export const THEME_STORAGE_KEY = 'portfolio-theme';
let transientPreference: Theme | undefined;

export function readThemePreference(): Theme | undefined {
  try {
    const preference = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(preference) ? preference : undefined;
  } catch {
    // Client-side navigation can retain a choice even when storage is disabled.
    return transientPreference;
  }
}

export function saveThemePreference(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    transientPreference = theme;
  }
}
