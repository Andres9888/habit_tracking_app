/**
 * Spring Animation Configurations
 *
 * React-native-reanimated spring configs for interactive elements.
 * Design system standard: damping 18, mass 1, stiffness 150
 */

import { WithSpringConfig } from 'react-native-reanimated';

/**
 * Spring configs for interactive elements
 * All configs follow design system: damping 18, mass 1, stiffness 150
 */
export const SPRING_CONFIGS = {
  // Chip hover lift
  chipHover: {
    damping: 18,
    mass: 1,
    stiffness: 150,
  } satisfies WithSpringConfig,

  // Chip press feedback
  chipPress: {
    damping: 18,
    mass: 1,
    stiffness: 150,
  } satisfies WithSpringConfig,

  // CTA button press
  ctaPress: {
    damping: 18,
    mass: 1,
    stiffness: 150,
  } satisfies WithSpringConfig,

  // Entrance animation spring
  entrance: {
    damping: 18,
    mass: 1,
    stiffness: 150,
  } satisfies WithSpringConfig,

  // Default smooth spring
  smooth: {
    damping: 18,
    mass: 1,
    stiffness: 150,
  } satisfies WithSpringConfig,

  // Success pop animation
  successPop: {
    damping: 18,
    mass: 1,
    stiffness: 150,
  } satisfies WithSpringConfig,
} as const;

/**
 * Spring config for exit transition
 */
export const EXIT_SPRING_CONFIG = {
  damping: 18,
  mass: 1,
  stiffness: 150,
} satisfies WithSpringConfig;
