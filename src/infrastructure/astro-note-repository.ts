import { getCollection } from 'astro:content';
import type { NoteRepository } from '@/application/ports/note-repository';
import type { Note } from '@/domain/note';

export class AstroNoteRepository implements NoteRepository {
  async findAll(): Promise<readonly Note[]> {
    const entries = await getCollection('notes');
    return entries.map(({ id, data, body }) => {
      const { noteId, ...fields } = data;
      return { ...fields, id: noteId, contentId: id, body: body ?? '' };
    });
  }
}
