import type { Locale } from './locale';

export interface Note {
  readonly id: string;
  readonly contentId: string;
  readonly locale: Locale;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly order: number;
  readonly tags: readonly string[];
  readonly body: string;
}
