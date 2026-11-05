import { isTheme, resolveTheme } from '@/domain/theme';
import { readThemePreference } from '@/infrastructure/theme-preference';
import { localizeFragment } from '@/i18n/routing';
import { containFocus } from './focus-containment';

function synchronizeMenu(menu: HTMLDetailsElement): void {
  menu
    .querySelector('summary')
    ?.setAttribute('aria-expanded', String(menu.open));
}

function closeMenu(menu: HTMLDetailsElement): void {
  menu.open = false;
  synchronizeMenu(menu);
}

function initializeMenu(): void {
  const menu = document.querySelector<HTMLDetailsElement>('[data-mobile-menu]');
  if (menu) {
    synchronizeMenu(menu);
  }
}

initializeMenu();
document.addEventListener('astro:page-load', initializeMenu);
document.addEventListener(
  'toggle',
  (event) => {
    if (
      event.target instanceof HTMLDetailsElement &&
      event.target.matches('[data-mobile-menu]')
    ) {
      synchronizeMenu(event.target);
    }
  },
  { capture: true },
);

for (const type of ['pointerdown', 'focusin'] as const) {
  document.addEventListener(type, (event) => {
    const menu = document.querySelector<HTMLDetailsElement>(
      '[data-mobile-menu][open]',
    );
    if (menu && event.target instanceof Node && !menu.contains(event.target)) {
      closeMenu(menu);
    }
  });
}

window.matchMedia('(min-width: 80rem)').addEventListener('change', (event) => {
  const menu = document.querySelector<HTMLDetailsElement>(
    '[data-mobile-menu][open]',
  );
  if (event.matches && menu) {
    closeMenu(menu);
  }
});

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
      closeMenu(menu);
    }
  },
  { capture: true },
);

document.addEventListener('keydown', (event) => {
  const menu = document.querySelector<HTMLDetailsElement>(
    '[data-mobile-menu][open]',
  );
  if (menu) {
    containFocus(event, menu);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(menu);
      menu.querySelector('summary')?.focus();
    }
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
