import type { Study } from '@/domain/study';
import { getTranslations } from '@/i18n';
import { localizePath } from '@/i18n/routing';

export function getStudyHref(
  study: Pick<Study, 'kind' | 'id' | 'locale'>,
): string {
  const directory = study.kind === 'experience' ? 'work' : 'projects';
  return localizePath(`/${directory}/${study.id}/`, study.locale);
}

export function createStudyViewModel(study: Study) {
  const t = getTranslations(study.locale);
  const words = study.body.trim().split(/\s+/u).filter(Boolean).length;

  return {
    ...study,
    href: getStudyHref(study),
    category:
      study.kind === 'experience' ? t.professionalCategory : t.projectCategory,
    readingTime: `${Math.max(1, Math.ceil(words / 200))} ${t.readingTime}`,
    action: study.kind === 'experience' ? t.readCaseStudy : t.exploreTheProject,
    evidenceNote:
      study.kind === 'experience' ? t.professionalEvidence : t.projectEvidence,
  };
}

export type StudyViewModel = ReturnType<typeof createStudyViewModel>;
