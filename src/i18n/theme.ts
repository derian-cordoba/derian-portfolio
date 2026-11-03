import type { Locale } from '@/domain/locale';

interface ThemeTranslations {
  readonly darkTheme: string;
  readonly useLightTheme: string;
  readonly useDarkTheme: string;
}

export const themeTranslations: Record<Locale, ThemeTranslations> = {
  en: {
    darkTheme: 'Dark theme',
    useLightTheme: 'Switch to light theme',
    useDarkTheme: 'Switch to dark theme',
  },
  es: {
    darkTheme: 'Tema oscuro',
    useLightTheme: 'Cambiar al tema claro',
    useDarkTheme: 'Cambiar al tema oscuro',
  },
};
