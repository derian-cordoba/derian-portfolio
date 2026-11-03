import type { GatewayScenario } from '@/domain/walkthrough';

/** Published examples pinned so evidence and displayed configuration stay in sync. */
export const gatewayRevision = 'c715170e32c03013af6e4605b9aec205f4aa5dbe';
export const gatewaySource = `https://github.com/derian-cordoba/api-gateway/blob/${gatewayRevision}`;

export const gatewayScenarios = [
  {
    id: 'authentication',
    status: 401,
    examplePath: 'examples/api-key-auth/routes.json',
    testPath: 'tests/integration/auth.test.ts',
    configuration: [
      {
        baseURL: '/reports',
        proxy: {
          target: 'http://localhost:4005',
          changeOrigin: true,
          pathRewrite: { '^/reports': '' },
        },
        auth: {
          enabled: true,
          strategy: 'apiKey',
          header: 'x-api-key',
          keys: ['key-service-alpha-123', 'key-service-beta-456'],
        },
      },
    ],
  },
  {
    id: 'timeout',
    status: 504,
    examplePath: 'examples/timeout/routes.json',
    testPath: 'tests/integration/timeout.test.ts',
    configuration: [
      {
        baseURL: '/slow',
        proxy: {
          target: 'http://localhost:4073',
          pathRewrite: { '^/slow': '' },
          timeout: 100,
        },
      },
    ],
  },
  {
    id: 'circuit',
    status: 503,
    examplePath: 'examples/circuit-breaker/routes.json',
    testPath: 'tests/integration/circuit-breaker.test.ts',
    configuration: [
      {
        baseURL: '/payments',
        proxy: {
          target: 'http://localhost:4006',
          changeOrigin: true,
          pathRewrite: { '^/payments': '' },
        },
        circuitBreaker: { threshold: 3, timeout: 10000, successThreshold: 1 },
      },
    ],
  },
] as const satisfies readonly GatewayScenario[];
