import type { Page } from '@playwright/test';

/** Wait for Astro's page lifecycle before interacting with the incoming document. */
export async function navigateAndWaitForPageLoad(
  page: Page,
  navigate: () => Promise<unknown>,
): Promise<void> {
  await page.evaluate(() => {
    const state = window as unknown as { portfolioNavigationComplete: boolean };
    state.portfolioNavigationComplete = false;
    document.addEventListener(
      'astro:page-load',
      () => {
        state.portfolioNavigationComplete = true;
      },
      { once: true },
    );
  });

  await navigate();

  await page.waitForFunction(
    () =>
      (window as unknown as { portfolioNavigationComplete: boolean })
        .portfolioNavigationComplete,
  );
}
