/**
 * Milestone target selection for the streak bar.
 *
 * While a personal best is still ahead of you, that best is the target — it is
 * the most motivating number available. Once you match or pass it the bar
 * re-aims at the next round milestone so it never sits pinned at 100%.
 */

const ROUND_MILESTONES = [7, 14, 30, 60, 100, 180, 365] as const;

export interface MilestoneTarget {
  target: number;
  /** True when the target IS the personal best rather than a round milestone. */
  isBest: boolean;
}

export function milestoneTarget(
  currentStreak: number,
  bestStreak: number
): MilestoneTarget {
  if (bestStreak > currentStreak) return { isBest: true, target: bestStreak };

  const next = ROUND_MILESTONES.find(
    (milestone) => milestone > Math.max(currentStreak, bestStreak)
  );
  if (next) return { isBest: false, target: next };

  // Past every named milestone: aim at the next whole year.
  const years = Math.floor(currentStreak / 365) + 1;
  return { isBest: false, target: years * 365 };
}

export function milestoneCaption(
  currentStreak: number,
  target: number,
  isBest: boolean,
  goalDuration?: number
): string {
  const goal = goalDuration ?? 0;
  const remaining = Math.max(0, target - currentStreak);
  const goalRemaining = goal - currentStreak;
  const goalCaption =
    goal > 0 && currentStreak > 0 && goalRemaining > 0
      ? ` ${goalRemaining} ${goalRemaining === 1 ? 'day' : 'days'} from your ${goal}-day goal.`
      : '';
  if (currentStreak === 0) {
    const targetDayWord = target === 1 ? 'day' : 'days';
    return isBest
      ? `Your best run is ${target} ${targetDayWord} — today starts the next one`
      : 'Today starts the next run';
  }
  // The goal clause is its own sentence, so the streak clause has to be closed
  // before it is appended — otherwise the caption reads as one run-on line.
  const withGoal = (lead: string) =>
    goalCaption ? `${lead}.${goalCaption}` : lead;
  if (remaining === 0) return withGoal('Personal best territory');
  const dayWord = remaining === 1 ? 'day' : 'days';
  return withGoal(
    isBest
      ? `${remaining} ${dayWord} from your best streak ever`
      : `${remaining} ${dayWord} to ${target}`
  );
}
