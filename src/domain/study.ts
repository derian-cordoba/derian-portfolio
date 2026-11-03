import type { Locale } from './locale';

export type StudyKind = 'experience' | 'project';
export type StudyVisual =
  'performance' | 'platform' | 'gateway' | 'experimentation' | 'secure-keys';

export interface Study {
  readonly id: string;
  readonly contentId: string;
  readonly locale: Locale;
  readonly kind: StudyKind;
  readonly order: number;
  readonly title: string;
  readonly description: string;
  readonly organization: string;
  readonly role: string;
  readonly period: string;
  readonly tags: readonly string[];
  readonly result: string;
  readonly resultLabel: string;
  readonly visual: StudyVisual;
  readonly repository?: string;
  readonly media?: {
    readonly src: string;
    readonly alt: string;
    readonly caption: string;
    readonly source: string;
    readonly width: number;
    readonly height: number;
  };
  readonly body: string;
}
