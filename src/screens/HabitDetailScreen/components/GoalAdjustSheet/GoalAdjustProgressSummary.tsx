/**
 * GoalAdjustProgressSummary — Current streak vs active goal inside the adjust sheet.
 */
import { Text, View } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../../theme/typography';

interface GoalAdjustProgressSummaryProps {
  currentGoal: number;
  currentStreak: number;
  habitColor: string;
}

export function GoalAdjustProgressSummary({
  currentGoal,
  currentStreak,
  habitColor,
}: GoalAdjustProgressSummaryProps) {
  const { colors } = useThemeColors();
  const percent =
    currentGoal > 0
      ? Math.min(Math.round((currentStreak / currentGoal) * 100), 100)
      : 0;
  const remaining = Math.max(currentGoal - currentStreak, 0);

  return (
    <View
      style={{
        backgroundColor: colors.gray[50],
        borderColor: colors.border,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        marginBottom: spacing.base,
        marginTop: spacing.md,
        paddingHorizontal: spacing.md + 2,
        paddingVertical: spacing.md,
      }}
    >
      <View className='flex-row items-baseline justify-between'>
        <Text
          style={{
            ...typography.heading3,
            color: colors.text.primary,
            fontWeight: fontWeights.bold,
          }}
        >
          {currentStreak}{' '}
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.text.secondary,
              fontWeight: fontWeights.medium,
            }}
          >
            / {currentGoal} days
          </Text>
        </Text>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.secondary,
            fontWeight: fontWeights.medium,
          }}
        >
          {remaining} to go
        </Text>
      </View>
      <View
        accessibilityRole='progressbar'
        accessibilityValue={{ max: 100, min: 0, now: percent }}
        style={{
          backgroundColor: colors.border,
          borderRadius: borderRadius.full,
          height: spacing.sm + 2,
          marginTop: spacing.sm + 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            backgroundColor: habitColor,
            borderRadius: borderRadius.full,
            height: '100%',
            width: `${percent}%`,
          }}
        />
      </View>
    </View>
  );
}
