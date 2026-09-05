/** Live custom streak-day stepper — every step commits, no Apply button. */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { usePanelTokens } from './panel/panelTokens';
import { clampStreakDays } from './streakGoal.constants';
import { StreakGoalStepButton } from './StreakGoalStepButton';

interface Props {
  days: number;
  onDaysChange: (days: number) => void;
}

export function StreakGoalStepper({ days, onDaysChange }: Props) {
  const t = usePanelTokens();
  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: t.chipRestBorder,
        backgroundColor: t.chipRestBg,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          fontSize: 13,
          fontWeight: fontWeights.medium,
          color: t.textSecondary,
          marginBottom: 8,
        }}
      >
        Custom target
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <StreakGoalStepButton
          accessibilityLabel='Decrease days'
          label='−'
          onPress={() => onDaysChange(clampStreakDays(days - 1))}
        />
        <Text
          style={{
            ...typography.bodyBold,
            fontSize: 17,
            color: t.textPrimary,
            fontVariant: ['tabular-nums'],
          }}
        >
          {days}
          <Text style={{ fontSize: 12, fontWeight: fontWeights.semibold }}>
            {' days'}
          </Text>
        </Text>
        <StreakGoalStepButton
          accessibilityLabel='Increase days'
          label='+'
          onPress={() => onDaysChange(clampStreakDays(days + 1))}
        />
      </View>
    </View>
  );
}
