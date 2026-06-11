/**
 * GoalPresetChip — Single preset day-count chip for streak goal picker.
 */
import { Pressable, Text } from 'react-native';
import { useThemeColors, withAlpha } from '../../../theme';
import { typography, fontWeights } from '../../../theme/typography';

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
        backgroundColor: selected
          ? withAlpha(colors.primary[600], 0.1)
          : colors.card,
        borderColor: selected ? colors.primary[600] : colors.border,
        // Keep the recommended chip's border width constant (selected or not) so
        // toggling it in/out of selection doesn't change row height — RN counts
        // border in an element's laid-out box, and the row hugs its tallest chip.
        borderWidth: recommended ? 1.5 : 1,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          ...typography.bodySmall,
          color: selected ? colors.primary[700] : colors.text.secondary,
          fontWeight: selected ? fontWeights.bold : fontWeights.medium,
        }}
      >
        {days === 365 ? '1yr' : `${days}d`}
      </Text>
    </Pressable>
  );
}
