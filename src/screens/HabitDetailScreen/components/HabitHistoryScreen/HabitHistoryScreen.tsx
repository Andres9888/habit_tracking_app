import { useEffect, useMemo, useState } from 'react';
import { startOfMonth } from 'date-fns';
import type { Habit } from '../../../../features/habits/types';
import { useThemeColors } from '../../../../theme';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate, useHabitInsights } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { CalendarTabContent } from '../CalendarTabContent';
import { FlowPage } from '../FlowPage';
import { FlowSectionLabel } from '../FlowSectionLabel';
import { HistoryStatsCard } from '../HabitDetailHistory';
import { HabitNoteCard } from '../HabitNoteCard';
import { buildHistoryEntries } from './historyEntries';
import { HistoryEntryList } from './HistoryEntryList';

interface HabitHistoryScreenProps {
  focusDate?: string;
  habit: Habit;
  pendingToggleDate?: string | null;
  onOpenDay: (date: string) => void;
}

export function HabitHistoryScreen({
  focusDate,
  habit,
  pendingToggleDate = null,
  onOpenDay,
}: HabitHistoryScreenProps) {
  const { colors } = useThemeColors();
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

  const today = getLocalDateString();
  const entries = useMemo(
    () => buildHistoryEntries(month, insights.doneDates, today),
    [month, insights.doneDates, today]
  );
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];

  return (
    <FlowPage footnote='Tap any past date to see or correct that day.'>
      <HistoryStatsCard
        bestStreak={habit.bestStreak ?? 0}
        palette={palette}
        yearCompletions={insights.yearCompletions}
        yearRatePct={insights.yearRatePct}
      />
      <CalendarTabContent
        showYearSection={false}
        completedDates={insights.doneDates}
        habit={habit}
        habitColor={habitColor}
        month={month}
        pendingToggleDate={pendingToggleDate}
        onDayPress={(date) => {
          if (date <= today) onOpenDay(date);
        }}
        onMonthChange={setMonth}
      />
      <FlowSectionLabel>Logged entries</FlowSectionLabel>
      <HistoryEntryList entries={entries} onOpenDay={onOpenDay} />
      <HabitNoteCard habitId={habit._id} notes={habit.notes} />
    </FlowPage>
  );
}
