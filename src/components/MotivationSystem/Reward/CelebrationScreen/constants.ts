/**
 * Constants for CelebrationScreen animations and styling
 */

import { springs } from '@/theme/animations';

// Animation spring configs
export const SPRING_BUTTON = springs.responsive;
export const SPRING_BOUNCY = springs.pop;
export const SPRING_GENTLE = springs.settle;
export const STAGGER_DELAY = 60;

// Confetti particle config
export const CONFETTI_COLORS = [
  '#10B981',
  '#34D399',
  '#FBBF24',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
];
export const PARTICLE_COUNT = 12;

// Initial animation values
export const INITIAL_TRANSLATE_Y = 20;
