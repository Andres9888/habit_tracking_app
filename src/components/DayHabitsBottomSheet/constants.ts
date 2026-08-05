import { Dimensions } from 'react-native';
import { springs } from '@/theme/animations';

export const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * Spring configuration for bottom sheet animations
 * Matching SortBottomSheet's organic spring feel
 */
export const SHEET_SPRING_CONFIG = springs.standard;

/** Distance threshold for dismissing sheet via drag */
export const DISMISS_THRESHOLD = 100;

/** Velocity threshold for dismissing sheet via flick */
export const VELOCITY_THRESHOLD = 800;

/** Maximum sheet height as percentage of screen */
export const MAX_SHEET_HEIGHT_RATIO = 0.75;

/**
 * Backdrop fade durations match `durations.sheet` (360ms) so backdrop and
 * sheet arrive/leave together — consistent with useSwipeDismiss pattern used
 * by Create/Edit habit sheets.
 */
export const BACKDROP_FADE_IN_DURATION = 360;
export const BACKDROP_FADE_OUT_DURATION = 360;

/** Target backdrop opacity when visible */
export const BACKDROP_OPACITY = 0.4;
