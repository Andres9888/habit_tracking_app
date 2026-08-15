/**
 * HabitDetailSections — recommitment stack below the hero:
 * Progress → History/Analytics doors → one insight line → pause.
 */
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { spacing } from '../../../theme/spacing';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { HabitInsights } from '../insights';
import type { InsightId } from '../useDetailFlow';
import { InsightLine } from './InsightLine';
import { PauseCard } from './PauseCard';
import { RecordDoors } from './RecordDoors';
import { ThisWeekCard } from './ThisWeekCard';

interface HabitDetailSectionsProps {
  completedDates: Set<string>;
  habit: Habit;
  insights: HabitInsights;
  onDayPress: (date: string, isCompleted: boolean) => void;
  onOpenAnalytics: () => void;
  onOpenDay: (date: string) => void;
  onOpenHistory: () => void;
  onOpenInsight: (id: InsightId) => void;
}

export function HabitDetailSections({
  completedDates,
  habit,
  insights,
  onDayPress,
  onOpenAnalytics,
  onOpenDay,
  onOpenHistory,
  onOpenInsight,
}: HabitDetailSectionsProps) {
  const today = getLocalDateString();

  return (
    <View style={{ gap: spacing.md, padding: 20, paddingBottom: 40 }}>
      <ThisWeekCard
        bestStreak={habit.bestStreak ?? 0}
        completedDates={completedDates}
        currentStreak={habit.currentStreak ?? 0}
        daysOfWeek={habit.daysOfWeek}
        yearCompletions={insights.yearCompletions}
        onDayPress={(date, done) => {
          if (date > today) return;
          if (date === today) onDayPress(date, done);
          else onOpenDay(date);
        }}
      />
      <RecordDoors
        onOpenAnalytics={onOpenAnalytics}
        onOpenHistory={onOpenHistory}
      />
      <InsightLine insights={insights} onPress={onOpenInsight} />
      <PauseCard habitId={habit._id} paused={habit.paused} />
    </View>
  );
}
