/** Copy for the "Your runs" card. Pure so the sentences can be unit-tested. */

import type { RunTrend, StreakRun } from '../../insights';

/** Right-hand note beside the eyebrow. */
export function runsNote(total: number, goal: number): string {
  const runs = `${total} ${total === 1 ? 'run' : 'runs'}`;
  return goal > 0 ? `${runs} · axis ${goal}-day goal` : runs;
}

/** Footnote under the rail: how much is shown, then the trend if there is one. */
export function runsFootnote(
  shown: number,
  total: number,
  trend: RunTrend | null
): string {
  const rest = total - shown;
  const lead =
    rest > 0
      ? `Your ${shown} longest runs, then ${rest} shorter ${rest === 1 ? 'one' : 'ones'}.`
      : `Every run since you started.`;
  if (!trend?.improving) return lead;
  return `${lead} Recent runs average ${trend.recentAvg} days, up from ${trend.earlierAvg}.`;
}

/** Right-hand label on the goal row. */
export function goalRowMeta(current: StreakRun | undefined, goal: number) {
  const remaining = goal - (current?.length ?? 0);
  if (remaining <= 0) return 'Goal reached';
  return `${remaining} ${remaining === 1 ? 'day' : 'days'} to go`;
}
