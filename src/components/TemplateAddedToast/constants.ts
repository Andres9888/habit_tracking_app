/**
 * TemplateAddedToast Constants
 */

import { springs } from '@/theme/animations';
import { colors } from '@/theme/colors';

/** Threshold for swipe to dismiss (pixels) */
export const DISMISS_THRESHOLD = 50;

/** Velocity threshold for fast-swipe dismiss (px/s) */
export const VELOCITY_THRESHOLD = 500;

/** Default auto-dismiss duration (ms) */
export const DEFAULT_DURATION = 8000;

/** Fallback color when template has no iconColor */
export const FALLBACK_COLOR = colors.primary[500];

/** Icon badge size */
export const ICON_BADGE_SIZE = 40;

/** Spring configs for animations */
export const SPRING_BOUNCY = springs.bouncy;
export const SPRING_ICON = springs.bouncy;
export const SPRING_EXIT = springs.standard;
