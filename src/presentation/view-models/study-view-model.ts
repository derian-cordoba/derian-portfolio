import type { Study } from '@/domain/study';

export function getStudyHref(study: Pick<Study, 'kind' | 'id'>): string {
  const directory = study.kind === 'experience' ? 'work' : 'projects';
  return `/${directory}/${study.id}/`;
}

export function createStudyViewModel(study: Study) {
  const words = study.body.trim().split(/\s+/u).filter(Boolean).length;

  return {
    ...study,
    href: getStudyHref(study),
    category:
      study.kind === 'experience'
        ? 'Professional experience'
        : 'Open-source project',
    readingTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
    action:
      study.kind === 'experience'
        ? 'Read the case study'
        : 'Explore the project',
    evidenceNote:
      study.kind === 'experience'
        ? 'Based on professional experience documented in my CV. Internal implementation details are omitted.'
        : 'Project capabilities are documented in the linked public repositories. Production adoption is not implied.',
  };
}

export type StudyViewModel = ReturnType<typeof createStudyViewModel>;
