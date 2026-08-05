/* eslint-disable max-lines -- one compact visual with no reusable sub-surfaces */
/** DetailStrengthCard - The mock's single meter + plain-language momentum story. */
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useMemo } from 'react';
import { subDays } from 'date-fns';
import { useHabitStrengthData } from '../../../components/HabitStrengthSection/HabitStrengthSection.hooks';
import { useThemeColors } from '../../../theme';
import { durations, enterEasing } from '../../../theme/animations';
import { colors as palette } from '../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';

interface DetailStrengthCardProps {
  completedDates: Set<string>;
  habitCreatedAt: number;
  habitStrength?: number;
  isCompletedToday: boolean;
}

function strengthMeta(strength: number): string {
  if (strength >= 70) return 'Strong';
  if (strength >= 35) return 'Steady';
  return 'Building';
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DetailStrengthCard({
  completedDates,
  habitCreatedAt,
  habitStrength,
  isCompletedToday,
}: DetailStrengthCardProps) {
  const { colors, isDark } = useThemeColors();
  const { currentStrength } = useHabitStrengthData({
    completedDates,
    habitCreatedAt,
    habitStrength,
  });
  const yesterdayCompleted = useMemo(
    () => completedDates.has(formatLocalDate(subDays(new Date(), 1))),
    [completedDates]
  );
  const story = isCompletedToday
    ? 'Today’s check-in holds the line. Strength grows from consistency, not perfect weeks.'
    : yesterdayCompleted
      ? 'Your momentum is intact. Showing up today keeps the habit’s strength moving.'
      : 'A miss softens momentum a little—it does not wipe the chain. Showing up today keeps your progress intact.';

  return (
    <Animated.View
      entering={FadeIn.duration(durations.standard).easing(enterEasing)}
      style={{
        ...shadows.subtle,
        backgroundColor: isDark ? colors.card : palette.light.cardElevated,
        borderColor: colors.border,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        padding: spacing.base,
      }}
    >
      <View className='flex-row items-baseline justify-between'>
        <Text
          accessibilityRole='header'
          style={{
            ...typography.heading1,
            color: colors.text.primary,
            fontWeight: fontWeights.semibold,
          }}
        >
          Habit strength
        </Text>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.tertiary,
            fontWeight: fontWeights.semibold,
          }}
        >
          {strengthMeta(currentStrength)}
        </Text>
      </View>

      <View style={{ marginTop: spacing.base }}>
        <View
          accessibilityLabel={`Habit strength, ${currentStrength} percent`}
          accessibilityRole='progressbar'
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.full,
            borderWidth: 1,
            height: 12,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              backgroundColor: colors.primary[600],
              borderRadius: borderRadius.full,
              height: '100%',
              minWidth: 4,
              width: `${Math.max(0, Math.min(100, currentStrength))}%`,
            }}
          />
        </View>
        <View className='mt-2 flex-row justify-between'>
          {['Building', 'Steady', 'Strong'].map((label) => (
            <Text
              key={label}
              style={{
                ...typography.overline,
                color: colors.text.tertiary,
                fontSize: 10,
                letterSpacing: 0.6,
              }}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>

      <Text
        style={{
          ...typography.bodySmall,
          color: colors.text.secondary,
          fontFamily: fontFamilies.primary.text,
          lineHeight: 22,
          marginTop: spacing.base,
        }}
      >
        {story}
      </Text>
    </Animated.View>
  );
}
