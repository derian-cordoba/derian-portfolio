export type GatewayScenarioId = 'authentication' | 'timeout' | 'circuit';

export interface GatewayScenario {
  readonly id: GatewayScenarioId;
  readonly status: 401 | 504 | 503;
  readonly configuration: unknown;
  readonly examplePath: string;
  readonly testPath: string;
}
