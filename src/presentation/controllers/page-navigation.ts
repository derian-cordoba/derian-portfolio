import { isTheme, resolveTheme } from '@/domain/theme';
import { readThemePreference } from '@/infrastructure/theme-preference';
import { localizeFragment } from '@/i18n/routing';

// Delegation keeps navigation controls working when ClientRouter replaces the body.
// Capture runs before the router reads the destination URL in its click handler.
document.addEventListener(
  'click',
  (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest<HTMLAnchorElement>('a');
    if (!link) {
      return;
    }

    if (link.hasAttribute('data-language-switch')) {
      const target = new URL(link.href);
      target.hash = window.location.hash;
      try {
        const headings = JSON.parse(
          link.dataset['headingMap'] ?? '{}',
        ) as Record<string, string>;
        target.hash = localizeFragment(window.location.hash, headings);
      } catch {
        // A native deep link remains usable if optional section metadata is unavailable.
      }
      target.search = window.location.search;
      link.href = target.href;
    }

    const menu = link.closest<HTMLDetailsElement>('[data-mobile-menu]');
    if (menu) {
      menu.open = false;
    }
  },
  { capture: true },
);

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  const menu = document.querySelector<HTMLDetailsElement>(
    '[data-mobile-menu][open]',
  );
  if (menu) {
    menu.open = false;
    menu.querySelector('summary')?.focus();
  }
});

document.addEventListener('astro:before-swap', (event) => {
  const current = document.documentElement.dataset['theme'];
  const theme = isTheme(current)
    ? current
    : resolveTheme(
        readThemePreference(),
        window.matchMedia('(prefers-color-scheme: dark)').matches,
      );
  event.newDocument.documentElement.dataset['theme'] = theme;
});
