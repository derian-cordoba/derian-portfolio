import type { Locale } from '@/domain/locale';
import type { Theme } from '@/domain/theme';
import { themeTranslations } from '@/i18n/theme';

export function createThemeViewModel(theme: Theme, locale: Locale) {
  const t = themeTranslations[locale];

  return {
    theme,
    nextTheme: theme === 'dark' ? ('light' as const) : ('dark' as const),
    pressed: theme === 'dark',
    actionLabel: theme === 'dark' ? t.useLightTheme : t.useDarkTheme,
  };
}
