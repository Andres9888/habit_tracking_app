/** DetailHero - Momentum-first hero card: name row, streak centerpiece,
 *  best pill + encouragement, complete bar. */
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { durations, enterEasing } from '../../../theme/animations';
import { colors as palette } from '../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { Habit } from '../HabitDetailScreen.types';
import { DetailCompleteButton } from './DetailCompleteButton';
import { DetailHeroHeaderRow } from './DetailHeroHeaderRow';
import { DetailHeroMomentum } from './DetailHeroMomentum';
import { DetailHeroStreakHero } from './DetailHeroStreakHero';

interface DetailHeroProps {
  habit: Habit;
  isCompletedToday?: boolean;
  isToggling?: boolean;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function DetailHero({
  habit,
  isCompletedToday = false,
  isToggling = false,
  totalCompletions,
  onDayPress,
}: DetailHeroProps) {
  const { colors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const bestStreak = habit.bestStreak ?? 0;
  const currentStreak = habit.currentStreak ?? 0;

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.duration(durations.enter).easing(enterEasing)
      }
      className='overflow-hidden'
      style={{
        backgroundColor: isDark ? colors.card : palette.light.cardElevated,
        borderColor: colors.border,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        marginHorizontal: spacing.base + spacing.xs,
        marginTop: spacing.sm,
        ...shadows.subtle,
      }}
    >
      <DetailHeroHeaderRow habit={habit} isCompletedToday={isCompletedToday} />

      <View style={{ paddingHorizontal: spacing.base }}>
        <DetailHeroStreakHero
          bestStreak={bestStreak}
          currentStreak={currentStreak}
        />
        <DetailHeroMomentum
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          totalCompletions={totalCompletions}
        />
      </View>

      <View
        style={{
          paddingBottom: spacing.base,
          paddingHorizontal: spacing.base,
          paddingTop: spacing.base,
        }}
      >
        <DetailCompleteButton
          disabled={isToggling}
          isCompletedToday={isCompletedToday}
          onPress={() => onDayPress(getLocalDateString(), isCompletedToday)}
        />
      </View>
    </Animated.View>
  );
}
