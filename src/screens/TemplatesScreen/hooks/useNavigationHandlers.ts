/**
 * Handlers for navigation and filter reset operations
 */

import { useCallback } from 'react';
import type { FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { Category, SortOption } from '../../templates/constants';
import type { ViewMode } from '../TemplatesScreen.types';

interface UseNavigationHandlersOptions {
  flatListRef: React.RefObject<FlatList<Doc<'templates'>>>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  setResearchOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category>>;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}

export function useNavigationHandlers(opts: UseNavigationHandlersOptions) {
  const {
    flatListRef,
    setExpandedCategories,
    setResearchOnly,
    setSearchQuery,
    setSelectedCategory,
    setSortOption,
    setViewMode,
  } = opts;

  const handleToggleCategory = useCallback(
    (categoryId: string) => {
      setExpandedCategories((prev) => {
        const n = new Set(prev);
        if (n.has(categoryId)) {
          n.delete(categoryId);
        } else {
          n.add(categoryId);
        }
        return n;
      });
    },
    [setExpandedCategories]
  );

  const handleBackToBrowse = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory('all');
    setViewMode('browse');
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [flatListRef, setSelectedCategory, setViewMode]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setResearchOnly(false);
    setSortOption('popular');
    setViewMode('browse');
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [
    flatListRef,
    setResearchOnly,
    setSearchQuery,
    setSelectedCategory,
    setSortOption,
    setViewMode,
  ]);

  return {
    handleBackToBrowse,
    handleResetFilters,
    handleToggleCategory,
  };
}
