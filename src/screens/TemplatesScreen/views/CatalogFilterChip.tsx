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

  return (
    <View onLayout={onLayout(chipId)}>
      <AnimatedPressable
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        hitSlop={0}
        style={[
          s.chip,
          { backgroundColor: colors.card, borderColor: colors.border },
          isSelected ? s.chipSelected : null,
        ]}
        onPress={() => {
          void triggerHaptic('selection');
          onSelect(chipId);
        }}
      >
        <Text
          style={[
            s.chipLabel,
            { color: colors.text.secondary },
            isSelected ? s.chipLabelSelected : null,
          ]}
        >
          {label}
        </Text>
      </AnimatedPressable>
    </View>
  );
}
