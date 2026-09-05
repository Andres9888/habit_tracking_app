/** ± step button inside the custom streak-goal stepper (44pt target). */
import { Text } from 'react-native';
import { typography } from '@/theme/typography';
import { usePanelTokens } from './panel/panelTokens';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface Props {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}

export function StreakGoalStepButton({
  label,
  accessibilityLabel,
  onPress,
}: Props) {
  const t = usePanelTokens();
  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      // Already a 44pt target; extra slop would reach into its twin.
      hitSlop={0}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.chipRestBg,
        borderWidth: 1,
        borderColor: t.chipRestBorder,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          ...typography.bodyBold,
          fontSize: 20,
          lineHeight: 24,
          color: t.textPrimary,
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
