import type { Experience, Profile } from '@/domain/profile';
import type { Locale } from '@/domain/locale';
import career from './career.json';
import { formatCareerPeriod } from './career-period';

export const profile = {
  name: 'Derian Córdoba',
  title: 'Senior Software Engineer',
  email: 'derian.cordoba@icloud.com',
  location: 'León, Nicaragua',
  timezone: 'UTC−6',
  github: 'https://github.com/derian-cordoba',
  linkedin: 'https://www.linkedin.com/in/derian-cordoba/',
  resume: '/Derian-Cordoba-CV-2026.pdf',
} as const satisfies Profile;

export function getExperiences(locale: Locale): readonly Experience[] {
  return career.map(({ company, start, end, partTime, ...translations }) => ({
    company,
    start,
    ...(end && { end }),
    ...translations[locale],
    period: formatCareerPeriod(start, end, locale, partTime),
  }));
}

export const experiences = getExperiences('en');
