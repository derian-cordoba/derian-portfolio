import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';

it('loads checkout TypeScript with decorators and extensionless imports, preserves dependency boundaries, and deregisters', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'gateway-loader-test-'));
  const checkout = join(scratch, 'checkout');
  try {
    await Promise.all([
      mkdir(join(checkout, 'nested'), { recursive: true }),
      mkdir(join(checkout, 'node_modules', 'fixture-package'), {
        recursive: true,
      }),
      mkdir(join(scratch, 'checkout-other'), { recursive: true }),
    ]);
    await Promise.all([
      writeFile(join(checkout, 'package.json'), '{"type":"commonjs"}'),
      writeFile(
        join(checkout, 'dependency.ts'),
        'export const dependency: number = 40;',
      ),
      writeFile(
        join(checkout, 'value.schema.ts'),
        'export const valid: boolean = true;',
      ),
      writeFile(
        join(checkout, 'nested', 'index.ts'),
        'export const directory: number = 2;',
      ),
      writeFile(join(checkout, 'data.json'), '{"label":"fixture"}'),
      writeFile(join(checkout, 'after-cleanup.ts'), 'export const value = 1;'),
      writeFile(
        join(checkout, 'node_modules', 'fixture-package', 'entry.ts'),
        'export const value = 1;',
      ),
      writeFile(
        join(scratch, 'checkout-other', 'dependency.ts'),
        'export const value = 1;',
      ),
      writeFile(
        join(checkout, 'entry.ts'),
        `
        import { dependency } from './dependency';
        import { directory } from './nested';
        import { valid } from './value.schema';
        import data from './data.json';
        function property(_target: object, _key: string) {}
        class Example { @property count!: number; }
        export const result = { value: dependency + directory, valid, label: data.label, instance: new Example() };
      `,
      ),
    ]);
    const loader = pathToFileURL(
      resolve('scripts/gateway-typescript-loader.mjs'),
    ).href;
    // Exercise Node's real loader in an isolated process, outside Vitest's loader.
    const script = `
      import assert from 'node:assert/strict';
      import { createRequire } from 'node:module';
      import { registerGatewayTypeScript } from ${JSON.stringify(loader)};
      const require = createRequire(${JSON.stringify(join(checkout, 'package.json'))});
      const original = require.extensions['.ts'];
      const metadata = [];
      Reflect.metadata = (key, value) => () => {
        if (key === 'design:type') metadata.push(value.name);
      };
      const hooks = registerGatewayTypeScript(${JSON.stringify(checkout)});
      try {
        const { result } = require('./entry.ts');
        assert.equal(result.value, 42);
        assert.equal(result.valid, true);
        assert.equal(result.label, 'fixture');
        assert.deepEqual(metadata, ['Number']);
        assert.equal(typeof require('node:fs').readFileSync, 'function');
        assert.throws(() => require('./missing'), { code: 'MODULE_NOT_FOUND' });
        assert.throws(() => require('../checkout-other/dependency'), { code: 'MODULE_NOT_FOUND' });
        assert.throws(() => require('fixture-package/entry'), { code: 'MODULE_NOT_FOUND' });
        assert.equal(require.extensions['.ts'], original);
      } finally {
        hooks.deregister();
      }
      assert.throws(() => require('./after-cleanup'), { code: 'MODULE_NOT_FOUND' });
      console.log('loader checks passed');
    `;
    expect(
      execFileSync(
        process.execPath,
        ['--input-type=module', '--eval', script],
        { encoding: 'utf8' },
      ),
    ).toContain('loader checks passed');
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
