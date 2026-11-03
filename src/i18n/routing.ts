import type { Locale } from '@/domain/locale';

export type LanguageHashMaps = Partial<
  Record<Locale, Readonly<Record<string, string>>>
>;

export function localizeFragment(
  hash: string,
  headings: Readonly<Record<string, string>> = {},
): string {
  try {
    const id = decodeURIComponent(hash.replace(/^#/u, ''));
    return Object.hasOwn(headings, id) ? `#${headings[id]}` : hash;
  } catch {
    return hash;
  }
}

export function getLocale(pathname: string): Locale {
  return /^\/es(?:\/|$)/u.test(pathname) ? 'es' : 'en';
}

/** Preserve a page's stable slug, search parameters, and fragment across locales. */
export function localizePath(path: string, locale: Locale): string {
  const unprefixed = path.replace(/^\/es(?=\/|$|[?#])/u, '') || '/';
  const normalized = unprefixed.startsWith('/') ? unprefixed : `/${unprefixed}`;
  if (['/404', '/404/', '/404.html'].includes(normalized)) {
    return locale === 'es' ? '/es/404/' : '/404.html';
  }
  return locale === 'es' ? `/es${normalized}` : normalized;
}

export function getResumePath(locale: Locale): string {
  return locale === 'es'
    ? '/Derian-Cordoba-CV-2026-ES.pdf'
    : '/Derian-Cordoba-CV-2026.pdf';
}
