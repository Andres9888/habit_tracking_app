/**
 * Event handlers for TemplatesScreen
 * Re-exports aggregated handlers from focused hook modules
 */

import { useNavigationHandlers } from './hooks/useNavigationHandlers';
import { useSeedHandlers } from './hooks/useSeedHandlers';
import { useSortHandlers } from './hooks/useSortHandlers';
import { useTemplateImportHandlers } from './hooks/useTemplateImportHandlers';
import type { UseTemplateHandlersOptions } from './TemplatesScreen.handlers.types';

export function useTemplateHandlers(opts: UseTemplateHandlersOptions) {
  const navigation = useNavigationHandlers({
    flatListRef: opts.flatListRef,
    setExpandedCategories: opts.setExpandedCategories,
    setSearchQuery: opts.setSearchQuery,
    setSelectedCategory: opts.setSelectedCategory,
    setSortOption: opts.setSortOption,
    setViewMode: opts.setViewMode,
  });

  const imports = useTemplateImportHandlers({
    importTemplate: opts.importTemplate,
    isPremiumUser: opts.isPremiumUser,
    onShowPaywall: opts.onShowPaywall,
    previewTemplate: opts.previewTemplate,
    recordImportedHabitId: opts.recordImportedHabitId,
    setFeedbackHabitId: opts.setFeedbackHabitId,
    setFeedbackVariant: opts.setFeedbackVariant,
    setImportedTemplateIds: opts.setImportedTemplateIds,
    setImportingTemplateId: opts.setImportingTemplateId,
    setPreviewInitialAnchor: opts.setPreviewInitialAnchor,
    setPreviewTemplate: opts.setPreviewTemplate,
    setSessionImportCount: opts.setSessionImportCount,
    setShowCelebration: opts.setShowCelebration,
    setShowCustomizeModal: opts.setShowCustomizeModal,
    setShowFullsizePreview: opts.setShowFullsizePreview,
    setShowToast: opts.setShowToast,
    setToastMessage: opts.setToastMessage,
    setToastOnAction: opts.setToastOnAction,
    setToastTemplateData: opts.setToastTemplateData,
    userHabitCount: opts.userHabitCount,
  });

  const sort = useSortHandlers({
    flatListRef: opts.flatListRef,
    setShowSortOptions: opts.setShowSortOptions,
    setSortOption: opts.setSortOption,
  });

  const seed = useSeedHandlers({
    seedTemplates: opts.seedTemplates,
    setIsSeeding: opts.setIsSeeding,
    setShowToast: opts.setShowToast,
    setToastMessage: opts.setToastMessage,
  });

  return {
    handleBackToBrowse: navigation.handleBackToBrowse,
    // Also expose individual sort controls
    handleCloseSortOptions: sort.handleCloseSortOptions,

    handleCustomizeFromPreview: imports.handleCustomizeFromPreview,

    handleDirectImport: imports.handleDirectImport,

    handleOpenSortOptions: sort.handleOpenSortOptions,

    handleResetFilters: navigation.handleResetFilters,

    handleSeedTemplates: seed.handleSeedTemplates,

    handleSelectCategory: navigation.handleSelectCategory,

    handleSelectSortOption: sort.handleSelectSortOption,

    handleTemplateImport: imports.handleTemplateImport,

    handleTemplatePreview: imports.handleTemplatePreview,
    handleToggleCategory: navigation.handleToggleCategory,
  };
}
