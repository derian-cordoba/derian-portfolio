import {
  initializeMeasurement,
  trackEngagement,
  trackPageView,
} from '@/infrastructure/engagement';

initializeMeasurement();
document.addEventListener('astro:page-load', trackPageView);

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const anchor = event.target.closest('a');
  if (!anchor) {
    return;
  }
  if (anchor.hasAttribute('download')) {
    trackEngagement('CV downloaded');
    return;
  }
  const href = anchor.getAttribute('href') ?? '';
  if (
    href.startsWith('mailto:') ||
    href.startsWith('https://www.linkedin.com/')
  ) {
    trackEngagement('Contact opened');
  } else if (href.startsWith('https://github.com/')) {
    trackEngagement('Project source opened');
  }
});

document.addEventListener(
  'toggle',
  (event) => {
    if (!(event.target instanceof HTMLDetailsElement) || !event.target.open) {
      return;
    }
    const scenario = event.target.dataset['walkthroughScenario'];
    if (scenario) {
      trackEngagement('Walkthrough explored', scenario);
    }
  },
  true,
);

document.addEventListener('submit', (event) => {
  if (
    event.target instanceof HTMLFormElement &&
    event.target.hasAttribute('data-inquiry-form')
  ) {
    trackEngagement('Inquiry submitted');
  }
});
