import type { Locale } from '@/domain/locale';
import { noteRepository } from '@/infrastructure/portfolio';
import { createNotesViewModel } from '@/presentation/view-models/note-view-model';

export async function getNotePaths(locale: Locale) {
  const notes = await createNotesViewModel(noteRepository, locale);
  return notes.map((note) => ({ params: { id: note.id }, props: { note } }));
}
