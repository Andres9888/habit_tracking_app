/**
 * HabitDetailSections — Progress → noticing → month → [history] → note.
 */
import { useState } from 'react';
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { spacing } from '../../../theme/spacing';
import { getLocalDateString } from '../../../utils/getLocalDateString';
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
  selectedNoteDate: string;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onEdit?: () => void;
}

export function HabitDetailSections({
  completedDates,
  habit,
  insights,
  isCompletedToday,
  pendingToggleDate = null,
  selectedNoteDate,
  onDayPress,
  onEdit,
}: HabitDetailSectionsProps) {
  const [showHistory, setShowHistory] = useState(false);
  const today = getLocalDateString();
  const heroOwnsTodayNote = isCompletedToday && selectedNoteDate === today;

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
      {heroOwnsTodayNote ? null : (
        <HabitNoteCard
          canEdit={completedDates.has(selectedNoteDate)}
          date={selectedNoteDate}
          habitId={habit._id}
          habitNotes={habit.notes}
          note={insights.notesByDate[selectedNoteDate]}
        />
      )}
    </View>
  );
}
