/**
 * Card Press Animation Utilities
 *
 * Consistent press feedback for all cards in the app.
 * Design system: Scale to 0.97 with spring physics (damping: 18)
 */

import { withSpring, type WithSpringConfig } from 'react-native-reanimated';
import { springs } from '@/theme/animations';

/**
 * Standard card press scale value
 * Slightly reduces card size on press for tactile feedback
 */
export const CARD_PRESS_SCALE = 0.97;

/**
 * Standard card rest scale value
 */
export const CARD_REST_SCALE = 1;

/**
 * Spring configuration for card press animations.
 * Sourced from canonical springs.standard so future tuning happens in one place.
 */
export const CARD_PRESS_SPRING_CONFIG: WithSpringConfig = {
  ...springs.standard,
};

/**
 * Apply press animation to a shared value
 * @param scale - Shared value to animate
 * @param pressed - Whether card is pressed
 */
export function animateCardPress(
  scale: { value: number },
  pressed: boolean
): void {
  scale.value = withSpring(
    pressed ? CARD_PRESS_SCALE : CARD_REST_SCALE,
    CARD_PRESS_SPRING_CONFIG
  );
}

/**
 * Press down animation
 */
export function pressCard(scale: { value: number }): void {
  animateCardPress(scale, true);
}

/**
 * Release animation
 */
export function releaseCard(scale: { value: number }): void {
  animateCardPress(scale, false);
}
