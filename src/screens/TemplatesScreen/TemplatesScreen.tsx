/* eslint-disable max-lines */
/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { useCallback } from 'react';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesScreenModals, TemplatesLoadingState } from './components';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './views/FeedbackOverlays';
import { MainBrowseView } from './views/MainBrowseView';

interface TemplatesScreenContentProps {
  onCloseLibrary?: () => void;
  onViewHabit?: (habitId: Id<'habits'>) => void;
}

function TemplatesScreenContent({
  onCloseLibrary,
  onViewHabit,
}: TemplatesScreenContentProps) {
  const { data, handlers, packConfirm, state } = useTemplatesScreenProps();

  const handleDismissFeedback = useCallback(() => {
    state.setShowToast(false);
    state.setShowCelebration(false);
    state.setFeedbackHabitId(null);
    state.setFeedbackVariant(null);
    state.setToastOnAction(null);
  }, [state]);

  const handleSaveError = useCallback(() => {
    state.setToastTemplateData(null);
    state.setToastOnAction(null);
    state.setToastMessage("Couldn't save your cue. Try again.");
    state.setShowToast(true);
  }, [state]);

  const handleAddAnother = useCallback(() => {
    handleDismissFeedback();
  }, [handleDismissFeedback]);

  const handleViewHabit = useCallback(() => {
    if (state.feedbackHabitId) {
      onViewHabit?.(state.feedbackHabitId);
    }
    handleDismissFeedback();
  }, [handleDismissFeedback, onViewHabit, state.feedbackHabitId]);

  const handleCatalogImport = useCallback(
    (template: Doc<'templates'>) => {
      state.setPreviewTemplate(template);
      void handlers.handleDirectImport(template._id, 'catalog');
    },
    [handlers.handleDirectImport, state.setPreviewTemplate]
  );

  const handleDetailsDirectImport = useCallback(
    async (id: Id<'templates'>) => {
      await handlers.handleDirectImport(id, 'details');
    },
    [handlers]
  );

  const handleSeedTemplates = () => {
    void handlers.handleSeedTemplates();
  };
  const handlePackConfirm = () => {
    void packConfirm.handleConfirm();
  };

  if (data.isLoading && !data.allTemplates?.length) {
    return <TemplatesLoadingState />;
  }

  if (!data.isLoading && !data.allTemplates?.length) {
    return (
      <TemplatesEmptyState
        isSeeding={state.isSeeding}
        onSeedTemplates={handleSeedTemplates}
      />
    );
  }

  return (
    <MainBrowseView
      allTemplates={data.allTemplates ?? []}
      catalogOrderImportedIds={state.catalogOrderImportedIds}
      feedbackOverlays={
        <FeedbackOverlays
          feedbackHabitId={state.feedbackHabitId}
          feedbackTemplate={state.previewTemplate}
          feedbackVariant={state.feedbackVariant}
          sessionImportCount={state.sessionImportCount}
          showCelebration={state.showCelebration}
          showToast={state.showToast}
          toastMessage={state.toastMessage}
          toastOnAction={state.toastOnAction}
          toastTemplateData={state.toastTemplateData}
          onAddAnother={handleAddAnother}
          onDismissCelebration={handleDismissFeedback}
          onDismissToast={handleDismissFeedback}
          onSaveError={handleSaveError}
          onViewHabit={handleViewHabit}
        />
      }
      importedTemplateIds={state.importedTemplateIds}
      importingTemplateIds={state.importingTemplateIds}
      modals={
        <TemplatesScreenModals
          importedTemplateIds={state.importedTemplateIds}
          importingTemplateIds={state.importingTemplateIds}
          previewInitialAnchor={state.previewInitialAnchor}
          previewTemplate={state.previewTemplate}
          showCustomizeModal={state.showCustomizeModal}
          showFullsizePreview={state.showFullsizePreview}
          showPaywall={state.showPaywall}
          onCloseCustomize={() => state.setShowCustomizeModal(false)}
          onCloseFullsize={() => state.setShowFullsizePreview(false)}
          onClosePaywall={() => state.setShowPaywall(false)}
          onCustomize={handlers.handleCustomizeFromPreview}
          onDirectImport={handleDetailsDirectImport}
          onImport={handlers.handleTemplateImport}
          packConfirmPack={packConfirm.selectedPack}
          packConfirmVisible={!!packConfirm.selectedPack}
          onPackCancel={packConfirm.handleCancel}
          onPackConfirm={handlePackConfirm}
        />
      }
      onClose={() => onCloseLibrary?.()}
      onCatalogImport={handleCatalogImport}
      onPreview={handlers.handleTemplatePreview}
    />
  );
}

interface TemplatesScreenProps {
  onCloseLibrary?: () => void;
  onViewHabit?: (habitId: Id<'habits'>) => void;
}

export default function TemplatesScreen({
  onCloseLibrary,
  onViewHabit,
}: TemplatesScreenProps = {}) {
  return (
    <ScreenErrorBoundary screenName='Templates'>
      <TemplatesScreenContent
        onCloseLibrary={onCloseLibrary}
        onViewHabit={onViewHabit}
      />
    </ScreenErrorBoundary>
  );
}
