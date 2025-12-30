/**
 * Shared Animation Constants
 *
 * This module exports reusable spring configurations and timing constants
 * used across the app's animation system. Centralizing these values ensures
 * consistent motion design and makes it easy to tune animations globally.
 *
 * Spring Physics Reference:
 * - damping: Controls how quickly oscillations settle (higher = less bounce)
 * - stiffness: Controls how fast the spring moves (higher = snappier)
 * - mass: Controls inertia (higher = slower, more momentum)
 */

import type { WithSpringConfig } from 'react-native-reanimated';

/**
 * Button press spring - Snappy, responsive feel for interactive elements
 * Good for: Buttons, cards, touchable items
 */
export const SPRING_BUTTON: WithSpringConfig = {
  damping: 15,
  stiffness: 300,
};

/**
 * Gentle spring - Softer, more organic motion for content transitions
 * Good for: Content reveals, section animations, slide-ins
 */
export const SPRING_GENTLE: WithSpringConfig = {
  damping: 28,
  mass: 1.2,
  stiffness: 180,
};

/**
 * Bouncy spring - Pronounced bounce effect for celebratory/attention moments
 * Good for: Success states, badges, completion indicators
 */
export const SPRING_BOUNCY: WithSpringConfig = {
  damping: 8,
  stiffness: 300,
};

/**
 * Stagger delay between sequential animations (milliseconds)
 * Used to create cascading entrance effects for lists/grids
 */
export const STAGGER_DELAY = 80;

/**
 * Base delay before checkmark animations start (milliseconds)
 * Allows content to settle before showing completion indicators
 */
export const BASE_CHECKMARK_DELAY = 600;
