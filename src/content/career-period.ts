import type { Locale } from '../domain/locale';

export function formatCareerPeriod(
  start: string,
  end: string | undefined,
  locale: Locale,
  partTime = false,
): string {
  function date(value: string): string {
    const month = new Intl.DateTimeFormat(locale === 'es' ? 'es-NI' : 'en-US', {
      month: 'short',
      timeZone: 'UTC',
    })
      .format(new Date(`${value}-01T12:00:00Z`))
      .replace(/\.$/u, '');
    return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${value.slice(0, 4)}`;
  }
  const period = `${date(start)} — ${end ? date(end) : locale === 'es' ? 'Actualidad' : 'Present'}`;
  return partTime
    ? `${period} · ${locale === 'es' ? 'Consultoría a tiempo parcial' : 'Part-time consulting'}`
    : period;
}
