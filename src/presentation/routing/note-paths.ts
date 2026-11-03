import type { Locale } from '@/domain/locale';
import { AstroNoteRepository } from '@/infrastructure/astro-note-repository';
import { createNotesViewModel } from '@/presentation/view-models/note-view-model';

export async function getNotePaths(locale: Locale) {
  const notes = await createNotesViewModel(new AstroNoteRepository(), locale);
  return notes.map((note) => ({ params: { id: note.id }, props: { note } }));
}
