import type { Study } from '@/domain/study';

/** Build-time content boundary. Views never depend on a CMS or Astro collection. */
export interface StudyRepository {
  findAll(): Promise<readonly Study[]>;
}
