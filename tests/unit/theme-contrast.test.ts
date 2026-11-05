import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Theme } from '@/domain/theme';

const css = readFileSync(
  new URL('../../src/styles/global.css', import.meta.url),
  'utf8',
);
const palette = new Map<string, Record<Theme, string>>();

for (const match of css.matchAll(
  /--color-([\w-]+):\s*light-dark\((#[\da-f]{6,8}),\s*(#[\da-f]{6,8})\)/gu,
)) {
  const [, name, light, dark] = match;
  if (name && light && dark) {
    palette.set(name, { light, dark });
  }
}

function color(name: string, theme: Theme): string {
  const value = palette.get(name)?.[theme];
  if (!value) {
    throw new Error(`Missing theme token: ${name}`);
  }
  return value;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (
    (channels[0] ?? 0) * 0.2126 +
    (channels[1] ?? 0) * 0.7152 +
    (channels[2] ?? 0) * 0.0722
  );
}

const textPairs = [
  ['ink', 'paper'],
  ['muted', 'paper'],
  ['muted', 'surface'],
  ['muted', 'surface-muted'],
  ['muted', 'blue-light'],
  ['muted', 'performance'],
  ['blue', 'paper'],
  ['blue', 'surface'],
  ['blue', 'blue-light'],
  ['blue', 'performance'],
  ['success', 'platform'],
  ['success', 'tooling'],
  ['experiment-ink', 'experiment'],
  ['tooling-ink', 'tooling'],
  ['on-action', 'action'],
  ['on-action', 'action-hover'],
] as const;

for (const theme of ['light', 'dark'] as const) {
  it.each(['paper', 'surface'])(
    `${theme} form boundaries on %s meet 3:1 contrast`,
    (background) => {
      const values = [
        luminance(color('control', theme)),
        luminance(color(background, theme)),
      ].sort((left, right) => right - left);
      expect(
        ((values[0] ?? 0) + 0.05) / ((values[1] ?? 0) + 0.05),
      ).toBeGreaterThanOrEqual(3);
    },
  );
  describe(`${theme} palette text contrast`, () => {
    it.each(textPairs)(
      '%s on %s meets WCAG AA for normal text',
      (foreground, background) => {
        const values = [
          luminance(color(foreground, theme)),
          luminance(color(background, theme)),
        ].sort((left, right) => right - left);
        const ratio = ((values[0] ?? 0) + 0.05) / ((values[1] ?? 0) + 0.05);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      },
    );
  });
}
