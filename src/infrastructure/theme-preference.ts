import { isTheme, type Theme } from '@/domain/theme';

export const THEME_STORAGE_KEY = 'portfolio-theme';

export function readThemePreference(): Theme | undefined {
  try {
    const preference = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(preference) ? preference : undefined;
  } catch {
    // Storage may be disabled; the system preference remains usable.
    return undefined;
  }
}

export function saveThemePreference(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still works for the current page.
  }
}
