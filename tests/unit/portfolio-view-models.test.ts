import { describe, expect, it } from 'vitest';
import type { Study } from '@/domain/study';
import type { StudyRepository } from '@/application/ports/study-repository';
import { createHomeViewModel } from '@/presentation/view-models/home-view-model';
import { createStudyViewModel } from '@/presentation/view-models/study-view-model';
import { createGatewayViewModel } from '@/presentation/view-models/gateway-view-model';
import {
  createStudyNavigationViewModel,
  createHeadingHashMap,
} from '@/presentation/view-models/study-navigation-view-model';

function makeStudy(overrides: Partial<Study> = {}): Study {
  return {
    id: 'gateway',
    contentId: 'en/gateway',
    locale: 'en',
    kind: 'project',
    order: 1,
    title: 'Gateway',
    description: 'An API gateway.',
    organization: 'Open source',
    role: 'Author',
    period: 'Independent project',
    tags: ['TypeScript'],
    result: 'Routing',
    resultLabel: 'Configuration-driven',
    visual: 'gateway',
    body: '',
    ...overrides,
  };
}

describe('portfolio presentation contracts', () => {
  it('maps corresponding translated sections and rejects incompatible heading structures', () => {
    const english = [{ depth: 2, text: 'Problem', slug: 'the-problem' }];
    const spanish = [{ depth: 2, text: 'Problema', slug: 'el-problema' }];
    expect(createHeadingHashMap(english, spanish)).toEqual({
      'the-problem': 'el-problema',
    });
    expect(() => createHeadingHashMap(english, [])).toThrow(
      'matching section structure',
    );
  });
  it('builds section links and selects the next study without crossing language or study kind', () => {
    const current = makeStudy({ id: 'first', order: 1, locale: 'es' });
    const studies = Object.freeze([
      current,
      makeStudy({ id: 'wrong-language', locale: 'en', order: 2 }),
      makeStudy({
        id: 'wrong-kind',
        locale: 'es',
        kind: 'experience',
        order: 2,
      }),
      makeStudy({ id: 'second', locale: 'es', order: 3 }),
    ]);
    const model = createStudyNavigationViewModel(current, studies, [
      { depth: 2, text: 'El problema', slug: 'el-problema' },
      { depth: 3, text: 'Detail', slug: 'detail' },
    ]);
    expect(model.contents).toContainEqual({
      label: 'El problema',
      href: '#el-problema',
    });
    expect(model.contents.some((item) => item.href === '#detail')).toBe(false);
    expect(model.next?.href).toBe('/es/projects/second/');
    expect(studies[0]?.id).toBe('first');
  });

  it('keeps professional work separate from public projects and orders each without mutating the source', async () => {
    const studies = Object.freeze([
      makeStudy({ id: 'second-project', order: 5 }),
      makeStudy({ id: 'professional-work', kind: 'experience', order: 2 }),
      makeStudy({ id: 'first-project', order: 3 }),
    ]);
    const repository: StudyRepository = { findAll: async () => studies };
    const model = await createHomeViewModel(repository);

    expect(model.professionalWork.map((study) => study.href)).toEqual([
      '/work/professional-work/',
    ]);
    expect(model.projects.map((study) => study.href)).toEqual([
      '/projects/first-project/',
      '/projects/second-project/',
    ]);
    expect(studies[0]?.id).toBe('second-project');
  });

  it('handles an empty repository without introducing placeholder projects', async () => {
    const model = await createHomeViewModel({ findAll: async () => [] });
    expect(model.professionalWork).toEqual([]);
    expect(model.projects).toEqual([]);
  });

  it('preserves the scope of professional evidence and computes a bounded reading time', () => {
    const model = createStudyViewModel(
      makeStudy({ kind: 'experience', body: 'word '.repeat(401) }),
    );
    expect(model.readingTime).toBe('3 min read');
    expect(model.evidenceNote).toContain('documented in my CV');
    expect(createStudyViewModel(makeStudy()).readingTime).toBe('1 min read');
  });

  it('models recovery without carrying an unavailable response into the healthy state', () => {
    const failure = createGatewayViewModel('unavailable');
    const restored = createGatewayViewModel(failure.nextMode);
    expect(failure.status).toBe('503');
    expect(failure.circuit).toBe('Open');
    expect(restored.status).toBe('200');
    expect(restored.circuit).toBe('Closed');
    expect(restored.nextMode).toBe('unavailable');
  });
});
