/**
 * SimpleStreakGoalHero — current streak vs target with a progress bar.
 * Replaces the milestone-heavy StreakGoalCard inside the Goal tab.
 */
import { Text, View } from 'react-native';
import { useStreakGoalData } from '../../../components/ProgressSectionConsolidated/StreakGoalCard/StreakGoalCard.hooks';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../../theme/typography';

interface SimpleStreakGoalHeroProps {
  currentStreak: number;
  streakGoal: number;
  habitColor: string;
}

export function SimpleStreakGoalHero({
  currentStreak,
  streakGoal,
  habitColor,
}: SimpleStreakGoalHeroProps) {
  const { colors } = useThemeColors();
  const { overallPercent, daysRemaining } = useStreakGoalData(
    currentStreak,
    streakGoal
  );
  const goalLabel = `${streakGoal} ${streakGoal === 1 ? 'day' : 'days'}`;

  return (
    <View>
      <View className='items-center'>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.secondary,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
          }}
        >
          Current streak
        </Text>
        <Text
          style={{
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 72,
            fontWeight: fontWeights.semibold,
            letterSpacing: -2,
            lineHeight: 76,
            marginTop: 6,
          }}
        >
          {currentStreak}
        </Text>
        <Text
          style={{
            ...typography.body,
            color: colors.text.secondary,
            marginTop: 8,
          }}
        >
          of{' '}
          <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
            {goalLabel}
          </Text>
        </Text>
      </View>

      <View className='mt-5'>
        <View
          style={{
            backgroundColor: colors.gray[200],
            borderRadius: borderRadius.full,
            height: 10,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              backgroundColor: habitColor,
              height: '100%',
              width: `${overallPercent}%`,
            }}
          />
        </View>
        <View className='mt-2 flex-row justify-between'>
          <Text style={{ ...typography.caption, color: colors.text.secondary }}>
            <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
              {overallPercent}%
            </Text>{' '}
            complete
          </Text>
          <Text style={{ ...typography.caption, color: colors.text.secondary }}>
            <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
              {daysRemaining}
            </Text>{' '}
            to go
          </Text>
        </View>
      </View>
    </View>
  );
}
