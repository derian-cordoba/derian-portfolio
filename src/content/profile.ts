import type { Experience, Profile } from '@/domain/profile';
import type { Locale } from '@/domain/locale';
import { experienceEs } from './experience-es';

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

export const experiences = [
  {
    company: 'Walmart',
    role: 'Senior Full-Stack Engineer',
    period: 'Jul 2026 — Present',
    start: '2026-07',
    description:
      'Building and modernizing enterprise applications, shared services, and reusable engineering tools.',
    technologies: ['Next.js', 'NestJS', 'TypeScript'],
  },
  {
    company: 'Netforemost',
    role: 'Senior Software Developer Consultant',
    period: 'Jun — Jul 2026 · Part-time consulting',
    start: '2026-06',
    end: '2026-07',
    description:
      'Modernized PHP/Laravel systems, expanded regression coverage, and automated delivery workflows.',
    technologies: ['Laravel', 'Testing', 'CI/CD'],
  },
  {
    company: 'Go Local Interactive',
    role: 'Senior Software Engineer II',
    period: 'Aug 2025 — Jun 2026',
    start: '2025-08',
    end: '2026-06',
    description:
      'Improved critical SaaS processing flows and built reusable tenancy mechanisms across Laravel services.',
    technologies: ['Laravel', 'React', 'Multi-tenancy'],
  },
  {
    company: 'All-Win Software',
    role: 'Lead Software Engineer',
    period: 'Aug 2022 — Aug 2025',
    start: '2022-08',
    end: '2025-08',
    description:
      'Led engineering initiatives across web, backend, and mobile, establishing testing and automated release practices.',
    technologies: ['System design', 'CI/CD', 'Technical leadership'],
  },
  {
    company: 'Quality Service Nicaragua',
    role: 'Software Engineer III',
    period: 'Feb — Aug 2022',
    start: '2022-02',
    end: '2022-08',
    description:
      'Designed backend services and database structures for a platform used by 25+ agricultural companies.',
    technologies: ['PHP', 'TypeScript', 'DDD'],
  },
  {
    company: 'TiHouse',
    role: 'Backend Developer',
    period: 'Feb 2020 — Feb 2022',
    start: '2020-02',
    end: '2022-02',
    description:
      'Built APIs, authentication, and relational and NoSQL data models for cross-functional product teams.',
    technologies: ['Node.js', 'Laravel', 'Databases'],
  },
  {
    company: 'Disanic S.A.',
    role: 'Junior Backend Developer',
    period: 'Jan 2019 — Feb 2020',
    start: '2019-01',
    end: '2020-02',
    description:
      'Developed REST APIs and reusable backend components for web and mobile platforms.',
    technologies: ['TypeScript', 'PHP', 'REST APIs'],
  },
] as const satisfies readonly Experience[];

export function getExperiences(locale: Locale): readonly Experience[] {
  if (locale === 'es') {
    return experiences.map((experience) => ({
      ...experience,
      ...experienceEs[experience.company],
    }));
  }

  return experiences;
}
