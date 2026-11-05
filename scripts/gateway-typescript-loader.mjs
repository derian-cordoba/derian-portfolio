import { registerHooks } from 'node:module';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

/** Compile checkout TypeScript without changing how dependencies are loaded. */
export function registerGatewayTypeScript(checkout) {
  const root = realpathSync(checkout);

  function scopedFilename(url) {
    if (!url.startsWith('file:')) {
      return undefined;
    }
    const filename = realpathSync(fileURLToPath(url));
    const path = relative(root, filename);
    const segments = path.split(/[\\/]/u);
    if (
      isAbsolute(path) ||
      segments[0] === '..' ||
      segments.includes('node_modules')
    ) {
      return undefined;
    }
    return filename;
  }

  return registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (error) {
        if (
          !['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(error.code) ||
          !context.parentURL ||
          !scopedFilename(context.parentURL)
        ) {
          throw error;
        }
        if (!specifier.startsWith('.') && !isAbsolute(specifier)) {
          throw error;
        }
        const filename = fileURLToPath(new URL(specifier, context.parentURL));
        // Match CommonJS's extension and directory fallback for local TS files.
        for (const candidate of [
          `${filename}.ts`,
          join(filename, 'index.ts'),
        ]) {
          if (
            statSync(candidate, { throwIfNoEntry: false })?.isFile() &&
            scopedFilename(pathToFileURL(candidate).href)
          ) {
            return {
              url: pathToFileURL(candidate).href,
              format: 'commonjs',
              shortCircuit: true,
            };
          }
        }
        throw error;
      }
    },
    load(url, context, nextLoad) {
      if (!url.endsWith('.ts')) {
        return nextLoad(url, context);
      }
      const filename = scopedFilename(url);
      if (!filename) {
        return nextLoad(url, context);
      }
      const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
        fileName: filename,
      });
      return {
        format: 'commonjs',
        source: compiled.outputText,
        shortCircuit: true,
      };
    },
  });
}
