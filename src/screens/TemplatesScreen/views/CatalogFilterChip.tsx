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
  /**
   * Swaps the solid ink pill for an outline when selected. For "All", which
   * is current far more often than any category — see CatalogChipRail.
   */
  quietSelected?: boolean;
  /** Emoji-free label for screen readers. Falls back to `label`. */
  spokenLabel?: string;
  onLayout: (chipId: string) => (event: LayoutChangeEvent) => void;
  onSelect: (chipId: string) => void;
}

export function CatalogFilterChip({
  chipId,
  count,
  isSelected,
  label,
  quietSelected,
  spokenLabel,
  onLayout,
  onSelect,
}: CatalogFilterChipProps) {
  const palette = useBrowserPalette();
  // Three paint tiers, all saying the same thing at different volumes, so a
  // selected chip never looks idle: solid ink pill for a chosen category,
  // ink outline over the idle fill for a quiet selection, flat idle for the
  // rest. Painting a selected chip as idle was tried and reverted — it left
  // the rail with nothing marked, which reads as unloaded rather than
  // unfiltered, and it let the zero-match dimming below make the current
  // view look disabled.
  const chipColors = isSelected
    ? {
        backgroundColor: quietSelected ? palette.chipIdle : palette.chipActive,
        borderColor: palette.chipActive,
      }
    : {
        backgroundColor: palette.chipIdle,
        borderColor: palette.chipIdle,
      };
  const labelColor = isSelected
    ? quietSelected
      ? palette.textPrimary
      : palette.textInverse
    : palette.textSecondary;
  const hasCount = count !== undefined;
  // Zero-match chips stay in the rail rather than unmounting — the rail must
  // not reflow mid-search — but dim to read as unavailable. Never the
  // selected chip: whatever the user is currently looking at must not render
  // as disabled, and a zero-match category is still tappable.
  const isEmptyMatch = hasCount && count === 0 && !isSelected;
  const a11yLabel = spokenLabel ?? label;

  return (
    <View onLayout={onLayout(chipId)}>
      <AnimatedPressable
        accessibilityLabel={
          hasCount
            ? `${a11yLabel}, ${count} ${count === 1 ? 'match' : 'matches'}`
            : a11yLabel
        }
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
          {hasCount ? <Text style={s.chipCount}>{`  ${count}`}</Text> : null}
        </Text>
      </AnimatedPressable>
    </View>
  );
}
