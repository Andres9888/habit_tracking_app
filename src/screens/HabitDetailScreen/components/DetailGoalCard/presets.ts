/** Preset targets offered inline on the detail screen. */

export const DETAIL_GOAL_PRESETS = [7, 21, 30] as const;

/** The shortest preset that would actually beat the reader's record. */
export function suggestedGoal(bestStreak: number): number {
  return (
    DETAIL_GOAL_PRESETS.find((preset) => preset > bestStreak) ??
    DETAIL_GOAL_PRESETS[DETAIL_GOAL_PRESETS.length - 1]
  );
}
