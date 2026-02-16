import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllEmojis } from '../../utils/emojiData';
import { HABIT_CATEGORIES } from '../../constants/habitEmojis';
import {
  searchEmojisByKeyword,
  suggestEmojisForHabitName,
} from '../../utils/emojiKeywords';
import { getRecentEmojis } from '../../utils/recentEmojis';
import { SEARCH_DEBOUNCE_MS } from './EmojiPicker.constants';

interface UseEmojiPickerStateOptions {
  visible: boolean;
  habitName?: string;
}

export const useEmojiPickerState = ({
  visible,
  habitName,
}: UseEmojiPickerStateOptions) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('fitness');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const suggestedEmojis = useMemo(() => {
    if (!habitName?.trim()) return [];
    return suggestEmojisForHabitName(habitName, 5);
  }, [habitName]);

  useEffect(() => {
    if (visible) {
      void getRecentEmojis()
        .then(setRecentEmojis)
        .catch((error) => {
          if (__DEV__) console.warn('Error loading recent emojis:', error);
          setRecentEmojis([]);
        });
    }
  }, [visible]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const allEmojis = useMemo(() => getAllEmojis(), []);

  const displayedEmojis = useMemo(() => {
    if (debouncedQuery.trim()) {
      return searchEmojisByKeyword(debouncedQuery, allEmojis);
    }
    if (selectedCategory === 'all') {
      return allEmojis;
    }
    const category = HABIT_CATEGORIES.find(
      (cat) => cat.id === selectedCategory
    );
    return category?.emojis ?? [];
  }, [selectedCategory, debouncedQuery, allEmojis]);

  const currentCategoryName = useMemo(() => {
    const category = HABIT_CATEGORIES.find(
      (cat) => cat.id === selectedCategory
    );
    return category ? `${category.icon} ${category.name.toUpperCase()}` : '';
  }, [selectedCategory]);

  return {
    currentCategoryName,
    displayedEmojis,
    isSearching: !!searchQuery,
    recentEmojis,
    searchQuery,
    selectedCategory,
    setDebouncedQuery,
    setSearchQuery,
    setSelectedCategory,
    suggestedEmojis,
  };
};
