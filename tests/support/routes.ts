import { localizePath } from '../../src/i18n/routing.ts';

/** Expected public routes, shared by transition and deployment coverage. */
export const englishPaths = [
  '/',
  '/hiring/',
  '/work/saas-modernization/',
  '/work/agricultural-platform/',
  '/work/engineering-delivery/',
  '/projects/api-gateway/',
  '/projects/experimentation/',
  '/projects/secure-keys/',
  '/notes/',
  '/notes/failure-controls/',
  '/notes/consistent-experiments/',
  '/thanks/',
  '/404.html',
] as const;

export const localizedRoutes = (['en', 'es'] as const).flatMap((locale) =>
  englishPaths.map((original) => ({
    locale,
    original,
    path: localizePath(original, locale),
  })),
);
