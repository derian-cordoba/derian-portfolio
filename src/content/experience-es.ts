import type { Experience } from '@/domain/profile';
import type { experiences } from './profile';

type Company = (typeof experiences)[number]['company'];
type ExperienceTranslation = Pick<
  Experience,
  'role' | 'period' | 'description' | 'technologies'
>;

export const experienceEs = {
  Walmart: {
    role: 'Ingeniero full-stack sénior',
    period: 'Jul 2026 — Actualidad',
    description:
      'Desarrollo y modernización de aplicaciones empresariales, servicios compartidos y herramientas de ingeniería reutilizables.',
    technologies: ['Next.js', 'NestJS', 'TypeScript'],
  },
  Netforemost: {
    role: 'Consultor sénior de desarrollo de software',
    period: 'Jun — Jul 2026 · Consultoría a tiempo parcial',
    description:
      'Modernización de sistemas PHP/Laravel, ampliación de pruebas de regresión y automatización de los flujos de entrega.',
    technologies: ['Laravel', 'Pruebas', 'CI/CD'],
  },
  'Go Local Interactive': {
    role: 'Ingeniero de software sénior II',
    period: 'Ago 2025 — Jun 2026',
    description:
      'Mejora de flujos críticos de procesamiento SaaS y creación de mecanismos de multitenencia reutilizables entre servicios Laravel.',
    technologies: ['Laravel', 'React', 'Multitenencia'],
  },
  'All-Win Software': {
    role: 'Líder de ingeniería de software',
    period: 'Ago 2022 — Ago 2025',
    description:
      'Liderazgo de iniciativas de ingeniería web, backend y móvil, estableciendo prácticas de pruebas y publicación automatizada.',
    technologies: ['Diseño de sistemas', 'CI/CD', 'Liderazgo técnico'],
  },
  'Quality Service Nicaragua': {
    role: 'Ingeniero de software III',
    period: 'Feb — Ago 2022',
    description:
      'Diseño de servicios backend y estructuras de bases de datos para una plataforma utilizada por más de 25 empresas agrícolas.',
    technologies: ['PHP', 'TypeScript', 'DDD'],
  },
  TiHouse: {
    role: 'Desarrollador backend',
    period: 'Feb 2020 — Feb 2022',
    description:
      'Desarrollo de API, autenticación y modelos de datos relacionales y NoSQL para equipos de producto multidisciplinarios.',
    technologies: ['Node.js', 'Laravel', 'Bases de datos'],
  },
  'Disanic S.A.': {
    role: 'Desarrollador backend júnior',
    period: 'Ene 2019 — Feb 2020',
    description:
      'Desarrollo de API REST y componentes backend reutilizables para plataformas web y móviles.',
    technologies: ['TypeScript', 'PHP', 'API REST'],
  },
} as const satisfies Record<Company, ExperienceTranslation>;
