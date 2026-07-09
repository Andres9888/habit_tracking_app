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
import { getCategoryLabel as resolveCategoryLabel } from '../utils/getCategoryLabel';
import { usePackConfirm } from './usePackConfirm';

export function useTemplatesScreenProps() {
  const reducedMotion = useReduceMotion();
  const animations = useEntranceAnimations({ reducedMotion });
  const tabIndicator = useTabIndicator({ reducedMotion });
  const data = useTemplatesData();
  const state = useTemplatesScreenState({
    categories: data.categories,
    initialImportedIds: data.initialImportedIds,
  });

  const templatesByCategory = useTemplatesByCategory(data.allTemplates);
  const scienceCountsByCategory = useScienceCountsByCategory(data.allTemplates);
  const filteredTemplates = useFilteredTemplates(
    data.allTemplates,
    state.selectedCategory,
    state.debouncedSearchQuery,
    state.sortOption
  );

  const handlers = useTemplateHandlers({
    flatListRef: state.flatListRef,
    importTemplate: data.importTemplate,
    previewTemplate: state.previewTemplate,
    isPremiumUser: data.isPremiumUser,
    onShowPaywall: () => state.setShowPaywall(true),
    seedTemplates: data.seedTemplates,
    setShowCelebration: state.setShowCelebration,
    setExpandedCategories: state.setExpandedCategories,
    setFeedbackHabitId: state.setFeedbackHabitId,
    setFeedbackVariant: state.setFeedbackVariant,
    setImportedTemplateIds: state.setImportedTemplateIds,
    setImportingTemplateId: state.setImportingTemplateId,
    setIsSeeding: state.setIsSeeding,
    setPreviewInitialAnchor: state.setPreviewInitialAnchor,
    setPreviewTemplate: state.setPreviewTemplate,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategory: state.setSelectedCategory,
    setSessionImportCount: state.setSessionImportCount,
    setShowCustomizeModal: state.setShowCustomizeModal,
    setShowFullsizePreview: state.setShowFullsizePreview,
    setShowSortOptions: state.setShowSortOptions,
    setShowToast: state.setShowToast,
    setSortOption: state.setSortOption,
    setToastMessage: state.setToastMessage,
    setToastOnAction: state.setToastOnAction,
    setToastTemplateData: state.setToastTemplateData,
    setViewMode: state.setViewMode,
    userHabitCount: data.userHabitCount,
  });

  const packConfirm = usePackConfirm({
    allTemplates: data.allTemplates,
    importTemplate: data.importTemplate,
    onComplete: (count) =>
      state.setSessionImportCount((current) => current + count),
    setImportedIds: state.setImportedTemplateIds,
  });

  const getCategoryLabel = (categoryId: string) =>
    resolveCategoryLabel(categoryId, data.categories);

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
    packConfirm,
    scienceCountsByCategory,
    state,
    tabIndicator,
    templatesByCategory,
  };
}
