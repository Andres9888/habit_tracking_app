/**
 * Motion Constants
 *
 * Standardized animation timing and easing values.
 * Based on iOS design patterns for natural, responsive feel.
 *
 * Springs are re-exported from @/theme/animations (canonical source).
 * Motion (duration + easing) stays here because it depends on react-native Easing.
 */

import { Easing } from 'react-native';
import type { WithSpringConfig } from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';

export const Motion = {
  duration: {
    base: durations.quick,
    emphasized: durations.transition,
    enter: durations.enter,
    exit: durations.transition,
    fast: durations.instant,
    reveal: durations.reveal,
  },
  easing: {
    inCubic: Easing.in(Easing.cubic),
    inEase: Easing.in(Easing.ease),
    outCubic: Easing.out(Easing.cubic),
    outEase: Easing.out(Easing.ease),
  },
} as const;

/**
 * Canonical spring presets are exposed as immutable constants here,
 * so consumers can reuse shared presets from either the components
 * or constants motion module without duplicating values.
 */
const makeReadOnlySpringConfig = <T extends Record<string, unknown>>(
  spring: T
): T => Object.freeze(spring);

export const SPRING_STANDARD: WithSpringConfig = makeReadOnlySpringConfig(
  springs.standard as WithSpringConfig
);
export const SPRING_PREMIUM: WithSpringConfig = SPRING_STANDARD;
export const SPRING_BUTTON: WithSpringConfig = SPRING_STANDARD;
export const SPRING_GENTLE: WithSpringConfig = makeReadOnlySpringConfig(
  springs.gentle as WithSpringConfig
);
export const SPRING_BOUNCY: WithSpringConfig = makeReadOnlySpringConfig(
  springs.bouncy as WithSpringConfig
);

type SpringKey = keyof typeof springs;
type SpringsMap = Readonly<Record<SpringKey, WithSpringConfig>>;

/**
 * Re-export canonical springs as a read-only-ready object for downstream
 * modules that rely on `Springs.button`, `Springs.gentle`, etc.
 */
export const Springs: SpringsMap = {
  standard: SPRING_STANDARD,
  bottomSheet: makeReadOnlySpringConfig(
    springs.bottomSheet as WithSpringConfig
  ),
  bouncy: SPRING_BOUNCY,
  button: SPRING_BUTTON,
  exit: makeReadOnlySpringConfig(springs.exit as WithSpringConfig),
  gentle: SPRING_GENTLE,
  gesture: makeReadOnlySpringConfig(springs.gesture as WithSpringConfig),
  micro: makeReadOnlySpringConfig(springs.micro as WithSpringConfig),
  pulse: makeReadOnlySpringConfig(springs.pulse as WithSpringConfig),
  sheet: makeReadOnlySpringConfig(springs.sheet as WithSpringConfig),
  snappy: makeReadOnlySpringConfig(springs.snappy as WithSpringConfig),
  celebration: makeReadOnlySpringConfig(
    springs.celebration as WithSpringConfig
  ),
  pop: makeReadOnlySpringConfig(springs.pop as WithSpringConfig),
  responsive: makeReadOnlySpringConfig(springs.responsive as WithSpringConfig),
  settle: makeReadOnlySpringConfig(springs.settle as WithSpringConfig),
};
Object.freeze(Springs);

/**
 * Re-export springs from the canonical theme source for backward compatibility.
 * Existing consumers can continue importing { Springs } from 'constants/motion'.
 */
export default Motion;
