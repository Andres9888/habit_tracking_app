/** Hook to prepare the data and actions consumed by TemplatesScreen. */

import { useTemplateHandlers } from '../TemplatesScreen.handlers';
import { useTemplatesScreenState } from '../TemplatesScreen.hooks';
import { useTemplatesData } from '../useTemplatesData';
import { usePackConfirm } from './usePackConfirm';

export function useTemplatesScreenProps() {
  const data = useTemplatesData();
  const state = useTemplatesScreenState({
    initialImportedIds: data.initialImportedIds,
  });

  const handlers = useTemplateHandlers({
    importTemplate: data.importTemplate,
    previewTemplate: state.previewTemplate,
    isPremiumUser: data.isPremiumUser,
    onShowPaywall: () => state.setShowPaywall(true),
    seedTemplates: data.seedTemplates,
    setShowCelebration: state.setShowCelebration,
    setFeedbackHabitId: state.setFeedbackHabitId,
    setFeedbackVariant: state.setFeedbackVariant,
    setImportedTemplateIds: state.setImportedTemplateIds,
    setImportingTemplateIds: state.setImportingTemplateIds,
    setIsSeeding: state.setIsSeeding,
    setPreviewInitialAnchor: state.setPreviewInitialAnchor,
    setPreviewTemplate: state.setPreviewTemplate,
    setSessionImportCount: state.setSessionImportCount,
    setShowCustomizeModal: state.setShowCustomizeModal,
    setShowFullsizePreview: state.setShowFullsizePreview,
    setShowToast: state.setShowToast,
    setToastMessage: state.setToastMessage,
    setToastOnAction: state.setToastOnAction,
    setToastTemplateData: state.setToastTemplateData,
    userHabitCount: data.userHabitCount,
  });

  const packConfirm = usePackConfirm({
    allTemplates: data.allTemplates,
    importTemplate: data.importTemplate,
    onComplete: (count) =>
      state.setSessionImportCount((current) => current + count),
    setImportedIds: state.setImportedTemplateIds,
  });

  return {
    data,
    handlers,
    packConfirm,
    state,
  };
}
