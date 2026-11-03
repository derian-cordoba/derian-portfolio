import type { Note } from '@/domain/note';
import type { Locale } from '@/domain/locale';
import type { NoteRepository } from '@/application/ports/note-repository';
import { localizePath } from '@/i18n/routing';

export function createNoteViewModel(note: Note) {
  return {
    ...note,
    href: localizePath(`/notes/${note.id}/`, note.locale),
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
