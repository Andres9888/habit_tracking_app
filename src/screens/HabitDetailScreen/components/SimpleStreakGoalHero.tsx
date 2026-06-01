/**
 * SimpleStreakGoalHero — current streak vs target with a progress bar.
 * Replaces the milestone-heavy StreakGoalCard inside the Goal tab.
 */
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStreakGoalData } from '../../../components/ProgressSectionConsolidated/StreakGoalCard/StreakGoalCard.hooks';
import { borderRadius } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies, fontWeights, typography } from '../../../theme/typography';
import { useStreakGoalAnimation } from './SimpleStreakGoalHero.hooks';

interface SimpleStreakGoalHeroProps {
  currentStreak: number;
  streakGoal: number;
  habitColor: string;
}

/** Oversized hero numeral — intentionally larger than any typography token. */
const STREAK_NUMBER_SIZE = 72;
const STREAK_NUMBER_LINE = 76;
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
            fontSize: STREAK_NUMBER_SIZE,
            fontWeight: fontWeights.semibold,
            letterSpacing: -2,
            lineHeight: STREAK_NUMBER_LINE,
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
          accessibilityRole='progressbar'
          accessibilityValue={{ max: 100, min: 0, now: overallPercent }}
          style={{
            backgroundColor: colors.gray[200],
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
            <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
              {percentText}%
            </Text>{' '}
            complete
          </Text>
          <Text style={{ ...typography.caption, color: colors.text.secondary }}>
            <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
              {daysText}
            </Text>{' '}
            to go
          </Text>
        </View>
      </View>
    </View>
  );
}
