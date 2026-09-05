/** ± step button inside the custom streak-goal stepper (44pt target). */
import { Pressable, Text } from 'react-native';
import { typography } from '@/theme/typography';
import { usePanelTokens } from './panel/panelTokens';
import { usePressed } from './usePressed';

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
  const { pressed, pressProps } = usePressed();
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      {...pressProps}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.chipRestBg,
        borderWidth: 1,
        borderColor: t.chipRestBorder,
        opacity: pressed ? 0.8 : 1,
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
    </Pressable>
  );
}
