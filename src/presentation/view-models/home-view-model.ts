import type { StudyRepository } from '@/application/ports/study-repository';
import { createStudyViewModel } from './study-view-model';

export async function createHomeViewModel(repository: StudyRepository) {
  const studies = await repository.findAll();
  const ordered = [...studies].sort((left, right) => left.order - right.order);
  const views = ordered.map(createStudyViewModel);

  return {
    professionalWork: views.filter((study) => study.kind === 'experience'),
    projects: views.filter((study) => study.kind === 'project'),
    totalProjects: views.filter((study) => study.kind === 'project').length,
  };
}
