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

  const handleBackToBrowse = useCallback(() => {
    void triggerHaptic('tap');
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
