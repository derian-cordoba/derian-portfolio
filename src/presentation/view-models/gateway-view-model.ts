export type GatewayMode = 'healthy' | 'unavailable';

/** Illustrative UI state only; this never probes or controls a real gateway. */
export function createGatewayViewModel(mode: GatewayMode) {
  if (mode === 'unavailable') {
    return {
      mode,
      status: '503',
      statusLabel: 'Service unavailable',
      circuit: 'Open',
      message: 'The open circuit rejects requests while the upstream recovers.',
      buttonLabel: 'Restore upstream',
      nextMode: 'healthy' as const,
    };
  }

  return {
    mode,
    status: '200',
    statusLabel: 'OK',
    circuit: 'Closed',
    message: 'The closed circuit forwards requests to the healthy upstream.',
    buttonLabel: 'Simulate upstream failure',
    nextMode: 'unavailable' as const,
  };
}
