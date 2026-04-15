import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { calculateStreakGoalProgress, getGoalMotivation } from '../streakGoalCalculations';
import { GoalProgressBar } from './GoalProgressBar';

interface StreakGoalProgressProps {
  currentStreak: number;
  goalDuration: number | undefined;
  goalAchievedAt: number | undefined;
}

export function StreakGoalProgress({ currentStreak, goalDuration, goalAchievedAt }: StreakGoalProgressProps) {
  const { colors } = useThemeColors();

  if (!goalDuration) return null;

  const { progressPercentage, daysRemaining, isAchieved } =
    calculateStreakGoalProgress(currentStreak, goalDuration, goalAchievedAt);

  const motivation = isAchieved ? 'Goal achieved!' : getGoalMotivation(currentStreak, goalDuration);

  return (
    <View style={{ paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.status.streak, letterSpacing: 0.5 }}>
          🎯 {goalDuration}-DAY GOAL
        </Text>
        <Text style={{ fontSize: 12, color: colors.text.tertiary }}>
          {isAchieved ? 'Complete!' : `${daysRemaining} days left`}
        </Text>
      </View>

      <GoalProgressBar
        progressPercentage={progressPercentage}
        streakColor={isAchieved ? colors.status.success : colors.status.streak}
        textColor={colors.background}
        trackColor={colors.border}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, fontWeight: '600' }}>
          <Text style={{ color: colors.status.streak }}>{currentStreak}</Text>
          <Text style={{ color: colors.text.tertiary }}> / {goalDuration} days</Text>
        </Text>
        <Text style={{ fontSize: 11, color: colors.text.tertiary }}>{motivation}</Text>
      </View>
    </View>
  );
}
