/**
 * SuggestionChips - Tappable habit suggestion pills
 *
 * Features:
 * - Pyramid layout (3-2-1 formation)
 * - Selection state with emerald highlight
 * - Staggered entrance animation (50ms between each chip)
 */

import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { useTimeBasedChipAnalytics } from './analytics';
import { CHIP_STAGGER } from './animations';
import { Chip } from './Chip';
import type { SuggestionChip, SuggestionChipsProps } from './types';
import { getTimeBasedChips } from './utils';

export function SuggestionChips({
  selectedIndex,
  onSelect,
}: SuggestionChipsProps) {
  const chips = getTimeBasedChips();
  const analytics = useTimeBasedChipAnalytics();
  const displayTimestampRef = useRef<number>(0);
  const previousSelectedChipRef = useRef<{
    chip: SuggestionChip;
    index: number;
  } | null>(null);

  useEffect(() => {
    displayTimestampRef.current = Date.now();
    analytics.trackChipsDisplayed(chips);
  }, [chips, analytics]);

  const handleChipSelect = useCallback(
    (index: number, chip: SuggestionChip) => {
      if (previousSelectedChipRef.current && selectedIndex !== null) {
        analytics.trackChipDeselected(
          previousSelectedChipRef.current.chip,
          previousSelectedChipRef.current.index
        );
      }

      analytics.trackChipSelected(chip, index);
      previousSelectedChipRef.current = { chip, index };
      onSelect(index, chip);
    },
    [analytics, onSelect, selectedIndex]
  );

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {chips.map((chip, index) => (
        <Chip
          key={chip.label}
          chip={chip}
          index={index}
          isSelected={selectedIndex === index}
          staggerDelay={index * CHIP_STAGGER.delay}
          onPress={() => handleChipSelect(index, chip)}
        />
      ))}
    </View>
  );
}
