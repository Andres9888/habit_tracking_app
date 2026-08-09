/**
 * Next-milestone progress for the habit-detail streak bar.
 * Thresholds come from shared milestones constants — never hardcode here.
 */
import { MILESTONE_THRESHOLDS } from '../../../../constants/milestones';

export interface MilestoneProgress {
  /** Fill percent for the bar: daysSinceLast / daysBetween. */
  fillPct: number;
  /** True while aiming at the first threshold (day 7). */
  isFirst: boolean;
  /** Days remaining until the next unreached milestone. */
  remaining: number;
  /** Next unreached milestone day count. */
  target: number;
}

/** Next milestone progress, or null once every threshold is passed (365+). */
export function nextMilestoneProgress(
  currentStreak: number
): MilestoneProgress | null {
  const next = MILESTONE_THRESHOLDS.find(
    (milestone) => milestone > currentStreak
  );
  if (next === undefined) return null;

  const index = MILESTONE_THRESHOLDS.indexOf(next);
  const previous = index > 0 ? MILESTONE_THRESHOLDS[index - 1] : 0;
  const span = next - previous;
  const since = Math.max(0, currentStreak - previous);

  return {
    fillPct: span === 0 ? 0 : Math.min(100, (since / span) * 100),
    isFirst: next === MILESTONE_THRESHOLDS[0],
    remaining: Math.max(0, next - currentStreak),
    target: next,
  };
}

/** Caption matching the offer-engineering mock. */
export function milestoneCaption(progress: MilestoneProgress): string {
  const dayWord = progress.remaining === 1 ? 'day' : 'days';
  const which = progress.isFirst ? 'first' : 'next';
  return `${progress.remaining} ${dayWord} to your ${which} milestone — day ${progress.target}`;
}
