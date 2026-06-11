/**
 * SimpleStreakGoalHero — current streak vs target with a progress bar.
 * Replaces the milestone-heavy StreakGoalCard inside the Goal tab.
 */
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStreakGoalData } from '../../../components/ProgressSectionConsolidated/StreakGoalCard/StreakGoalCard.hooks';
import { borderRadius } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../theme/typography';
import { useStreakGoalAnimation } from './SimpleStreakGoalHero.hooks';
import { StreakGoalNumeral } from './StreakGoalNumeral';

interface SimpleStreakGoalHeroProps {
  currentStreak: number;
  streakGoal: number;
  habitColor: string;
}

const PROGRESS_BAR_HEIGHT = 10;

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
  const { barStyle, percentText, daysText } = useStreakGoalAnimation(
    overallPercent,
    daysRemaining
  );
  const goalLabel = `${streakGoal} ${streakGoal === 1 ? 'day' : 'days'}`;

  return (
    <View>
      <StreakGoalNumeral currentStreak={currentStreak} goalLabel={goalLabel} />

      <View className='mt-5'>
        <View
          accessibilityRole='progressbar'
          accessibilityValue={{ max: 100, min: 0, now: overallPercent }}
          style={{
            backgroundColor: colors.gray[100],
            borderRadius: borderRadius.full,
            height: PROGRESS_BAR_HEIGHT,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={[{ backgroundColor: habitColor, height: '100%' }, barStyle]}
          />
        </View>
        <View className='mt-2 flex-row justify-between'>
          <Text style={{ ...typography.caption, color: colors.text.secondary }}>
            <Text
              style={{
                color: colors.text.primary,
                fontWeight: fontWeights.semibold,
              }}
            >
              {percentText}%
            </Text>{' '}
            complete
          </Text>
          <Text style={{ ...typography.caption, color: colors.text.secondary }}>
            <Text
              style={{
                color: colors.text.primary,
                fontWeight: fontWeights.semibold,
              }}
            >
              {daysText}
            </Text>{' '}
            to go
          </Text>
        </View>
      </View>
    </View>
  );
}
