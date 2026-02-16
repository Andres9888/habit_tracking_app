/**
 * useSheetHandlers Hook
 * Handles emoji selection, search focus, and dismiss actions
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { addRecentEmoji } from '../../../utils/recentEmojis';

const SELECTION_FEEDBACK_DELAY = 300;

interface SheetActions {
  expandSheet: () => void;
  collapseSheet: () => void;
  closeSheet: () => void;
}

export function useSheetHandlers(
  onSelect: (emoji: string | null) => void,
  setIsSearchFocused: (focused: boolean) => void,
  actions: SheetActions
) {
  const [pendingEmoji, setPendingEmoji] = useState<string | null>(null);
  const selectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (selectTimerRef.current) clearTimeout(selectTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const handleSearchFocus = useCallback(
    (focused: boolean) => {
      setIsSearchFocused(focused);
      if (focused) {
        actions.expandSheet();
      } else {
        actions.collapseSheet();
      }
    },
    [setIsSearchFocused, actions.expandSheet, actions.collapseSheet]
  );

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      setPendingEmoji(emoji);
      void addRecentEmoji(emoji);
      if (selectTimerRef.current) clearTimeout(selectTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      selectTimerRef.current = setTimeout(() => {
        onSelect(emoji);
        actions.closeSheet();
        clearTimerRef.current = setTimeout(() => setPendingEmoji(null), SELECTION_FEEDBACK_DELAY);
      }, SELECTION_FEEDBACK_DELAY);
    },
    [onSelect, actions.closeSheet]
  );

  const handleNoIcon = useCallback(() => {
    onSelect(null);
    actions.closeSheet();
  }, [onSelect, actions.closeSheet]);

  return { handleEmojiSelect, handleNoIcon, handleSearchFocus, pendingEmoji };
}
