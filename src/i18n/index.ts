import type { Locale } from '@/domain/locale';
import { en, type Translations } from './en';
import { es } from './es';

const translations: Record<Locale, Translations> = { en, es };

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}
