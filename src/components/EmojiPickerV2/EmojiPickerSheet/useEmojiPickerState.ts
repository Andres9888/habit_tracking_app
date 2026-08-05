/**
 * useEmojiPickerState Hook
 * Manages search, category, and emoji selection state
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { HABIT_CATEGORIES } from '../../../constants/habitEmojis';
import { getAllEmojis } from '../../../utils/emojiData';
import {
  searchEmojisByKeyword,
  suggestEmojisForHabitName,
} from '../../../utils/emojiKeywords';
import { getRecentEmojis } from '../../../utils/recentEmojis';

export function useEmojiPickerState(visible: boolean, habitName: string) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('fitness');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute suggested emojis based on habit name
  const suggestedEmojis = useMemo(() => {
    if (!habitName?.trim()) return [];
    return suggestEmojisForHabitName(habitName, 5);
  }, [habitName]);

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(
      () => setDebouncedQuery(searchQuery),
      150
    );
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Get all emojis (cached)
  const allEmojis = useMemo(() => getAllEmojis(), []);

  // Get emojis to display based on category and search
  const displayedEmojis = useMemo(() => {
    if (debouncedQuery.trim())
      return searchEmojisByKeyword(debouncedQuery, allEmojis);
    if (selectedCategory === 'all') return allEmojis;
    const category = HABIT_CATEGORIES.find(
      (cat) => cat.id === selectedCategory
    );
    return category?.emojis ?? [];
  }, [selectedCategory, debouncedQuery, allEmojis]);

  // Load recent emojis on mount
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

  // Get current category name for header
  const currentCategoryName = useMemo(() => {
    const category = HABIT_CATEGORIES.find(
      (cat) => cat.id === selectedCategory
    );
    return category ? `${category.icon} ${category.name.toUpperCase()}` : '';
  }, [selectedCategory]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    currentCategoryName,
    displayedEmojis,
    handleCategorySelect,
    handleClearSearch,
    isSearchFocused,
    searchQuery,
    selectedCategory,
    setIsSearchFocused,
    setSearchQuery,
    suggestedEmojis,
  };
}
