export type Theme = 'light' | 'dark';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function resolveTheme(preference: unknown, systemDark: boolean): Theme {
  if (isTheme(preference)) {
    return preference;
  }

  return systemDark ? 'dark' : 'light';
}
