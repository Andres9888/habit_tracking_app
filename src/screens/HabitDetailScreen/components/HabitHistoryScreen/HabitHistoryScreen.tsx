/**
 * HabitHistoryScreen — the Habit Detail Prototype's History frame, then the
 * interactive calendar underneath it.
 *
 * The frame — stats rail → runs → year grid — answers "what happened?". The
 * month below it is the only place in the app a past day can be corrected, so
 * it stays, labelled, rather than being pushed behind a disclosure — and there
 * is exactly one of it, in squares, matching the footnote.
 *
 * The month lives here, not in the calendar section, because the year grid in
 * the frame above drives it: pressing a week jumps the calendar to that week.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { startOfMonth } from 'date-fns';
import type { Habit } from '../../../../features/habits/types';
import { parseLocalDate, useHabitInsights } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { FlowPage } from '../FlowPage';
import { HistoryFrame } from '../HabitDetailHistory/HistoryFrame';
import { HistoryCalendarSection } from './HistoryCalendarSection';

interface HabitHistoryScreenProps {
  focusDate?: string;
  habit: Habit;
  notes?: Record<string, string>;
  pendingToggleDate?: string | null;
  onOpenDay: (date: string) => void;
}

export function HabitHistoryScreen({
  focusDate,
  habit,
  notes = {},
  pendingToggleDate = null,
  onOpenDay,
}: HabitHistoryScreenProps) {
  const palette = useInsightPalette();
  const insights = useHabitInsights({
    daysOfWeek: habit.daysOfWeek,
    habitCreatedAt: habit.createdAt,
    habitId: habit._id,
    reminderTime: habit.reminderTime,
  });
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

  const selectMonth = useCallback(
    (date: string) => setMonth(startOfMonth(parseLocalDate(date))),
    []
  );

  return (
    <FlowPage footnote='Every square is a day you logged or didn’t. Nothing is estimated — tap any past date to see or correct it.'>
      <HistoryFrame
        doneDates={insights.doneDates}
        habit={habit}
        palette={palette}
        schedule={schedule}
        yearCompletions={insights.yearCompletions}
        yearRatePct={insights.yearRatePct}
        onSelectMonth={selectMonth}
      />
      <HistoryCalendarSection
        habit={habit}
        month={month}
        notes={notes}
        pendingToggleDate={pendingToggleDate}
        schedule={schedule}
        onMonthChange={setMonth}
        onOpenDay={onOpenDay}
      />
    </FlowPage>
  );
}
