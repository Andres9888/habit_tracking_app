/**
 * DetailHero - streak-forward hero (After redesign). The streak numeral is the
 * protagonist: icon + name row, "CURRENT STREAK" kicker, big gold numeral 🔥,
 * then best/total + journey line. Replaces the old 3-up stat band.
 */
import { Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { colors as palette } from '../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../../theme/typography';
import type { Habit } from '../HabitDetailScreen.types';
import { getHabitDisplayName } from './DetailHero.utils';

interface DetailHeroProps {
  daysTracking?: number;
  habit: Habit;
  isCompletedToday?: boolean;
  totalCompletions: number;
}

const ENTERING = FadeInDown.duration(280)
  .delay(100)
  .easing(Easing.out(Easing.cubic));

export function DetailHero({
  daysTracking = 0,
  habit,
  totalCompletions,
}: DetailHeroProps) {
  const { colors, isDark } = useThemeColors();
  const name = getHabitDisplayName(habit);
  const streak = habit.currentStreak ?? 0;

  return (
    <Animated.View
      className='items-center'
      entering={ENTERING}
      style={{
        backgroundColor: isDark ? colors.card : palette.light.surfaceMuted,
        borderColor: colors.border,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        marginHorizontal: spacing.base + spacing.xs,
        marginTop: spacing.sm,
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.lg,
        ...shadows.card,
      }}
    >
      <View className='flex-row items-center' style={{ gap: spacing.sm }}>
        {habit.icon ? (
          <View
            accessibilityLabel={`Habit icon: ${habit.icon}`}
            className='items-center justify-center'
            style={{
              backgroundColor: habit.color ?? colors.primary[100],
              borderRadius: borderRadius.medium,
              height: 44,
              width: 44,
            }}
          >
            <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
          </View>
        ) : null}
        <Text
          accessibilityRole='header'
          numberOfLines={1}
          style={{
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 22,
            fontWeight: fontWeights.bold,
            letterSpacing: -0.3,
          }}
        >
          {name}
        </Text>
      </View>

      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.5,
          marginTop: spacing.base,
          textTransform: 'uppercase',
        }}
      >
        Current streak
      </Text>

      <View className='flex-row items-baseline' style={{ gap: spacing.sm }}>
        <Text
          style={{
            color: colors.status.streak,
            fontFamily: fontFamilies.primary.display,
            fontSize: 60,
            fontWeight: fontWeights.semibold,
            letterSpacing: -2,
          }}
        >
          {streak}
        </Text>
        <Text style={{ fontSize: 24 }}>🔥</Text>
      </View>

      <Text
        style={{
          ...typography.bodySmall,
          color: colors.text.secondary,
          marginTop: spacing.xs + 2,
        }}
      >
        best{' '}
        <Text style={{ color: colors.text.primary, fontWeight: fontWeights.bold }}>
          {habit.bestStreak ?? 0}
        </Text>{' '}
        · {totalCompletions} total
      </Text>

      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          marginTop: spacing.sm,
        }}
      >
        Day {daysTracking + 1} of your journey 🔗
      </Text>
    </Animated.View>
  );
}
