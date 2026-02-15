/**
 * Event handlers for TemplatesScreen
 * Re-exports aggregated handlers from focused hook modules
 */

import type { UseTemplateHandlersOptions } from './TemplatesScreen.handlers.types';
import { useNavigationHandlers } from './hooks/useNavigationHandlers';
import { useSeedHandlers } from './hooks/useSeedHandlers';
import { useSortHandlers } from './hooks/useSortHandlers';
import { useTemplateImportHandlers } from './hooks/useTemplateImportHandlers';

export function useTemplateHandlers(opts: UseTemplateHandlersOptions) {
  const navigation = useNavigationHandlers({
    flatListRef: opts.flatListRef,
    setExpandedCategories: opts.setExpandedCategories,
    setResearchOnly: opts.setResearchOnly,
    setSearchQuery: opts.setSearchQuery,
    setSelectedCategory: opts.setSelectedCategory,
    setSortOption: opts.setSortOption,
    setViewMode: opts.setViewMode,
  });

  const imports = useTemplateImportHandlers({
    importTemplate: opts.importTemplate,
    setImportedTemplateIds: opts.setImportedTemplateIds,
    setImportingTemplateId: opts.setImportingTemplateId,
    setPreviewTemplate: opts.setPreviewTemplate,
    setShowCustomizeModal: opts.setShowCustomizeModal,
    setShowFullsizePreview: opts.setShowFullsizePreview,
    setShowToast: opts.setShowToast,
    setToastMessage: opts.setToastMessage,
  });

  const sort = useSortHandlers({
    flatListRef: opts.flatListRef,
    setShowSortOptions: opts.setShowSortOptions,
    setSortOption: opts.setSortOption,
  });

  const seed = useSeedHandlers({
    seedAdditionalTemplates: opts.seedAdditionalTemplates,
    seedNewScienceTemplates: opts.seedNewScienceTemplates,
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

    handleSelectSortOption: sort.handleSelectSortOption,

    handleTemplateImport: imports.handleTemplateImport,

    handleTemplatePreview: imports.handleTemplatePreview,
    handleToggleCategory: navigation.handleToggleCategory,
  };
}
