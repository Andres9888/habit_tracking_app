/**
 * Single selectable chip for CatalogChipRail.
 */

import { Text, View, type LayoutChangeEvent } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles as s } from './CatalogChipRail.styles';

interface CatalogFilterChipProps {
  chipId: string;
  isSelected: boolean;
  label: string;
  onLayout: (chipId: string) => (event: LayoutChangeEvent) => void;
  onSelect: (chipId: string) => void;
}

export function CatalogFilterChip({
  chipId,
  isSelected,
  label,
  onLayout,
  onSelect,
}: CatalogFilterChipProps) {
  const { colors } = useThemeColors();
  // Ink-pill selected state — dark pill with inverted label, matching the
  // reference catalog design.
  const chipColors = isSelected
    ? { backgroundColor: colors.text.primary, borderColor: colors.text.primary }
    : { backgroundColor: colors.card, borderColor: colors.border };
  const labelColor = isSelected ? colors.text.inverse : colors.text.secondary;

  return (
    <View onLayout={onLayout(chipId)}>
      <AnimatedPressable
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        hitSlop={0}
        style={[s.chip, chipColors]}
        onPress={() => {
          void triggerHaptic('selection');
          onSelect(chipId);
        }}
      >
        <Text style={[s.chipLabel, { color: labelColor }]}>{label}</Text>
      </AnimatedPressable>
    </View>
  );
}
