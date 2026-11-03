export type StudyKind = 'experience' | 'project';
export type StudyVisual =
  'performance' | 'platform' | 'gateway' | 'experimentation' | 'secure-keys';

export interface Study {
  readonly id: string;
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
  readonly body: string;
}
