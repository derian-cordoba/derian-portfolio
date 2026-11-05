import type { Study } from '@/domain/study';
import { createStudyViewModel } from './study-view-model';
import { getFeatureCopy } from '@/i18n/features';

export interface DocumentHeading {
  readonly depth: number;
  readonly text: string;
  readonly slug: string;
}

export function createHeadingHashMap(
  source: readonly DocumentHeading[],
  target: readonly DocumentHeading[],
): Readonly<Record<string, string>> {
  if (
    source.length !== target.length ||
    source.some((heading, index) => heading.depth !== target[index]?.depth)
  ) {
    throw new Error(
      'Translated study headings must have matching section structure.',
    );
  }
  return Object.fromEntries(
    source.map((heading, index) => [
      heading.slug,
      target[index]?.slug ?? heading.slug,
    ]),
  );
}

export function createStudyNavigationViewModel(
  study: Study,
  studies: readonly Study[],
  headings: readonly DocumentHeading[],
) {
  const contents = headings
    .filter((heading) => heading.depth === 2)
    .map((heading) => ({ label: heading.text, href: `#${heading.slug}` }));
  if (study.visual === 'gateway') {
    contents.push({
      label: getFeatureCopy(study.locale).walkthrough,
      href: '#walkthrough',
    });
    contents.push({
      label: study.locale === 'es' ? 'Ejecución registrada' : 'Recorded run',
      href: '#recorded-run',
    });
  }
  const ordered = studies
    .filter(
      (candidate) =>
        candidate.locale === study.locale && candidate.kind === study.kind,
    )
    .sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((candidate) => candidate.id === study.id);
  const candidate =
    index >= 0 && ordered.length > 1
      ? ordered[(index + 1) % ordered.length]
      : undefined;
  return {
    contents,
    next: candidate ? createStudyViewModel(candidate) : undefined,
  };
}
