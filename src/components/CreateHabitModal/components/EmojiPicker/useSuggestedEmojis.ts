/**
 * useSuggestedEmojis Hook
 * Manages debounced emoji suggestions based on habit name
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { suggestEmojisForHabitName } from '../../../../utils/emojiKeywords';
import { DEFAULT_EMOJIS, SUGGESTION_DEBOUNCE_MS } from './constants';

export function useSuggestedEmojis(
  habitName: string | undefined,
  selectedEmoji?: string | null,
  options?: { isLocked?: boolean }
) {
  const isLocked = options?.isLocked ?? false;
  const [debouncedHabitName, setDebouncedHabitName] = useState(habitName || '');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // First non-empty habitName lands instantly (no debounce). This avoids a
  // visible chip-shuffle ~300ms after Edit opens, when habit data arrives
  // after the EmojiPicker has already mounted with an empty name.
  const hasInitializedRef = useRef(Boolean(habitName));

  useEffect(() => {
    if (isLocked) return;
    if (!hasInitializedRef.current && habitName) {
      hasInitializedRef.current = true;
      setDebouncedHabitName(habitName);
      return;
    }
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedHabitName(habitName || '');
    }, SUGGESTION_DEBOUNCE_MS);
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [habitName, isLocked]);

  const suggestedEmojis = useMemo(() => {
    let emojis: string[];
    if (debouncedHabitName.trim()) {
      const suggestions = suggestEmojisForHabitName(debouncedHabitName, 9);
      if (suggestions.length < 9) {
        const remaining = DEFAULT_EMOJIS.filter(
          (e) => !suggestions.includes(e)
        );
        emojis = [...suggestions, ...remaining].slice(0, 9);
      } else {
        emojis = suggestions;
      }
    } else {
      emojis = [...DEFAULT_EMOJIS];
    }
    // Inject selected emoji into middle of first row (index 2 in 5-4 triangle)
    if (selectedEmoji && !emojis.includes(selectedEmoji)) {
      const firstRowMiddle = 2;
      emojis[firstRowMiddle] = selectedEmoji;
    }
    return emojis;
  }, [debouncedHabitName, selectedEmoji]);

  return { debouncedHabitName, suggestedEmojis };
}
