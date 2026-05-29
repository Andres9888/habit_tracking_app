/**
 * Focus State Gradients
 *
 * Brand-palette gradients used by TodaysFocusCard to visualize the 7 focus
 * states the hero card cycles through. Each gradient is a tuple of
 * `[start, end]` hex strings, sourced exclusively from brand tokens in
 * `./core.ts` so the hero card stays on the "warm minimal" palette
 * (forest green + warm stone + burnished gold).
 *
 * ## Mapping Rationale
 *
 * | State        | Start                      | End                         | Feel                       |
 * | ------------ | -------------------------- | --------------------------- | -------------------------- |
 * | starting     | `primary[300]` light green | `primary[500]` mid green    | "starting fresh"           |
 * | building     | `primary[500]` mid green   | `primary[700]` dark green   | "rooting in"               |
 * | thriving     | `primary[700]` dark green  | `streak[500]` gold          | "earning gold"             |
 * | completed    | `primary[500]` mid green   | `primary[700]` dark green   | matches building (intent)  |
 * | celebrating  | `streak[300]` light gold   | `streak[700]` dark gold     | "champion"                 |
 * | struggling   | `gray[300]` warm stone     | `gray[500]` darker stone    | "holding space" (not warn) |
 * | recovering   | `gray[400]` warm stone     | `primary[500]` mid green    | "neutral hope"             |
 *
 * Tuples are typed as mutable `[string, string]` to match the consuming
 * `FocusStateConfig.gradientColors` shape (expo-linear-gradient props).
 *
 * @example
 * ```tsx
 * import { focusStateGradients } from '@/theme/colors/focusStates';
 *
 * <LinearGradient colors={focusStateGradients.thriving}>
 *   ...
 * </LinearGradient>
 * ```
 */

import { colors } from './core';

type GradientTuple = [string, string];

export const focusStateGradients: {
  readonly starting: GradientTuple;
  readonly building: GradientTuple;
  readonly thriving: GradientTuple;
  readonly completed: GradientTuple;
  readonly celebrating: GradientTuple;
  readonly struggling: GradientTuple;
  readonly recovering: GradientTuple;
} = {
  /** Starting fresh — light green easing into mid green */
  starting: [colors.primary[300], colors.primary[500]],

  /** Rooting in — mid green deepening into dark green */
  building: [colors.primary[500], colors.primary[700]],

  /** Earning gold — dark green transitioning to burnished gold */
  thriving: [colors.primary[700], colors.streak[500]],

  /** Steady completion — intentionally mirrors `building` */
  completed: [colors.primary[500], colors.primary[700]],

  /** Champion — light gold blooming into dark gold */
  celebrating: [colors.streak[300], colors.streak[700]],

  /** Holding space — muted warm stone to darker stone (NOT a warning) */
  struggling: [colors.gray[300], colors.gray[500]],

  /** Neutral hope — warm stone resolving into mid green */
  recovering: [colors.gray[400], colors.primary[500]],
};

export type FocusStateGradientKey = keyof typeof focusStateGradients;
