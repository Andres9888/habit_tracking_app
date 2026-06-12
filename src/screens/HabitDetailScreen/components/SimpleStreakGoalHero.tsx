/**
 * SimpleStreakGoalHero — current streak vs target with a progress bar.
 * Replaces the milestone-heavy StreakGoalCard inside the Goal tab.
 */
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useStreakGoalData } from '../../../components/ProgressSectionConsolidated/StreakGoalCard/StreakGoalCard.hooks';
import { durations, enterEasing } from '../../../theme/animations';
import { borderRadius, spacing } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../theme/typography';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
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
  const reduceMotion = useReduceMotion();
  const { overallPercent, daysRemaining } = useStreakGoalData(
    currentStreak,
    streakGoal
  );
  const { barStyle, daysText, isGoalReached, percentText, showLabels, streakText } =
    useStreakGoalAnimation(
      overallPercent,
      daysRemaining,
      currentStreak,
      streakGoal
    );
  const goalLabel = `${streakGoal} ${streakGoal === 1 ? 'day' : 'days'}`;
  const labelEnter = reduceMotion
    ? undefined
    : FadeIn.duration(durations.standard).delay(durations.progress).easing(enterEasing);

  return (
    <View>
      <StreakGoalNumeral animatedStreak={streakText} goalLabel={goalLabel} />

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
        {isGoalReached ? (
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.status.success,
              fontWeight: fontWeights.semibold,
              marginTop: spacing.sm,
              textAlign: 'center',
            }}
          >
            Goal reached — extend it?
          </Text>
        ) : showLabels ? (
          <Animated.View className='mt-2 flex-row justify-between' entering={labelEnter}>
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
              {daysText === 1 ? 'day' : 'days'} to go
            </Text>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}
