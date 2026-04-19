/**
 * GoalPresetChip — Single preset day-count chip for streak goal picker.
 */
import { Pressable, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';

interface GoalPresetChipProps {
  days: number;
  selected: boolean;
  recommended: boolean;
  onPress: () => void;
}

export function GoalPresetChip({
  days,
  selected,
  recommended,
  onPress,
}: GoalPresetChipProps) {
  const { colors } = useThemeColors();
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ selected }}
      className='rounded-full px-4 py-2'
      style={{
        backgroundColor: selected ? colors.status.streakLight : colors.card,
        borderColor: selected ? colors.status.streak : colors.border,
        borderWidth: recommended && !selected ? 1.5 : 1,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          ...typography.bodySmall,
          color: selected ? colors.status.streakText : colors.text.secondary,
          fontWeight: selected ? '700' : '500',
        }}
      >
        {days === 365 ? '1yr' : `${days}d`}
      </Text>
    </Pressable>
  );
}
