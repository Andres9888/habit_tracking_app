/**
 * HabitDetailSections — recommitment stack below the hero:
 * strength snapshot → This week → History/Analytics doors → one insight line.
 */
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { spacing } from '../../../theme/spacing';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { HabitInsights } from '../insights';
import type { InsightId } from '../useDetailFlow';
import { InsightLine } from './InsightLine';
import { RecordDoors } from './RecordDoors';
import { StrengthSnapshot } from './StrengthSnapshot';
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
      <StrengthSnapshot habit={habit} />
      <ThisWeekCard
        completedDates={completedDates}
        daysOfWeek={habit.daysOfWeek}
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
    </View>
  );
}
