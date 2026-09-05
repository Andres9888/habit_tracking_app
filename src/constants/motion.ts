/**
 * Motion Constants — thin compatibility layer.
 *
 * `@/theme/animations` is the single source of truth for durations, easings
 * and springs. This module only re-exports the canonical spring presets under
 * the `Springs` / `SPRING_*` names that existing call sites still use.
 */

import type { WithSpringConfig } from 'react-native-reanimated';
import { springs } from '@/theme/animations';

const freeze = <T extends Record<string, unknown>>(spring: T): T =>
  Object.freeze(spring);

export const SPRING_STANDARD: WithSpringConfig = freeze(
  springs.standard as WithSpringConfig
);
export const SPRING_BUTTON: WithSpringConfig = SPRING_STANDARD;
export const SPRING_GENTLE: WithSpringConfig = freeze(
  springs.gentle as WithSpringConfig
);

/** Canonical springs as a frozen record for `Springs.button`-style consumers. */
export const Springs: Record<keyof typeof springs, WithSpringConfig> = {
  button: SPRING_BUTTON,
  celebration: freeze(springs.celebration as WithSpringConfig),
  exit: freeze(springs.exit as WithSpringConfig),
  gentle: SPRING_GENTLE,
  gesture: freeze(springs.gesture as WithSpringConfig),
  pop: freeze(springs.pop as WithSpringConfig),
  sheet: freeze(springs.sheet as WithSpringConfig),
  standard: SPRING_STANDARD,
};
Object.freeze(Springs);
