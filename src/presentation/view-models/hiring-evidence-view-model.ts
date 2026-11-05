import type { StudyRepository } from '@/application/ports/study-repository';
import type { Locale } from '@/domain/locale';
import { createStudyViewModel } from './study-view-model';
import { getEnhancementCopy } from '@/i18n/enhancements';

export async function createHiringEvidenceViewModel(
  repository: StudyRepository,
  locale: Locale,
) {
  const studies = (await repository.findAll()).filter(
    (study) => study.locale === locale,
  );
  const copy = getEnhancementCopy(locale);
  const studyLink = (id: string) => {
    const study = studies.find((candidate) => candidate.id === id);
    if (!study) {
      throw new Error(`Missing ${locale} hiring evidence: ${id}`);
    }
    const view = createStudyViewModel(study);
    return { label: view.title, href: view.href };
  };
  return [
    {
      title: copy.backendEvidence,
      links: [studyLink('saas-modernization'), studyLink('api-gateway')],
    },
    { title: copy.fullstackEvidence, links: [studyLink('experimentation')] },
    {
      title: copy.leadershipEvidence,
      links: [studyLink('engineering-delivery')],
    },
  ];
}
