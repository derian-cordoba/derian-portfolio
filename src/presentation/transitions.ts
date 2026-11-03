import type { TransitionDirectionalAnimations } from 'astro';

const pageAnimation = {
  old: {
    name: 'portfolio-page-leave',
    duration: '140ms',
    easing: 'ease-out',
    fillMode: 'both',
  },
  new: {
    name: 'portfolio-page-enter',
    duration: '200ms',
    easing: 'ease-out',
    fillMode: 'both',
  },
};

export const pageTransition = {
  forwards: pageAnimation,
  backwards: pageAnimation,
} satisfies TransitionDirectionalAnimations;
