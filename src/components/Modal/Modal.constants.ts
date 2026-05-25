/**
 * Modal Component Constants
 * Animation spring configurations and dimension constants
 */

import { Dimensions } from 'react-native';
import { springs } from '../../theme/animations';

export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  Dimensions.get('window');

/**
 * Organic spring config for fullScreen modals - using springs.sheet as base
 * with additional precision settings for modal-specific behavior
 */
export const FULLSCREEN_ORGANIC_SPRING = {
  ...springs.sheet,
  overshootClamping: false,
};

/** Exit spring - slightly faster for dismissal */
export const EXIT_SPRING_CONFIG = springs.exit;

/** Snappy spring for interactive gestures */
export const GESTURE_SPRING_CONFIG = springs.gesture;

/**
 * Organic spring for bottom sheet
 * No overshootClamping - tiny overshoot gives organic feel
 */
export const BOTTOM_SHEET_SPRING_CONFIG = springs.bottomSheet;

/** Gesture thresholds for dismissal */
export const DISMISS_THRESHOLD = 120;
export const VELOCITY_THRESHOLD = 800;

/**
 * Per-variant exit animation duration (ms). Used to defer unmount until the
 * animation in runExitAnimation has time to play out. Slight buffer included
 * so the closing animation always finishes before the component leaves the tree.
 */
export const EXIT_DURATIONS = {
  bottomSheet: 450,
  fullScreen: 320,
  centerAlert: 220,
} as const;
