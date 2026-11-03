import { afterEach, describe, expect, it, vi } from 'vitest';
import { isTheme, resolveTheme } from '@/domain/theme';
import { createThemeViewModel } from '@/presentation/view-models/theme-view-model';
import {
  clearThemePreference,
  readThemePreference,
  saveThemePreference,
  THEME_STORAGE_KEY,
} from '@/infrastructure/theme-preference';

afterEach(() => {
  clearThemePreference();
  vi.unstubAllGlobals();
});

describe('theme preferences', () => {
  it('removes the explicit preference when returning to the system setting', () => {
    const removeItem = vi.fn();
    const dispatchEvent = vi.fn();
    vi.stubGlobal('window', {
      localStorage: { removeItem, getItem: () => null },
      dispatchEvent,
    });
    clearThemePreference();
    expect(removeItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
    expect(readThemePreference()).toBeUndefined();
    expect(dispatchEvent).toHaveBeenCalled();
  });

  it.each([
    ['light', true, 'light'],
    ['dark', false, 'dark'],
    [null, true, 'dark'],
    [undefined, false, 'light'],
    ['invalid', true, 'dark'],
    ['system', false, 'light'],
  ])(
    'resolves %s with system dark=%s to %s',
    (preference, systemDark, theme) => {
      expect(resolveTheme(preference, Boolean(systemDark))).toBe(theme);
    },
  );

  it('accepts only supported themes from persistent storage', () => {
    expect(isTheme('DARK')).toBe(false);
    const getItem = vi.fn(() => 'unknown');
    const setItem = vi.fn();
    vi.stubGlobal('window', {
      localStorage: { getItem, setItem, removeItem: vi.fn() },
      dispatchEvent: vi.fn(),
    });
    expect(readThemePreference()).toBeUndefined();
    saveThemePreference('dark');
    expect(setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
    getItem.mockReturnValue('light');
    expect(readThemePreference()).toBe('light');
  });

  it('continues working when accessing storage itself throws', () => {
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      get localStorage() {
        throw new Error('Storage unavailable');
      },
    });
    expect(readThemePreference()).toBeUndefined();
    expect(() => saveThemePreference('dark')).not.toThrow();
    expect(readThemePreference()).toBe('dark');
    clearThemePreference();
    expect(readThemePreference()).toBeUndefined();
  });

  it('provides localized actions and a stable toggle state', () => {
    expect(createThemeViewModel('dark', 'es')).toMatchObject({
      nextTheme: 'light',
      pressed: true,
      actionLabel: 'Cambiar al tema claro',
    });
    expect(createThemeViewModel('light', 'en')).toMatchObject({
      nextTheme: 'dark',
      pressed: false,
      actionLabel: 'Switch to dark theme',
    });
  });
});
