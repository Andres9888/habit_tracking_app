/**
 * Hook to prepare props for TemplatesScreen child views
 */

import { useTemplateHandlers } from '../TemplatesScreen.handlers';
import { useTemplatesScreenState } from '../TemplatesScreen.hooks';
import { useTemplatesData } from '../useTemplatesData';
import { usePackConfirm } from './usePackConfirm';

export function useTemplatesScreenProps() {
  const data = useTemplatesData();
  const state = useTemplatesScreenState({
    categories: data.categories,
    initialImportedIds: data.initialImportedIds,
  });

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

  return { data, handlers, packConfirm, state };
}
