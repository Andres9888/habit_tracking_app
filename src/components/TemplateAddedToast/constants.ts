/**
 * TemplateAddedToast Constants
 */

import { durations, springs } from '@/theme/animations';
import { colors } from '@/theme/colors';

/** Threshold for swipe to dismiss (pixels) */
export const DISMISS_THRESHOLD = 50;

/** Velocity threshold for fast-swipe dismiss (px/s) */
export const VELOCITY_THRESHOLD = 500;

/** Default auto-dismiss duration (ms) */
export const DEFAULT_DURATION = 0;

/** Fallback color when template has no iconColor */
export const FALLBACK_COLOR = colors.primary[500];

/** Icon badge size */
export const ICON_BADGE_SIZE = 40;

/**
 * Entrance geometry. The card slides up from below its resting spot with a
 * quick fade so the motion (not the fade) carries the entrance. Scale stays
 * at 1 so nothing competes with the slide.
 */
export const ENTER_OFFSET_Y = 96;
export const ENTER_SCALE = 1;
export const EXIT_OFFSET_Y = 80;
export const EXIT_SCALE = 0.96;

/** Durations (ms) */
export const ENTER_FADE_DURATION = durations.quick;
export const ENTER_MOVE_DURATION = durations.transition;
export const EXIT_FADE_DURATION = durations.transition;
export const EXIT_CALLBACK_DELAY = durations.transition + 40;

/** Spring configs for animations */
export const SPRING_SNAP_BACK = springs.standard;
export const SPRING_EXIT = springs.exit;

/** Full-screen celebration overlay keeps its celebratory springs. */
export const SPRING_BOUNCY = springs.celebration;
export const SPRING_ICON = springs.celebration;
export const SPRING_CELEBRATION_SETTLE = springs.standard;
