
import type { RefObject } from 'react';
import type { View } from 'react-native';

import { useEmojiPickerHandlers } from './useEmojiPickerHandlers';
import { useEmojiPickerState } from './useEmojiPickerState';

interface UseEmojiPickerOptions {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string | null) => void;
  triggerRef?: RefObject<View>;
  habitName?: string;
}

export const useEmojiPicker = ({
  visible,
  onClose,
  onSelect,
  triggerRef,
  habitName,
}: UseEmojiPickerOptions) => {
  const state = useEmojiPickerState({ habitName, visible });

  const handlers = useEmojiPickerHandlers({
    onClose,
    onSelect,
    setDebouncedQuery: state.setDebouncedQuery,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategory: state.setSelectedCategory,
    triggerRef,
  });

  return {
    handlers: {
      ...handlers,
      setSearchQuery: state.setSearchQuery,
    },
    state: {
      currentCategoryName: state.currentCategoryName,
      displayedEmojis: state.displayedEmojis,
      isSearching: state.isSearching,
      recentEmojis: state.recentEmojis,
      searchQuery: state.searchQuery,
      selectedCategory: state.selectedCategory,
      suggestedEmojis: state.suggestedEmojis,
    },
  };
};
