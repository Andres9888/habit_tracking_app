/**
 * HabitDetailSections — recommitment stack below the hero:
 * This week → strength snapshot → streak goal → record doors → one insight
 * line.
 *
 * In recovery the strength dial and the Analytics door drop out. Being scored
 * is the wrong response to a bad day; the guilt is the churn risk, not the
 * missing chart.
 */
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { spacing } from '../../../theme/spacing';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { HabitInsights } from '../insights';
import type { InsightId } from '../useDetailFlow';
import { DetailGoalCard } from './DetailGoalCard';
import { InsightLine } from './InsightLine';
import { RecordDoors } from './RecordDoors';
import { StrengthSnapshot } from './StrengthSnapshot';
import { ThisWeekCard } from './ThisWeekCard';

interface HabitDetailSectionsProps {
  completedDates: Set<string>;
  /** Log-derived current streak; `habit.currentStreak` is stale after a miss. */
  currentStreak: number;
  habit: Habit;
  insights: HabitInsights;
  isCompletedToday: boolean;
  /** A miss is still unanswered: suppress the score and the Analytics door. */
  isRecovery?: boolean;
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
  isCompletedToday,
  isRecovery = false,
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
        completedDates={completedDates}
        dayContext={{
          createdAt: habit.createdAt,
          daysOfWeek: habit.daysOfWeek,
          pausedAt: habit.pausedAt,
          resumedAt: habit.resumedAt,
        }}
        onDayPress={(date, done) => {
          if (date > today) return;
          if (date === today) onDayPress(date, done);
          else onOpenDay(date);
        }}
      />
      {isRecovery ? null : <StrengthSnapshot habit={habit} />}
      <DetailGoalCard habit={habit} loggedToday={isCompletedToday} />
      <RecordDoors
        onOpenAnalytics={onOpenAnalytics}
        onOpenHistory={onOpenHistory}
      />
      <InsightLine insights={insights} onPress={onOpenInsight} />
    </View>
  );
}
