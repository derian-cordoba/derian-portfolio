import type { Note } from '@/domain/note';

export interface NoteRepository {
  findAll(): Promise<readonly Note[]>;
}
