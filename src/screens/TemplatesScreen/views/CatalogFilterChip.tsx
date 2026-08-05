/**
 * Single selectable chip for CatalogChipRail.
 */

import { Text, View, type LayoutChangeEvent } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import { useBrowserPalette } from '../browserPalette';
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
  const palette = useBrowserPalette();
  // Ink-pill selected state — dark pill with inverted label, matching the
  // reference catalog design.
  const chipColors = isSelected
    ? {
        backgroundColor: palette.chipActive,
        borderColor: palette.chipActive,
      }
    : {
        backgroundColor: palette.chipIdle,
        borderColor: palette.chipIdle,
      };
  const labelColor = isSelected ? palette.textInverse : palette.textSecondary;

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
