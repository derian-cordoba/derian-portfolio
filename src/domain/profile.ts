export interface Profile {
  readonly name: string;
  readonly title: string;
  readonly email: string;
  readonly location: string;
  readonly timezone: string;
  readonly github: string;
  readonly linkedin: string;
  readonly resume: string;
}

export interface Experience {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly start: string;
  readonly end?: string;
  readonly description: string;
  readonly technologies: readonly string[];
}
