import { describe, expect, it } from 'vitest';
import { en } from '@/i18n/en';
import { es } from '@/i18n/es';
import { getLocale, getResumePath, localizePath } from '@/i18n/routing';
import { getExperiences } from '@/content/profile';
import { createHomeViewModel } from '@/presentation/view-models/home-view-model';
import { createGatewayViewModel } from '@/presentation/view-models/gateway-view-model';
import type { Study } from '@/domain/study';

describe('localized routing', () => {
  it.each([
    ['/', 'en'],
    ['/es/', 'es'],
    ['/es/projects/api-gateway/', 'es'],
    ['/projects/api-gateway/', 'en'],
    ['/estonia/', 'en'],
  ] as const)('detects the locale of %s', (path, locale) => {
    expect(getLocale(path)).toBe(locale);
  });

  it('switches deep links without losing their identity, query, or fragment', () => {
    const english = '/projects/api-gateway/?source=cv#main';
    expect(localizePath(english, 'es')).toBe(
      '/es/projects/api-gateway/?source=cv#main',
    );
    expect(localizePath(localizePath(english, 'es'), 'en')).toBe(english);
    expect(localizePath('/es/', 'es')).toBe('/es/');
    expect(localizePath('/es', 'en')).toBe('/');
    expect(localizePath('/es/404/', 'en')).toBe('/404.html');
    expect(localizePath('/404.html', 'es')).toBe('/es/404/');
  });

  it('uses the matching translated CV', () => {
    expect(getResumePath('en')).toBe('/Derian-Cordoba-CV-2026.pdf');
    expect(getResumePath('es')).toBe('/Derian-Cordoba-CV-2026-ES.pdf');
  });
});

describe('translation completeness', () => {
  it('has complete dictionaries with no empty translations', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
    expect(Object.values(es).every((value) => value.trim().length > 0)).toBe(
      true,
    );
  });

  it('preserves career identity while translating every role, description, and date label', () => {
    const english = getExperiences('en');
    const spanish = getExperiences('es');
    expect(spanish.map((experience) => experience.company)).toEqual(
      english.map((experience) => experience.company),
    );
    for (const [index, experience] of spanish.entries()) {
      expect(experience.start).toBe(english[index]?.start);
      expect(experience.description).not.toBe(english[index]?.description);
      expect(experience.role).not.toBe(english[index]?.role);
    }
    expect(spanish[0]?.period).toContain('Actualidad');
  });

  it('filters the content repository by locale before composing page cards', async () => {
    const base: Study = {
      id: 'gateway',
      contentId: 'en/gateway',
      locale: 'en',
      kind: 'project',
      order: 1,
      title: 'Gateway',
      description: 'Description',
      organization: 'Independent',
      role: 'Author',
      period: 'Open source',
      tags: ['TypeScript'],
      result: 'Routes',
      resultLabel: 'Requests',
      visual: 'gateway',
      body: 'Content',
    };
    const studies = [
      base,
      {
        ...base,
        locale: 'es' as const,
        contentId: 'es/gateway',
        title: 'Pasarela',
      },
    ];
    const spanish = await createHomeViewModel(
      { findAll: async () => studies },
      'es',
    );
    expect(spanish.projects).toHaveLength(1);
    expect(spanish.projects[0]).toMatchObject({
      href: '/es/projects/gateway/',
      title: 'Pasarela',
      category: 'Proyecto de código abierto',
      readingTime: '1 min de lectura',
    });
  });

  it('keeps Spanish interaction messages through failure and recovery', () => {
    const failed = createGatewayViewModel('unavailable', 'es');
    const restored = createGatewayViewModel(failed.nextMode, 'es');
    expect(failed).toMatchObject({
      status: '503',
      circuit: 'Abierto',
      buttonLabel: es.restoreUpstream,
    });
    expect(restored).toMatchObject({
      status: '200',
      circuit: 'Cerrado',
      buttonLabel: es.simulateFailure,
    });
  });
});
