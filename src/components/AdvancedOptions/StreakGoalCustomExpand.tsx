/** Inline custom streak-day stepper (Variant B expand). */
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { chipMicroLabel } from './chipTextStyles';
import {
  clampStreakDays,
  CUSTOM_STREAK_MAX,
  CUSTOM_STREAK_MIN,
} from './streakGoal.constants';
import { StreakGoalDayField } from './StreakGoalDayField';
import { StreakGoalStepButton } from './StreakGoalStepButton';

interface Props {
  days: number;
  onDaysChange: (days: number) => void;
  onApply: () => void;
}

export function StreakGoalCustomExpand({ days, onDaysChange, onApply }: Props) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        marginTop: 10,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <Text
        style={{
          ...chipMicroLabel,
          textTransform: 'uppercase',
          color: colors.text.secondary,
          marginBottom: 8,
        }}
      >
        How many days?
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <StreakGoalStepButton
          accessibilityLabel='Decrease days'
          label='−'
          onPress={() => onDaysChange(clampStreakDays(days - 1))}
        />
        <StreakGoalDayField days={days} onDaysChange={onDaysChange} />
        <StreakGoalStepButton
          accessibilityLabel='Increase days'
          label='+'
          onPress={() => onDaysChange(clampStreakDays(days + 1))}
        />
      </View>
      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          marginTop: 10,
          lineHeight: 18,
        }}
      >
        Missing a day never breaks the goal. Range {CUSTOM_STREAK_MIN}–
        {CUSTOM_STREAK_MAX}.
      </Text>
      <AnimatedPressable
        accessibilityRole='button'
        style={{
          marginTop: 10,
          minHeight: 44,
          borderRadius: 12,
          backgroundColor: colors.primary[600],
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onApply}
      >
        <Text
          style={{
            ...typography.bodySmall,
            fontWeight: typography.button.fontWeight,
            color: colors.text.inverse,
          }}
        >
          Apply custom goal
        </Text>
      </AnimatedPressable>
    </View>
  );
}
