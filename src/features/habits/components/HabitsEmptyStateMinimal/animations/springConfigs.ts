/**
 * Spring Animation Configurations
 *
 * React-native-reanimated spring configs for interactive elements.
 * Spring values per app patterns: damping 15-32, stiffness 180-300
 */

import { WithSpringConfig } from 'react-native-reanimated';

/**
 * Spring configs for interactive elements
 */
export const SPRING_CONFIGS = {
  // Chip hover lift
  chipHover: {
    damping: 18,
    stiffness: 240,
  } satisfies WithSpringConfig,

  // Chip press feedback - snappy
  chipPress: {
    damping: 15,
    stiffness: 300,
  } satisfies WithSpringConfig,

  // CTA button press
  ctaPress: {
    damping: 20,
    stiffness: 280,
  } satisfies WithSpringConfig,

  // Entrance animation spring
  entrance: {
    damping: 18,
    stiffness: 200,
  } satisfies WithSpringConfig,

  // Default smooth spring
  smooth: {
    damping: 25,
    stiffness: 180,
  } satisfies WithSpringConfig,

  // Success pop animation
  successPop: {
    damping: 10,
    stiffness: 200,
  } satisfies WithSpringConfig,
} as const;

/**
 * Spring config for exit transition
 */
export const EXIT_SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
} satisfies WithSpringConfig;
