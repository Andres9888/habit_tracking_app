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
   * Paints the chip idle even while selected, without touching what it
   * reports to assistive tech. For "All", which is the absence of a filter
   * rather than a filter — see CatalogChipRail.
   */
  mutedWhenSelected?: boolean;
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
  mutedWhenSelected,
  spokenLabel,
  onLayout,
  onSelect,
}: CatalogFilterChipProps) {
  const palette = useBrowserPalette();
  // Ink-pill selected state — dark pill with inverted label, matching the
  // reference catalog design. Paint and semantics deliberately diverge for
  // muted chips: they stay visually idle but keep reporting their true
  // selected state below, so VoiceOver still describes the rail correctly.
  const showsSelected = isSelected && !mutedWhenSelected;
  const chipColors = showsSelected
    ? {
        backgroundColor: palette.chipActive,
        borderColor: palette.chipActive,
      }
    : {
        backgroundColor: palette.chipIdle,
        borderColor: palette.chipIdle,
      };
  const labelColor = showsSelected
    ? palette.textInverse
    : palette.textSecondary;
  const hasCount = count !== undefined;
  // Zero-match chips stay in the rail rather than unmounting — the rail must
  // not reflow mid-search — but dim to read as unavailable.
  const isEmptyMatch = hasCount && count === 0;
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
