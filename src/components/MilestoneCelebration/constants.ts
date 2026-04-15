/**
 * Constants for MilestoneCelebration component
 */

import { Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import { milestoneColors } from '../../theme/milestone-colors';
import { springs } from '@/theme/animations';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

/**
 * Confetti colors from UX spec: Primary green variants + gold
 */
export const CONFETTI_COLORS = [
  colors.primary[300], // Light green (starting)
  colors.primary[400], // Lighter emerald
  colors.primary[500], // Brand green
  colors.primary[600], // Darker emerald
  colors.primary[700], // Very dark emerald
  milestoneColors.amber, // Gold/amber
];

/** Animation timing constants */
export const ANIMATION_TIMING = {
  BADGE_BOUNCE_DAMPING: springs.bouncy.damping,
  BADGE_BOUNCE_STIFFNESS: springs.bouncy.stiffness,
  BADGE_SETTLE_DAMPING: springs.standard.damping,
  BADGE_SETTLE_STIFFNESS: springs.standard.stiffness,
  CONFETTI_DELAY: 200,
  CONTINUE_BUTTON_DELAY: 1000,
  GLOW_DURATION: 400,
  LABEL_DELAY: 300,
  LABEL_DURATION: 300,
  PERCENTAGE_DURATION: 500,
} as const;
