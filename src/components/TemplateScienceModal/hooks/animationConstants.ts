/**
 * Animation configuration constants for TemplateScienceModal
 */

import { durations, springs } from '@/theme/animations';

export const HERO_ANIMATION = {
  opacity: { duration: durations.emphasis },
  scale: springs.gentle,
};

export const CARD_ANIMATION = {
  delays: { card1: 150, card2: 250, card3: 350, footer: 450 },
  spring: springs.gentle,
};

export const GLOW_ANIMATION = {
  duration: durations.breathing,
  opacity: { max: 0.35, min: 0.2 },
  scale: { max: 1.15, min: 1 },
};
