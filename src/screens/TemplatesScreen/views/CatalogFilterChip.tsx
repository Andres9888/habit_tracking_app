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
  /** Match count for the active search. Undefined while browsing idle. */
  count?: number;
  isSelected: boolean;
  label: string;
  onLayout: (chipId: string) => (event: LayoutChangeEvent) => void;
  onSelect: (chipId: string) => void;
}

export function CatalogFilterChip({
  chipId,
  count,
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
  const hasCount = count !== undefined;
  // Zero-match chips stay in the rail rather than unmounting — the rail must
  // not reflow mid-search — but dim to read as unavailable.
  const isEmptyMatch = hasCount && count === 0;

  return (
    <View onLayout={onLayout(chipId)}>
      <AnimatedPressable
        accessibilityLabel={hasCount ? `${label}, ${count} matches` : label}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        hitSlop={0}
        style={[s.chip, chipColors, isEmptyMatch && s.chipEmpty]}
        onPress={() => {
          void triggerHaptic('selection');
          onSelect(chipId);
        }}
      >
        <Text style={[s.chipLabel, { color: labelColor }]}>
          {label}
          {hasCount ? (
            <Text style={s.chipCount}>{`  ${count}`}</Text>
          ) : null}
        </Text>
      </AnimatedPressable>
    </View>
  );
}
