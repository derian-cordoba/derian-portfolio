import type { Note } from '@/domain/note';
import type { Locale } from '@/domain/locale';
import type { NoteRepository } from '@/application/ports/note-repository';
import { localizePath } from '@/i18n/routing';
import type { Study } from '@/domain/study';

function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-NI' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

export function createNoteViewModel(note: Note) {
  return {
    ...note,
    href: localizePath(`/notes/${note.id}/`, note.locale),
    publishedLabel: formatDate(note.publishedAt, note.locale),
    updatedLabel:
      note.updatedAt && note.updatedAt !== note.publishedAt
        ? formatDate(note.updatedAt, note.locale)
        : undefined,
    readingTime: Math.max(
      1,
      Math.ceil(note.body.trim().split(/\s+/u).length / 200),
    ),
  };
}

export async function createNotesViewModel(
  repository: NoteRepository,
  locale: Locale,
) {
  return (await repository.findAll())
    .filter((note) => note.locale === locale)
    .sort((a, b) => a.order - b.order)
    .map(createNoteViewModel);
}

export type NoteViewModel = ReturnType<typeof createNoteViewModel>;

export async function createRelatedNotesViewModel(
  repository: NoteRepository,
  study: Pick<Study, 'locale' | 'relatedNotes'>,
): Promise<readonly NoteViewModel[]> {
  if (!study.relatedNotes?.length) {
    return [];
  }

  const notes = await createNotesViewModel(repository, study.locale);

  return study.relatedNotes.map((id) => {
    const note = notes.find((candidate) => candidate.id === id);
    if (!note) {
      throw new Error(
        `Missing ${study.locale} translation for related note: ${id}`,
      );
    }

    return note;
  });
}
