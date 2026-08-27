/**
 * HabitHistoryScreen — the Habit Detail Prototype's History frame, then the
 * interactive calendar underneath it.
 *
 * The frame — stats rail → runs → year grid — answers "what happened?". The
 * month below it is the only place in the app a past day can be corrected, so
 * it stays, labelled, rather than being pushed behind a disclosure — and there
 * is exactly one of it, in squares, matching the footnote.
 */
import type { Habit } from '../../../../features/habits/types';
import { useHabitInsights } from '../../insights';
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

  return (
    <FlowPage footnote='Every square is a day you logged or didn’t. Nothing is estimated — tap any past date to see or correct it.'>
      <HistoryFrame
        doneDates={insights.doneDates}
        habit={habit}
        habitColor={palette.green}
        palette={palette}
        yearCompletions={insights.yearCompletions}
        yearRatePct={insights.yearRatePct}
      />
      <HistoryCalendarSection
        focusDate={focusDate}
        habit={habit}
        notes={notes}
        pendingToggleDate={pendingToggleDate}
        onOpenDay={onOpenDay}
      />
    </FlowPage>
  );
}
