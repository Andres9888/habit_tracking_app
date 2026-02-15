/**
 * SuggestionChips - Tappable habit suggestion pills
 *
 * Features:
 * - Pyramid layout (3-2-1 formation)
 * - Selection state with emerald highlight
 * - Staggered entrance animation (50ms between each chip)
 */

import { View } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';

import type { SuggestionChip, SuggestionChipsProps } from './types';
import { CHIP_STAGGER } from './animations';
import { Chip } from './Chip';
import { getTimeBasedChips } from './utils';
import { useTimeBasedChipAnalytics } from './analytics';

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

  const row1 = chips.slice(0, 3);
  const row2 = chips.slice(3, 5);
  const row3 = chips.slice(5, 6);

  const rowStyle = {
    flexDirection: 'row' as const,
    gap: 6,
    justifyContent: 'center' as const,
  };

  return (
    <View style={{ alignItems: 'center', gap: 6, width: '100%' }}>
      <View style={rowStyle}>
        {row1.map((chip, i) => (
          <Chip
            key={chip.label}
            chip={chip}
            index={i}
            isSelected={selectedIndex === i}
            staggerDelay={i * CHIP_STAGGER.delay}
            onPress={() => handleChipSelect(i, chip)}
          />
        ))}
      </View>

      <View style={rowStyle}>
        {row2.map((chip, i) => {
          const index = i + 3;
          return (
            <Chip
              key={chip.label}
              chip={chip}
              index={index}
              isSelected={selectedIndex === index}
              staggerDelay={index * CHIP_STAGGER.delay}
              onPress={() => handleChipSelect(index, chip)}
            />
          );
        })}
      </View>

      <View style={{ ...rowStyle, flexWrap: 'wrap', gap: 8 }}>
        {row3.map((chip, i) => {
          const index = i + 5;
          return (
            <Chip
              key={chip.label}
              chip={chip}
              index={index}
              isSelected={selectedIndex === index}
              staggerDelay={index * CHIP_STAGGER.delay}
              onPress={() => handleChipSelect(index, chip)}
            />
          );
        })}
      </View>
    </View>
  );
}
