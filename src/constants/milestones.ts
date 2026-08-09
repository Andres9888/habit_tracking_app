/**
 * Streak milestones — shared thresholds and copy for round-number streak
 * achievements (7 / 30 / 100 / 365 days). Used by the today-screen
 * CompletionToast / DayCompleteBeat and by the habit-detail MilestoneBar.
 */

/** Ordered near-term streak milestones. Source of truth for progress UI. */
export const MILESTONE_THRESHOLDS = [7, 30, 100, 365] as const;

/** Calm one-line message per milestone streak length. */
export const MILESTONE_MESSAGES: Record<number, string> = {
  7: '🎉 7 days — the first week is the hardest. Done.',
  30: '🎉 30 days — a full month of showing up.',
  100: '🎉 100 days — this is who you are now.',
  365: '🎉 One year. Extraordinary.',
};

/** Milestone message for a streak, or null when the streak isn't a milestone. */
export function milestoneMessage(streak: number): string | null {
  return MILESTONE_MESSAGES[streak] ?? null;
}

/** True when the streak length lands on a round-number milestone. */
export function isMilestoneStreak(streak: number): boolean {
  return streak in MILESTONE_MESSAGES;
}
