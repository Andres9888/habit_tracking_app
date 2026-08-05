/**
 * GoalContextLine — Explains the selected preset relative to the current streak.
 */
import { Text, View } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../../theme/typography';
import { goalLabelFor, RECOMMENDED_GOAL } from './GoalAdjustSheet.hooks';

interface GoalContextLineProps {
  currentStreak: number;
  habitColor: string;
  selected: number;
}

export function getGoalContextCopy(currentStreak: number, selected: number) {
  const label = goalLabelFor(selected);

  if (selected > 0 && currentStreak >= selected) {
    return {
      detail: `At ${currentStreak} days, a ${label} goal completes immediately.`,
      emphasis: "You've already passed this.",
      warn: true,
    };
  }

  const remaining = selected - currentStreak;

  if (selected === RECOMMENDED_GOAL) {
    return {
      detail: `You're ${currentStreak} days in — ${remaining} to go at this goal.`,
      emphasis: 'Science-backed habit window.',
      warn: false,
    };
  }

  return {
    detail: `You're ${currentStreak} days in — ${remaining} day${remaining === 1 ? '' : 's'} remaining.`,
    emphasis: `${label} target.`,
    warn: false,
  };
}

export function GoalContextLine({
  currentStreak,
  habitColor,
  selected,
}: GoalContextLineProps) {
  const { colors } = useThemeColors();
  const copy = getGoalContextCopy(currentStreak, selected);
  const accent = copy.warn ? colors.status.warning : habitColor;
  const background = copy.warn ? colors.status.warningLight : colors.gray[50];

  return (
    <View
      style={{
        backgroundColor: background,
        borderLeftColor: accent,
        borderLeftWidth: 3,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.base,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
      }}
    >
      <Text
        style={{
          ...typography.bodySmall,
          color: colors.text.secondary,
          lineHeight: 20,
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontWeight: fontWeights.semibold,
          }}
        >
          {copy.emphasis}
        </Text>{' '}
        {copy.detail}
      </Text>
    </View>
  );
}
