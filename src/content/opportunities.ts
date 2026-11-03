import type { Locale } from '@/domain/locale';

/** Editorial configuration. No availability is announced unless explicitly set. */
export function getAvailability(locale: Locale): string | undefined {
  if (import.meta.env['PORTFOLIO_AVAILABILITY'] === 'open') {
    return locale === 'es'
      ? 'Abierto a conversar sobre nuevas oportunidades.'
      : 'Open to conversations about new opportunities.';
  }

  return undefined;
}
