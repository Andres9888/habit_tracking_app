/**
 * HistoryFrame — the read-only half of History:
 *
 *   stats rail → your runs → year at a glance
 *
 * The month grid that used to close this frame now lives below it, navigable
 * and tappable, in HistoryCalendarSection — two grids of the same month on one
 * screen read as a bug, and only one of them could ever be corrected.
 *
 * Everything here is derived from year-to-date check-ins, which is the window
 * the habit is actually queried over. The one exception is the rail's Longest,
 * which the backend maintains across all time — so the runs card is told the
 * all-time best and only stars a run that matches it, instead of crowning a
 * year-to-date run the rail already contradicts. Current is NOT taken from the
 * habit document: `habit.currentStreak` is a stored field that nothing
 * recomputes on a miss, so it went on quoting a run these very bars show as
 * over. It comes from the same runs instead.
 */
import type { Habit } from '../../../../features/habits/types';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { streakStats, useStreakRuns } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import { HistoryStatsCard } from './HistoryStatsCard';
import { StreakRunsCard } from './StreakRunsCard';
import { useHistoryMonths } from './useHistoryMonths';
import { YearGlanceCard } from './YearGlanceCard';

interface HistoryFrameProps {
  /** Year-to-date completions — feeds the runs and the trend math. */
  doneDates: Set<string>;
  habit: Habit;
  habitColor: string;
  palette: InsightPalette;
  yearCompletions: number;
  yearRatePct: number;
}

export function HistoryFrame({
  doneDates,
  habit,
  habitColor,
  palette,
  yearCompletions,
  yearRatePct,
}: HistoryFrameProps) {
  const months = useHistoryMonths({
    completedDates: doneDates,
    createdAt: habit.createdAt,
    daysOfWeek: habit.daysOfWeek,
  });
  // A habit that started this year has no "year" to speak of — the rail's rate
  // covers its whole life, so it says so.
  const sinceStart =
    habit.createdAt !== undefined &&
    getLocalDateString(new Date(habit.createdAt)).slice(0, 4) ===
      getLocalDateString().slice(0, 4);
  const runs = useStreakRuns(doneDates, {
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
  });

  return (
    <>
      <HistoryStatsCard
        bestStreak={habit.bestStreak ?? 0}
        currentStreak={streakStats(runs).current}
        palette={palette}
        sinceStart={sinceStart}
        yearCompletions={yearCompletions}
        yearRatePct={yearRatePct}
      />
      <StreakRunsCard
        bestStreak={habit.bestStreak ?? 0}
        goalDuration={habit.goalDuration ?? 0}
        palette={palette}
        runs={runs}
      />
      <YearGlanceCard
        caption={months.caption}
        completedDates={doneDates}
        habitColor={habitColor}
        habitCreatedAt={habit.createdAt}
        palette={palette}
        rangeLabel={months.rangeLabel}
      />
    </>
  );
}
