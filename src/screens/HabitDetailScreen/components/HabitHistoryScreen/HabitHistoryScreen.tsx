import { useEffect, useMemo, useState } from 'react';
import { addMonths, startOfMonth } from 'date-fns';
import { MonthNavigation } from '../../../../components/BinaryHeatmap/MonthlyCalendarGrid';
import type { Habit } from '../../../../features/habits/types';
import { triggerHaptic } from '../../../../utils/haptics';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate, useHabitInsights } from '../../insights';
import { unionDateSets } from '../../mergeCompletedDates';
import { useInsightPalette } from '../../insightPalette';
import { CalendarTabContent } from '../CalendarTabContent';
import { FlowPage } from '../FlowPage';
import { FlowSectionLabel } from '../FlowSectionLabel';
import { buildHistoryEntries } from './historyEntries';
import { HistoryEntryList } from './HistoryEntryList';
import { HistoryLegend } from './HistoryLegend';

const EMPTY_DATES = new Set<string>();

interface HabitHistoryScreenProps {
  completedDates?: Set<string>;
  focusDate?: string;
  habit: Habit;
  notes?: Record<string, string>;
  pendingToggleDate?: string | null;
  onOpenDay: (date: string) => void;
}

export function HabitHistoryScreen({
  completedDates,
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

  const doneDates = useMemo(
    () => unionDateSets(insights.doneDates, completedDates ?? EMPTY_DATES),
    [completedDates, insights.doneDates]
  );
  const today = getLocalDateString();
  const entries = useMemo(
    () => buildHistoryEntries(month, doneDates, today, notes),
    [month, doneDates, notes, today]
  );

  const shiftMonth = (delta: number) => {
    void triggerHaptic('selection');
    setMonth((current) => startOfMonth(addMonths(current, delta)));
  };

  return (
    <FlowPage footnote='Tap any past date to see or correct that day.'>
      <MonthNavigation
        standalone
        currentMonth={month}
        onNextMonth={() => shiftMonth(1)}
        onPreviousMonth={() => shiftMonth(-1)}
      />
      <CalendarTabContent
        hideGridNavigation
        showYearSection={false}
        completedDates={doneDates}
        footer={<HistoryLegend />}
        habit={habit}
        habitColor={palette.green}
        month={month}
        pendingToggleDate={pendingToggleDate}
        onDayPress={(date) => {
          if (date <= today) onOpenDay(date);
        }}
        onMonthChange={setMonth}
      />
      <FlowSectionLabel>Logged entries</FlowSectionLabel>
      <HistoryEntryList entries={entries} onOpenDay={onOpenDay} />
    </FlowPage>
  );
}
