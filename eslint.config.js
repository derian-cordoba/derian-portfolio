import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.sites-runtime/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,astro}'],
    languageOptions: {
      globals: { process: 'readonly', URL: 'readonly', console: 'readonly' },
    },
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
);
