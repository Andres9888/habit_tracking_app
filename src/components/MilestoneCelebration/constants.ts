/**
 * Constants for MilestoneCelebration component
 */

import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

/**
 * Confetti colors from UX spec: Primary green variants + gold
 */
export const CONFETTI_COLORS = [
  '#86EFAC', // Light green (starting)
  '#34D399', // Primary 400
  '#10B981', // Primary 500 (brand green)
  '#059669', // Primary 600
  '#047857', // Primary 700
  '#F59E0B', // Gold/amber
];

/** Animation timing constants */
export const ANIMATION_TIMING = {
  BADGE_BOUNCE_DAMPING: 10,
  BADGE_BOUNCE_STIFFNESS: 100,
  BADGE_SETTLE_DAMPING: 15,
  BADGE_SETTLE_STIFFNESS: 150,
  CONFETTI_DELAY: 200,
  CONTINUE_BUTTON_DELAY: 1000,
  GLOW_DURATION: 400,
  LABEL_DELAY: 300,
  LABEL_DURATION: 300,
  PERCENTAGE_DURATION: 500,
  SHARE_BUTTON_DELAY: 800,
} as const;
