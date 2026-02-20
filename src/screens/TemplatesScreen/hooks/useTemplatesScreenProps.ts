/**
 * Hook to prepare props for TemplatesScreen child views
 */

import { useReduceMotion } from '../../../hooks/useReduceMotion';
import {
  useEntranceAnimations,
  useTabIndicator,
} from '../TemplatesScreen.animations';
import { useTemplateHandlers } from '../TemplatesScreen.handlers';
import { useTemplatesScreenState } from '../TemplatesScreen.hooks';
import type { BrowseTab } from '../TemplatesScreen.types';
import {
  useFilteredTemplates,
  useScienceCountsByCategory,
  useTemplatesByCategory,
  useTemplatesData,
} from '../useTemplatesData';

export function useTemplatesScreenProps() {
  const reducedMotion = useReduceMotion();
  const animations = useEntranceAnimations({ reducedMotion });
  const tabIndicator = useTabIndicator({ reducedMotion });
  const data = useTemplatesData();
  const state = useTemplatesScreenState({ categories: data.categories });

  const templatesByCategory = useTemplatesByCategory(data.allTemplates);
  const scienceCountsByCategory = useScienceCountsByCategory(data.allTemplates);
  const filteredTemplates = useFilteredTemplates(
    data.allTemplates,
    state.selectedCategory,
    state.researchOnly,
    state.searchQuery,
    state.sortOption
  );

  const handlers = useTemplateHandlers({
    flatListRef: state.flatListRef,
    importTemplate: data.importTemplate,
    seedTemplates: data.seedTemplates,
    setExpandedCategories: state.setExpandedCategories,
    setImportedTemplateIds: state.setImportedTemplateIds,
    setImportingTemplateId: state.setImportingTemplateId,
    setIsSeeding: state.setIsSeeding,
    setPreviewTemplate: state.setPreviewTemplate,
    setResearchOnly: state.setResearchOnly,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategory: state.setSelectedCategory,
    setShowCustomizeModal: state.setShowCustomizeModal,
    setShowFullsizePreview: state.setShowFullsizePreview,
    setShowSortOptions: state.setShowSortOptions,
    setShowToast: state.setShowToast,
    setSortOption: state.setSortOption,
    setToastMessage: state.setToastMessage,
    setViewMode: state.setViewMode,
  });

  const getCategoryLabel = (categoryId: string) =>
    data.categories?.find((c) => c.id === categoryId)?.label || categoryId;

  const handleTabPress = (tab: BrowseTab) => {
    state.setBrowseTab(tab);
    tabIndicator.setTabPosition(tab === 'categories' ? 0 : 1);
  };

  return {
    animations,
    data,
    filteredTemplates,
    getCategoryLabel,
    handlers,
    handleTabPress,
    scienceCountsByCategory,
    state,
    tabIndicator,
    templatesByCategory,
  };
}
