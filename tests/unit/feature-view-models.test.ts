import { describe, expect, it } from 'vitest';
import type { Note } from '@/domain/note';
import {
  createNotesViewModel,
  createNoteViewModel,
  createRelatedNotesViewModel,
} from '@/presentation/view-models/note-view-model';
import { createWalkthroughViewModel } from '@/presentation/view-models/walkthrough-view-model';
import { createEngagementContext } from '@/domain/engagement';

function note(id: string, order: number, locale: 'en' | 'es'): Note {
  return {
    id,
    order,
    locale,
    contentId: `${locale}/${id}`,
    title: id,
    description: id,
    publishedAt: '2026-11-03',
    tags: ['Design'],
    body: 'word '.repeat(201),
  };
}

describe('engineering notes', () => {
  it('formats editorial dates consistently and only shows a distinct update date', () => {
    expect(createNoteViewModel(note('first', 1, 'en')).publishedLabel).toBe(
      'November 3, 2026',
    );
    const spanish = createNoteViewModel({
      ...note('first', 1, 'es'),
      updatedAt: '2026-11-04',
    });
    expect(spanish.publishedLabel).toBe('3 de noviembre de 2026');
    expect(spanish.updatedLabel).toBe('4 de noviembre de 2026');
    expect(
      createNoteViewModel({
        ...note('first', 1, 'en'),
        updatedAt: '2026-11-03',
      }).updatedLabel,
    ).toBeUndefined();
  });

  it('resolves related notes in the study locale and rejects a missing translation', async () => {
    const repository = {
      findAll: async () => [note('first', 1, 'en'), note('first', 1, 'es')],
    };
    const related = await createRelatedNotesViewModel(repository, {
      locale: 'es',
      relatedNotes: ['first'],
    });
    expect(related.map((entry) => entry.href)).toEqual(['/es/notes/first/']);
    await expect(
      createRelatedNotesViewModel(repository, {
        locale: 'es',
        relatedNotes: ['missing'],
      }),
    ).rejects.toThrow('Missing es translation');
  });

  it('filters translated content, keeps stable routes, and leaves repository ordering intact', async () => {
    const notes = Object.freeze([
      note('second', 2, 'es'),
      note('first', 1, 'en'),
      note('first', 1, 'es'),
    ]);
    const model = await createNotesViewModel(
      { findAll: async () => notes },
      'es',
    );
    expect(model.map((entry) => entry.href)).toEqual([
      '/es/notes/first/',
      '/es/notes/second/',
    ]);
    expect(model[0]?.readingTime).toBe(2);
    expect(notes[0]?.id).toBe('second');
  });
});

describe('gateway evidence', () => {
  it('keeps distinct failure statuses, real configuration, and pinned source references', () => {
    const scenarios = createWalkthroughViewModel('en');
    expect(scenarios.map((scenario) => scenario.status)).toEqual([
      401, 504, 503,
    ]);
    expect(JSON.parse(scenarios[1]?.configuration ?? '')[0].proxy.timeout).toBe(
      100,
    );
    expect(
      JSON.parse(scenarios[2]?.configuration ?? '')[0].circuitBreaker.threshold,
    ).toBe(3);
    for (const scenario of scenarios) {
      expect(scenario.sourceHref).toMatch(/\/blob\/[a-f0-9]{40}\/examples\//u);
      expect(scenario.testsHref).toMatch(/\/tests\/integration\//u);
    }
  });

  it('localizes the explanation without translating configuration keys', () => {
    const scenario = createWalkthroughViewModel('es')[0];
    expect(scenario?.title).toBe('Fallo de autenticación');
    expect(scenario?.configuration).toContain('"x-api-key"');
    expect(scenario?.steps.join(' ')).toContain('No se llama al servicio');
  });
});

describe('engagement data boundary', () => {
  it('allows only locale and known scenario metadata', () => {
    expect(
      createEngagementContext(
        '/es/projects/api-gateway/?email=private',
        'timeout',
      ),
    ).toEqual({ locale: 'es', scenario: 'timeout' });
    expect(createEngagementContext('/notes/', 'private@example.com')).toEqual({
      locale: 'en',
    });
  });
});
