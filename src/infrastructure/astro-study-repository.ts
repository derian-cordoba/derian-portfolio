import { getCollection } from 'astro:content';
import type { StudyRepository } from '@/application/ports/study-repository';
import type { Study } from '@/domain/study';

export class AstroStudyRepository implements StudyRepository {
  async findAll(): Promise<readonly Study[]> {
    const entries = await getCollection('studies');

    return entries.map(({ id, data, body }) => {
      const { repository, ...fields } = data;

      return {
        ...fields,
        id,
        body: body ?? '',
        ...(repository ? { repository } : {}),
      };
    });
  }
}
