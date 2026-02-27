/**
 * Spring Animation Configurations
 *
 * React-native-reanimated spring configs for interactive elements.
 * Design system standard sourced from the canonical theme springs.
 */

import { WithSpringConfig } from 'react-native-reanimated';
import { springs } from '@/theme/animations';

/**
 * Spring configs for interactive elements
 * All configs follow design system: canonical `springs.standard`
 * plus explicit mass to preserve existing call-site expectations.
 */

const makeReadOnlySpringConfig = <T extends Record<string, unknown>>(
  spring: T
): T => Object.freeze(spring);

const STANDARD_SPRING_CONFIG = makeReadOnlySpringConfig({
  ...springs.standard,
  mass: 1,
} as WithSpringConfig);

export const SPRING_CONFIGS = {
  // Chip hover lift
  chipHover: STANDARD_SPRING_CONFIG,

  // Chip press feedback
  chipPress: STANDARD_SPRING_CONFIG,

  // CTA button press
  ctaPress: STANDARD_SPRING_CONFIG,

  // Entrance animation spring
  entrance: STANDARD_SPRING_CONFIG,

  // Default smooth spring
  smooth: STANDARD_SPRING_CONFIG,

  // Success pop animation
  successPop: STANDARD_SPRING_CONFIG,
} as const;

/**
 * Spring config for exit transition
 */
export const EXIT_SPRING_CONFIG = STANDARD_SPRING_CONFIG;
