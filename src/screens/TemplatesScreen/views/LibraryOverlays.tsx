/**
 * The two overlay trees MainBrowseView renders above the catalog: the modal
 * stack (preview, customize, paywall, pack confirm) and the post-import
 * feedback (toast + celebration).
 *
 * Both are pure prop fan-out from the screen state, so they live here instead
 * of inflating TemplatesScreen's render.
 */

import { TemplatesScreenModals } from '../components';
import { useLibraryScreenActions } from '../hooks/useLibraryScreenActions';
import type { useTemplatesScreenProps } from '../hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './FeedbackOverlays';

type ScreenProps = ReturnType<typeof useTemplatesScreenProps>;
type Actions = ReturnType<typeof useLibraryScreenActions>;

interface LibraryOverlaysProps {
  actions: Actions;
  handlers: ScreenProps['handlers'];
  packConfirm: ScreenProps['packConfirm'];
  state: ScreenProps['state'];
}

export function LibraryFeedbackOverlays({
  actions,
  state,
}: Pick<LibraryOverlaysProps, 'actions' | 'state'>) {
  return (
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
      onAddAnother={actions.handleAddAnother}
      onDismissCelebration={actions.handleDismissFeedback}
      onDismissToast={actions.handleDismissFeedback}
      onSaveError={actions.handleSaveError}
      onViewHabit={actions.handleViewHabit}
    />
  );
}

export function LibraryModals({
  actions,
  handlers,
  packConfirm,
  state,
}: LibraryOverlaysProps) {
  return (
    <TemplatesScreenModals
      importedTemplateIds={state.importedTemplateIds}
      importingTemplateId={state.importingTemplateId}
      previewInitialAnchor={state.previewInitialAnchor}
      previewTemplate={state.previewTemplate}
      showCustomizeModal={state.showCustomizeModal}
      showFullsizePreview={state.showFullsizePreview}
      showPaywall={state.showPaywall}
      onCloseCustomize={() => state.setShowCustomizeModal(false)}
      onCloseFullsize={() => state.setShowFullsizePreview(false)}
      onClosePaywall={() => state.setShowPaywall(false)}
      onCustomize={handlers.handleCustomizeFromPreview}
      onDirectImport={actions.handleDetailsDirectImport}
      onImport={handlers.handleTemplateImport}
      packConfirmPack={packConfirm.selectedPack}
      packConfirmVisible={!!packConfirm.selectedPack}
      onPackCancel={packConfirm.handleCancel}
      onPackConfirm={actions.handlePackConfirm}
    />
  );
}
