
import type { RefObject } from 'react';
import type { View } from 'react-native';
import { AccessibilityInfo, findNodeHandle } from 'react-native';
import { useCallback } from 'react';

import { FOCUS_RETURN_DELAY_MS } from './EmojiPicker.constants';
import { addRecentEmoji } from '../../utils/recentEmojis';

interface UseEmojiPickerHandlersOptions {
  onClose: () => void;
  onSelect: (emoji: string | null) => void;
  triggerRef?: RefObject<View>;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
}

export const useEmojiPickerHandlers = ({
  onClose,
  onSelect,
  triggerRef,
  setSelectedCategory,
  setSearchQuery,
  setDebouncedQuery,
}: UseEmojiPickerHandlersOptions) => {
  const returnFocusToTrigger = useCallback(() => {
    if (triggerRef?.current) {
      const reactTag = findNodeHandle(triggerRef.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, [triggerRef]);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(returnFocusToTrigger, FOCUS_RETURN_DELAY_MS);
  }, [onClose, returnFocusToTrigger]);

  const handleEmojiSelect = useCallback(
    async (emoji: string) => {
      await addRecentEmoji(emoji);
      onSelect(emoji);
      handleClose();
    },
    [onSelect, handleClose]
  );

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      setSearchQuery('');
      setDebouncedQuery('');
    },
    [setSelectedCategory, setSearchQuery, setDebouncedQuery]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, [setSearchQuery, setDebouncedQuery]);

  const handleNoIconSelect = useCallback(() => {
    onSelect(null);
    handleClose();
  }, [onSelect, handleClose]);

  return {
    handleCategorySelect,
    handleClearSearch,
    handleClose,
    handleEmojiSelect,
    handleNoIconSelect,
  };
};
