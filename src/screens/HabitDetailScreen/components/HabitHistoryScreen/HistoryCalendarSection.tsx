/**
 * HistoryCalendarSection — the interactive half of History: the month you can
 * navigate and correct, then that month's day-by-day record.
 *
 * It reads the wider creation-to-today tracking window rather than the frame's
 * year-to-date set, because a calendar you can page back through must be able
 * to show days that fall outside this year.
 */
import { useEffect, useMemo, useState } from 'react';
import { addMonths, startOfMonth } from 'date-fns';
import { MonthNavigation } from '../../../../components/BinaryHeatmap/MonthlyCalendarGrid';
import type { Habit } from '../../../../features/habits/types';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { triggerHaptic } from '../../../../utils/haptics';
import { parseLocalDate, useHabitTrackingRange } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { MonthGridCard } from '../HabitDetailHistory/MonthGridCard';
import { FlowSectionLabel } from '../FlowSectionLabel';
import { buildHistoryEntries } from './historyEntries';
import { HistoryEntryList } from './HistoryEntryList';
import { HistoryLegend } from './HistoryLegend';
import { useSettledMonthRate } from './useSettledMonthRate';

interface HistoryCalendarSectionProps {
  focusDate?: string;
  habit: Habit;
  notes: Record<string, string>;
  /**
   * Accepted so DetailFlowSwitch keeps compiling; the squares read the fetched
   * tracking rows directly, so there is no optimistic cell to paint here.
   */
  pendingToggleDate?: string | null;
  onOpenDay: (date: string) => void;
}

export function HistoryCalendarSection({
  focusDate,
  habit,
  notes,
  onOpenDay,
}: HistoryCalendarSectionProps) {
  const palette = useInsightPalette();
  const today = getLocalDateString();
  const rows = useHabitTrackingRange({
    endDate: today,
    habitId: habit._id,
    // Same fallback as DayDetailScreen: an unknown creation date must not turn
    // into a decades-wide range that we then fetch and persist every open.
    startDate: habit.createdAt
      ? getLocalDateString(new Date(habit.createdAt))
      : `${today.slice(0, 4)}-01-01`,
  });
  const doneDates = useMemo(
    () =>
      new Set(
        (rows ?? []).filter((row) => row.completed).map((row) => row.date)
      ),
    [rows]
  );
  const [month, setMonth] = useState(() =>
    startOfMonth(focusDate ? parseLocalDate(focusDate) : new Date())
  );

  useEffect(() => {
    if (focusDate) setMonth(startOfMonth(parseLocalDate(focusDate)));
  }, [focusDate]);

  const schedule = useMemo(
    () => ({
      createdAt: habit.createdAt,
      daysOfWeek: habit.daysOfWeek,
      pausedAt: habit.pausedAt,
      resumedAt: habit.resumedAt,
    }),
    [habit.createdAt, habit.daysOfWeek, habit.pausedAt, habit.resumedAt]
  );

  const entries = useMemo(
    () => buildHistoryEntries(month, doneDates, today, notes, schedule),
    [month, doneDates, notes, schedule, today]
  );

  const { isBest, rate } = useSettledMonthRate({
    completedDates: doneDates,
    createdAt: habit.createdAt,
    daysOfWeek: habit.daysOfWeek,
    month,
    today,
  });

  const shiftMonth = (delta: number) => {
    void triggerHaptic('selection');
    setMonth((current) => startOfMonth(addMonths(current, delta)));
  };

  return (
    <>
      <FlowSectionLabel>Calendar</FlowSectionLabel>
      <MonthNavigation
        standalone
        currentMonth={month}
        onNextMonth={() => shiftMonth(1)}
        onPreviousMonth={() => shiftMonth(-1)}
      />
      <MonthGridCard
        completedDates={doneDates}
        footer={<HistoryLegend />}
        isBest={isBest}
        month={month}
        notes={notes}
        palette={palette}
        rate={rate}
        schedule={schedule}
        onOpenDay={(date) => (date <= today ? onOpenDay(date) : undefined)}
      />
      <FlowSectionLabel>Daily record</FlowSectionLabel>
      <HistoryEntryList entries={entries} onOpenDay={onOpenDay} />
    </>
  );
}
