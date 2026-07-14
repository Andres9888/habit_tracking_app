/**
 * Event handlers for TemplatesScreen
 * Re-exports aggregated handlers from focused hook modules
 */

import { useSeedHandlers } from './hooks/useSeedHandlers';
import { useTemplateImportHandlers } from './hooks/useTemplateImportHandlers';
import type { UseTemplateHandlersOptions } from './TemplatesScreen.handlers.types';

export function useTemplateHandlers(opts: UseTemplateHandlersOptions) {
  const imports = useTemplateImportHandlers({
    importTemplate: opts.importTemplate,
    isPremiumUser: opts.isPremiumUser,
    onShowPaywall: opts.onShowPaywall,
    previewTemplate: opts.previewTemplate,
    setFeedbackHabitId: opts.setFeedbackHabitId,
    setFeedbackVariant: opts.setFeedbackVariant,
    setImportedTemplateIds: opts.setImportedTemplateIds,
    setImportingTemplateIds: opts.setImportingTemplateIds,
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

  const seed = useSeedHandlers({
    seedTemplates: opts.seedTemplates,
    setIsSeeding: opts.setIsSeeding,
    setShowToast: opts.setShowToast,
    setToastMessage: opts.setToastMessage,
  });

  return {
    handleCustomizeFromPreview: imports.handleCustomizeFromPreview,
    handleDirectImport: imports.handleDirectImport,
    handleSeedTemplates: seed.handleSeedTemplates,
    handleTemplateImport: imports.handleTemplateImport,
    handleTemplatePreview: imports.handleTemplatePreview,
  };
}
