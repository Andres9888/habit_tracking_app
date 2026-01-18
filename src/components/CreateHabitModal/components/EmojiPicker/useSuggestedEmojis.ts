/**
 * useSuggestedEmojis Hook
 * Manages debounced emoji suggestions based on habit name
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { suggestEmojisForHabitName } from '../../../../utils/emojiKeywords';
import { DEFAULT_EMOJIS, SUGGESTION_DEBOUNCE_MS } from './constants';

export function useSuggestedEmojis(habitName: string | undefined) {
  const [debouncedHabitName, setDebouncedHabitName] = useState(habitName || '');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce habit name changes to prevent jittery suggestion updates
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedHabitName(habitName || '');
    }, SUGGESTION_DEBOUNCE_MS);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [habitName]);

  // Compute suggested emojis (9 for 5-4 triangle layout)
  const suggestedEmojis = useMemo(() => {
    if (!debouncedHabitName.trim()) {
      return DEFAULT_EMOJIS;
    }
    const suggestions = suggestEmojisForHabitName(debouncedHabitName, 9);
    // If we have fewer than 9 suggestions, pad with defaults
    if (suggestions.length < 9) {
      const remaining = DEFAULT_EMOJIS.filter((e) => !suggestions.includes(e));
      return [...suggestions, ...remaining].slice(0, 9);
    }
    return suggestions;
  }, [debouncedHabitName]);

  return { debouncedHabitName, suggestedEmojis };
}
