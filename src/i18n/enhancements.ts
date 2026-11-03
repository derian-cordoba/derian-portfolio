import type { Locale } from '@/domain/locale';

const en = {
  hiringShortcut: 'For hiring teams',
  overview: 'At a glance',
  contents: 'On this page',
  continueExploring: 'Continue exploring',
  sending: 'Sending…',
  retry: 'Try again',
  submissionError:
    'We couldn’t confirm your submission. Your message is still here. Please try again or email me directly.',
  backendEvidence: 'Backend systems',
  fullstackEvidence: 'Full-stack delivery',
  leadershipEvidence: 'Technical leadership',
  careerEvidence: 'Explore my career experience',
  roleEvidence: 'Find evidence for your role',
  enlarge: 'Enlarge screenshot',
  closeImage: 'Close screenshot',
} as const;
const es: { readonly [Key in keyof typeof en]: string } = {
  hiringShortcut: 'Para equipos de contratación',
  overview: 'De un vistazo',
  contents: 'En esta página',
  continueExploring: 'Sigue explorando',
  sending: 'Enviando…',
  retry: 'Intentar de nuevo',
  submissionError:
    'No pudimos confirmar el envío. Tu mensaje sigue aquí. Inténtalo de nuevo o escríbeme directamente por correo.',
  backendEvidence: 'Sistemas backend',
  fullstackEvidence: 'Desarrollo full-stack',
  leadershipEvidence: 'Liderazgo técnico',
  careerEvidence: 'Explora mi experiencia profesional',
  roleEvidence: 'Encuentra evidencia para el rol',
  enlarge: 'Ampliar captura',
  closeImage: 'Cerrar captura',
};
export function getEnhancementCopy(locale: Locale) {
  return locale === 'es' ? es : en;
}
