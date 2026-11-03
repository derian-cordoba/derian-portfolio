import type { Locale } from '@/domain/locale';
import { gatewayTranslations } from '@/i18n/gateway';

export type GatewayMode = 'healthy' | 'unavailable';

/** Illustrative UI state only; this never probes or controls a real gateway. */
export function createGatewayViewModel(
  mode: GatewayMode,
  locale: Locale = 'en',
) {
  const t = gatewayTranslations[locale];
  if (mode === 'unavailable') {
    return {
      mode,
      status: '503',
      statusLabel: t.unavailable,
      circuit: t.open,
      message: t.unavailableMessage,
      buttonLabel: t.restoreUpstream,
      nextMode: 'healthy' as const,
    };
  }

  return {
    mode,
    status: '200',
    statusLabel: t.ok,
    circuit: t.closed,
    message: t.healthyMessage,
    buttonLabel: t.simulateFailure,
    nextMode: 'unavailable' as const,
  };
}
