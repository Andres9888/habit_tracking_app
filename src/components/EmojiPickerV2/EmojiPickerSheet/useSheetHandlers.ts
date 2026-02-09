/**
 * useSheetHandlers Hook
 * Handles emoji selection, search focus, and dismiss actions
 */

import { useCallback, useState } from 'react';
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
      setTimeout(() => {
        onSelect(emoji);
        actions.closeSheet();
        setTimeout(() => setPendingEmoji(null), SELECTION_FEEDBACK_DELAY);
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
