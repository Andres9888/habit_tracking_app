/**
 * HistoryCalendarSection — the interactive half of History: the month you can
 * navigate and correct, then that month's day-by-day record.
 *
 * It reads the wider creation-to-today tracking window rather than the frame's
 * year-to-date set, because a calendar you can page back through must be able
 * to show days that fall outside this year.
 *
 * The month itself is owned by HabitHistoryScreen so the year grid above can
 * drive it; this section only asks for the next one.
 */
import { useMemo } from 'react';
import { addMonths, startOfMonth } from 'date-fns';
import type { HabitDayContext } from '../../../../features/habits/habitDayState';
import type { Habit } from '../../../../features/habits/types';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { triggerHaptic } from '../../../../utils/haptics';
import { parseLocalDate, useHabitTrackingRange } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { MonthGridCard } from '../HabitDetailHistory/MonthGridCard';
import { FlowSectionLabel } from '../FlowSectionLabel';
import { buildHistoryEntries } from './historyEntries';
import { historyRangeStart } from './historyRangeStart';
import { HistoryEntryList } from './HistoryEntryList';
import { HistoryLegend } from './HistoryLegend';
import { useSettledMonthRate } from './useSettledMonthRate';

interface HistoryCalendarSectionProps {
  habit: Habit;
  /** The month on show; owned by HabitHistoryScreen. */
  month: Date;
  notes: Record<string, string>;
  /**
   * Accepted so DetailFlowSwitch keeps compiling; the squares read the fetched
   * tracking rows directly, so there is no optimistic cell to paint here.
   */
  pendingToggleDate?: string | null;
  schedule: HabitDayContext;
  onMonthChange: (next: Date) => void;
  onOpenDay: (date: string) => void;
}

export function HistoryCalendarSection({
  habit,
  month,
  notes,
  schedule,
  onMonthChange,
  onOpenDay,
}: HistoryCalendarSectionProps) {
  const palette = useInsightPalette();
  const today = getLocalDateString();
  const rows = useHabitTrackingRange({
    endDate: today,
    habitId: habit._id,
    startDate: historyRangeStart(habit.createdAt, today),
  });
  const doneDates = useMemo(
    () =>
      new Set(
        (rows ?? []).filter((row) => row.completed).map((row) => row.date)
      ),
    [rows]
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
    onMonthChange(startOfMonth(addMonths(month, delta)));
  };

  // The window the card can page over: creation (or this January) to this
  // month. Beyond either end there is nothing to show, so the chevron says so.
  const floor = startOfMonth(
    habit.createdAt
      ? new Date(habit.createdAt)
      : parseLocalDate(`${today.slice(0, 4)}-01-01`)
  );
  const navigation = {
    canGoNext: month < startOfMonth(parseLocalDate(today)),
    canGoPrev: month > floor,
    onNext: () => shiftMonth(1),
    onPrev: () => shiftMonth(-1),
  };

  return (
    <>
      <MonthGridCard
        completedDates={doneDates}
        footer={(present) => <HistoryLegend states={present} />}
        isBest={isBest}
        month={month}
        navigation={navigation}
        notes={notes}
        palette={palette}
        rate={rate}
        schedule={schedule}
        onOpenDay={(date) => (date <= today ? onOpenDay(date) : undefined)}
      />
      <FlowSectionLabel>Daily record</FlowSectionLabel>
      <HistoryEntryList
        key={month.toISOString()}
        entries={entries}
        onOpenDay={onOpenDay}
      />
    </>
  );
}
