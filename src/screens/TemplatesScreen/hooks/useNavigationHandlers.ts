/**
 * Handlers for navigation and filter reset operations
 */

import { useCallback } from 'react';
import type { FlatList } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { Category, SortOption } from '../../templates/constants';
import type { ViewMode } from '../TemplatesScreen.types';
import { triggerHaptic } from '@/utils/haptics';

interface UseNavigationHandlersOptions {
  flatListRef: React.RefObject<FlatList<Doc<'templates'>> | null>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category>>;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}

export function useNavigationHandlers(opts: UseNavigationHandlersOptions) {
  const {
    flatListRef,
    setExpandedCategories,
    setSearchQuery,
    setSelectedCategory,
    setSortOption,
    setViewMode,
  } = opts;

  const handleToggleCategory = useCallback(
    (categoryId: string) => {
      setExpandedCategories((prev) => {
        const updated = new Set(prev);
        if (updated.has(categoryId)) {
          updated.delete(categoryId);
        } else {
          updated.add(categoryId);
        }
        return updated;
      });
    },
    [setExpandedCategories]
  );

  const resetToBrowse = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOption('popular');
    setViewMode('browse');
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [
    flatListRef,
    setSearchQuery,
    setSelectedCategory,
    setSortOption,
    setViewMode,
  ]);

  const handleBackToBrowse = useCallback(() => {
    void triggerHaptic('tap');
    resetToBrowse();
  }, [resetToBrowse]);

  const handleSelectCategory = useCallback(
    (categoryId: string) => {
      void triggerHaptic('selection');
      setSearchQuery('');
      setSelectedCategory(categoryId as Category);
      setViewMode(categoryId === 'all' ? 'browse' : 'category');
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    },
    [flatListRef, setSearchQuery, setSelectedCategory, setViewMode]
  );

  const handleResetFilters = useCallback(() => {
    resetToBrowse();
  }, [resetToBrowse]);

  return {
    handleBackToBrowse,
    handleResetFilters,
    handleSelectCategory,
    handleToggleCategory,
  };
}
