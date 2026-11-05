/* global fetch, AbortSignal, setTimeout */
/** Capture actual local HTTP responses; never connects to a public service.
 * npm run capture:gateway -- /absolute/path/to/api-gateway
 */
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { registerGatewayTypeScript } from './gateway-typescript-loader.mjs';

const checkout = process.argv[2];
if (!checkout) {
  throw new Error(
    'Provide a local api-gateway checkout with its dependencies installed.',
  );
}
const root = resolve(checkout);
const requireGateway = createRequire(join(root, 'package.json'));
const scratch = await mkdtemp(join(tmpdir(), 'portfolio-gateway-'));
let failing = false;
let hits = 0;
const upstream = createServer((_request, response) => {
  hits += 1;
  response.writeHead(failing ? 500 : 200, {
    'Content-Type': 'application/json',
  });
  response.end(
    JSON.stringify(
      failing
        ? { error: 'Local demonstration failure' }
        : { service: 'payments', healthy: true },
    ),
  );
});
let gateway;
let typescriptHooks;
try {
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  const upstreamPort = upstream.address().port;
  const routes = [
    {
      baseURL: '/payments',
      proxy: {
        target: `http://127.0.0.1:${upstreamPort}`,
        changeOrigin: true,
        pathRewrite: { '^/payments': '' },
      },
      circuitBreaker: { threshold: 3, timeout: 1000, successThreshold: 1 },
    },
  ];
  await writeFile(join(scratch, 'routes.json'), JSON.stringify(routes));
  Object.assign(process.env, {
    NODE_ENV: 'production',
    LOG_LEVEL: 'silent',
    ROUTES: '[]',
    ROUTES_FILE_PATH: join(scratch, 'routes.json'),
    ROUTE_STORAGE_DRIVER: 'local-json',
    ROUTE_SOURCE_PROFILES: '[]',
    GATEWAY_PREFIX: '',
    MANAGEMENT_ENABLED: 'false',
  });
  typescriptHooks = registerGatewayTypeScript(root);
  const { Server } = requireGateway(
    join(root, 'src/apps/api-gateway/Server.ts'),
  );
  gateway = new Server();
  await gateway.init();
  const server = gateway.getHttpServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  const steps = [];
  async function capture(id, expected) {
    const before = hits;
    const response = await fetch(`http://127.0.0.1:${port}/payments`, {
      signal: AbortSignal.timeout(5000),
    });
    const body = await response.json();
    assert.equal(response.status, expected, id);
    steps.push({
      id,
      status: response.status,
      upstreamRequests: hits - before,
      body,
    });
  }
  await capture('healthy', 200);
  failing = true;
  for (let index = 1; index <= 3; index += 1) {
    await capture(`failure-${index}`, 500);
  }
  await capture('open', 503);
  assert.equal(steps.at(-1).upstreamRequests, 0);
  failing = false;
  await new Promise((resolveWait) => setTimeout(resolveWait, 1100));
  await capture('recovery', 200);
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  const dirty = Boolean(
    execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
      cwd: root,
      encoding: 'utf8',
    }).trim(),
  );
  const result = {
    recordedAt: new Date().toISOString(),
    revision,
    dirty,
    configuration: { threshold: 3, timeout: 1000, successThreshold: 1 },
    steps,
  };
  await writeFile(
    new URL('../src/content/gateway-recording.json', import.meta.url),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  console.log(
    `Captured ${steps.length} actual HTTP responses from ${revision}${dirty ? ' (modified checkout)' : ''}.`,
  );
} finally {
  try {
    await gateway?.stop();
  } finally {
    typescriptHooks?.deregister();
    upstream.closeAllConnections();
    if (upstream.listening) {
      await new Promise((resolveClose) => upstream.close(resolveClose));
    }
    await rm(scratch, { recursive: true, force: true });
  }
}
