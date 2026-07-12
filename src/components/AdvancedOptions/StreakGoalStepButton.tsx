/** ± stepper button for custom streak days. */
import { Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { chipBase } from './pressChipStyles';
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
  const { colors } = useThemeColors();
  const { pressed, pressProps } = usePressed();
  const base = chipBase({
    border: colors.border,
    background: pressed ? colors.gray[100] : colors.card,
  });
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      {...pressProps}
      style={{
        ...base,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}
    >
      <Text
        style={{
          ...typography.heading2,
          color: colors.text.primary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
