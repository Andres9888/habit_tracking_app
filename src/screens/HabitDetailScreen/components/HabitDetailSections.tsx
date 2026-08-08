/**
 * HabitDetailSections — the card stack below the hero wash:
 *
 *   Progress → What we're noticing → Your month → [history] → note
 *
 * The note card moves into the hero once today is logged (frame 2 of the Habit
 * Flow Prototype), so it is rendered here only while today is still open — one
 * note, one input.
 */
import { useState } from 'react';
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { spacing } from '../../../theme/spacing';
import type { HabitInsights } from '../insights';
import { HabitDetailHistory } from './HabitDetailHistory';
import { HabitNoteCard } from './HabitNoteCard';
import { MonthHeatmapCard } from './MonthHeatmapCard';
import { NoticingSection } from './NoticingSection';
import { ThisWeekCard } from './ThisWeekCard';

interface HabitDetailSectionsProps {
  completedDates: Set<string>;
  habit: Habit;
  insights: HabitInsights;
  isCompletedToday: boolean;
  pendingToggleDate?: string | null;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onEdit?: () => void;
}

export function HabitDetailSections({
  completedDates,
  habit,
  insights,
  isCompletedToday,
  pendingToggleDate = null,
  onDayPress,
  onEdit,
}: HabitDetailSectionsProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <View style={{ gap: spacing.md, padding: 20, paddingBottom: 40 }}>
      <ThisWeekCard
        bestStreak={habit.bestStreak ?? 0}
        completedDates={completedDates}
        currentStreak={habit.currentStreak ?? 0}
        daysOfWeek={habit.daysOfWeek}
        yearCompletions={insights.yearCompletions}
        onDayPress={onDayPress}
      />
      <NoticingSection
        cue={habit.cueAfterBehavior}
        habitId={habit._id}
        insights={insights}
        onAdjustReminder={() => onEdit?.()}
      />
      <MonthHeatmapCard
        completedDates={completedDates}
        daysOfWeek={habit.daysOfWeek}
        yearRatePct={insights.yearRatePct}
        onDayPress={onDayPress}
        onViewHistory={() => setShowHistory((open) => !open)}
      />
      {showHistory ? (
        <HabitDetailHistory
          completedDates={completedDates}
          doneDates={insights.doneDates}
          habit={habit}
          pendingToggleDate={pendingToggleDate}
          yearCompletions={insights.yearCompletions}
          yearRatePct={insights.yearRatePct}
          onDayPress={onDayPress}
        />
      ) : null}
      {isCompletedToday ? null : (
        <HabitNoteCard habitId={habit._id} notes={habit.notes} />
      )}
    </View>
  );
}
