import { useCallback, useRef, useState } from 'react';
import { useTimeBasedChipAnalytics } from './analytics';
import type { SuggestionChip } from './types';
import { getTimeBasedChips } from './utils';
import { useTypingAnimation } from './useTypingAnimation';

export function useChipSelection() {
  const analytics = useTimeBasedChipAnalytics();
  const displayTimestampRef = useRef<number>(Date.now());
  const selectedChipDataRef = useRef<SuggestionChip | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [selectedChipIndex, setSelectedChipIndex] = useState<number | null>(
    null
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const { typeText, clearTimeouts } = useTypingAnimation({
    characterDelay: 30,
    onTextUpdate: setInputValue,
  });

  const handleChipSelect = useCallback(
    (index: number, chip: SuggestionChip) => {
      if (selectedChipIndex === index) {
        setSelectedChipIndex(null);
        setSelectedEmoji(null);
        clearTimeouts();
        setInputValue('');
        selectedChipDataRef.current = null;
      } else {
        setSelectedChipIndex(index);
        setSelectedEmoji(chip.emoji);
        typeText(chip.fullName);
        selectedChipDataRef.current = chip;
      }
    },
    [selectedChipIndex, typeText, clearTimeouts]
  );

  const handleInputChange = useCallback(
    (text: string) => {
      clearTimeouts();
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
    [selectedChipIndex, analytics, clearTimeouts]
  );

  const resetSelection = useCallback(() => {
    clearTimeouts();
    setInputValue('');
    setSelectedChipIndex(null);
    setSelectedEmoji(null);
    selectedChipDataRef.current = null;
  }, [clearTimeouts]);

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
