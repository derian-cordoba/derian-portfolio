export const engagementEvents = [
  'CV downloaded',
  'Contact opened',
  'Email copied',
  'Inquiry submitted',
  'Walkthrough explored',
  'Project source opened',
] as const;
export type EngagementEvent = (typeof engagementEvents)[number];

export interface EngagementContext {
  readonly locale: 'en' | 'es';
  readonly scenario?: 'authentication' | 'timeout' | 'circuit';
}

/** Only known event metadata leaves the page; never form fields or link URLs. */
export function createEngagementContext(
  path: string,
  scenario?: string,
): EngagementContext {
  const locale = /^\/es(?:\/|$)/u.test(path) ? 'es' : 'en';
  if (
    scenario === 'authentication' ||
    scenario === 'timeout' ||
    scenario === 'circuit'
  ) {
    return { locale, scenario };
  }
  return { locale };
}
