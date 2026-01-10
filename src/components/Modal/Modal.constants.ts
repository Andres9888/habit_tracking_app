/**
 * Modal Component Constants
 * Animation spring configurations and dimension constants
 */

import { Dimensions } from 'react-native';
import { Springs } from '../../constants/motion';

export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  Dimensions.get('window');

/**
 * Organic spring config for fullScreen modals - using Springs.sheet as base
 * with additional precision settings for modal-specific behavior
 */
export const FULLSCREEN_ORGANIC_SPRING = {
  ...Springs.sheet,
  overshootClamping: false,
};

/** Exit spring - slightly faster for dismissal */
export const EXIT_SPRING_CONFIG = {
  damping: 26,
  mass: 1,
  stiffness: 420,
};

/** Snappy spring for interactive gestures */
export const GESTURE_SPRING_CONFIG = {
  damping: 20,
  mass: 1,
  stiffness: 450,
};

/**
 * Organic spring for bottom sheet - based on Springs.button with adjusted stiffness
 * No overshootClamping - tiny overshoot gives organic feel
 */
export const BOTTOM_SHEET_SPRING_CONFIG = {
  damping: 26,
  stiffness: 300,
};

/** Gesture thresholds for dismissal */
export const DISMISS_THRESHOLD = 120;
export const VELOCITY_THRESHOLD = 800;
