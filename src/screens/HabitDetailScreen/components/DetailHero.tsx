/** DetailHero — OD redesign: header, path ring, momentum, week strip, CTA. */
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
import { DetailHeroWeekStrip } from './DetailHeroWeekStrip';
import { useDetailHeroMetrics } from './useDetailHeroMetrics';

interface DetailHeroProps {
  completedDates?: Set<string>;
  habit: Habit;
  isCompletedToday?: boolean;
  isToggling?: boolean;
  totalCompletions: number;
  onCompletePress: () => void;
}

const EMPTY_COMPLETED_DATES = new Set<string>();

export function DetailHero({
  completedDates = EMPTY_COMPLETED_DATES,
  habit,
  isCompletedToday = false,
  isToggling = false,
  totalCompletions,
  onCompletePress,
}: DetailHeroProps) {
  const { colors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const bestStreak = habit.bestStreak ?? 0;
  const currentStreak = habit.currentStreak ?? 0;
  const today = getLocalDateString();
  const { rate30Day, weekDays } = useDetailHeroMetrics(
    completedDates,
    habit,
    today
  );
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
          glow={isCompletedToday}
        />
        <DetailHeroMomentum
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          rate30Day={rate30Day}
          totalCompletions={totalCompletions}
        />
        <DetailHeroWeekStrip days={weekDays} />
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
          onPress={onCompletePress}
        />
      </View>
    </Animated.View>
  );
}
