import { Dimensions } from 'react-native';

export const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * Spring configuration for bottom sheet animations
 * Matching SortBottomSheet's organic spring feel
 */
export const SHEET_SPRING_CONFIG = {
  damping: 18,
  mass: 1,
  stiffness: 120,
};

/** Distance threshold for dismissing sheet via drag */
export const DISMISS_THRESHOLD = 100;

/** Velocity threshold for dismissing sheet via flick */
export const VELOCITY_THRESHOLD = 800;

/** Maximum sheet height as percentage of screen */
export const MAX_SHEET_HEIGHT_RATIO = 0.75;

/** Animation duration for backdrop fade in (ms) */
export const BACKDROP_FADE_IN_DURATION = 300;

/** Animation duration for backdrop fade out (ms) */
export const BACKDROP_FADE_OUT_DURATION = 250;

/** Target backdrop opacity when visible */
export const BACKDROP_OPACITY = 0.4;
