import type { Locale } from '@/domain/locale';

type GatewayTranslations = { readonly [Key in keyof typeof en]: string };

const en = {
  unavailable: 'Service unavailable',
  open: 'Open',
  unavailableMessage:
    'The open circuit rejects requests while the upstream recovers.',
  restoreUpstream: 'Restore upstream',
  ok: 'OK',
  closed: 'Closed',
  healthyMessage:
    'The closed circuit forwards requests to the healthy upstream.',
  simulateFailure: 'Simulate upstream failure',
} as const;

const es = {
  unavailable: 'Servicio no disponible',
  open: 'Abierto',
  unavailableMessage:
    'El circuito abierto rechaza solicitudes mientras se recupera el servicio de destino.',
  restoreUpstream: 'Restablecer servicio de destino',
  ok: 'Correcto',
  closed: 'Cerrado',
  healthyMessage:
    'El circuito cerrado reenvía solicitudes al servicio de destino disponible.',
  simulateFailure: 'Simular fallo del servicio de destino',
} as const satisfies GatewayTranslations;

/** Shared with server dictionaries, while the browser only imports demo messages. */
export const gatewayTranslations: Record<Locale, GatewayTranslations> = {
  en,
  es,
};
