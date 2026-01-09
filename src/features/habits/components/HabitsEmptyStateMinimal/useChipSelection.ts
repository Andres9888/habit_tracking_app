import { useCallback, useRef, useState } from 'react';
import { useTimeBasedChipAnalytics } from './analytics';
import type { SuggestionChip } from './types';
import { getTimeBasedChips } from './utils';

export function useChipSelection() {
  const analytics = useTimeBasedChipAnalytics();
  const displayTimestampRef = useRef<number>(Date.now());
  const selectedChipDataRef = useRef<SuggestionChip | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [selectedChipIndex, setSelectedChipIndex] = useState<number | null>(
    null
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleChipSelect = useCallback(
    (index: number, chip: SuggestionChip) => {
      if (selectedChipIndex === index) {
        setSelectedChipIndex(null);
        setSelectedEmoji(null);
        setInputValue('');
        selectedChipDataRef.current = null;
      } else {
        setSelectedChipIndex(index);
        setSelectedEmoji(chip.emoji);
        setInputValue(chip.fullName);
        selectedChipDataRef.current = chip;
      }
    },
    [selectedChipIndex]
  );

  const handleInputChange = useCallback(
    (text: string) => {
      setInputValue(text);
      if (selectedChipIndex !== null) {
        setSelectedChipIndex(null);
        setSelectedEmoji(null);
        selectedChipDataRef.current = null;

        if (text.trim().length > 0) {
          const chips = getTimeBasedChips();
          analytics.trackManualInputAfterChipView(text, chips);
        }
      }
    },
    [selectedChipIndex, analytics]
  );

  const resetSelection = useCallback(() => {
    setInputValue('');
    setSelectedChipIndex(null);
    setSelectedEmoji(null);
    selectedChipDataRef.current = null;
  }, []);

  const trackChipConversion = useCallback(
    (chipIndex: number) => {
      if (selectedChipDataRef.current) {
        analytics.trackChipConvertedToHabit(
          selectedChipDataRef.current,
          chipIndex,
          displayTimestampRef.current
        );
      }
    },
    [analytics]
  );

  return {
    handleChipSelect,
    handleInputChange,
    inputValue,
    resetSelection,
    selectedChipIndex,
    selectedEmoji,
    setInputValue,
    trackChipConversion,
  };
}
