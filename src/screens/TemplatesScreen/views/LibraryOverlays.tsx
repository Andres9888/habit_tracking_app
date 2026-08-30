/**
 * The two overlay trees MainBrowseView renders above the catalog: the modal
 * stack (preview, customize, paywall, pack confirm) and the post-import
 * feedback (toast + celebration).
 *
 * Both are pure prop fan-out from the screen state, so they live here instead
 * of inflating TemplatesScreen's render.
 */

import type { Id } from '../../../../convex/_generated/dataModel';
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
  /** Dismisses the Habit Library itself, landing the user on the home screen. */
  onCloseLibrary?: () => void;
  /**
   * Dismisses the library and asks home to scroll to + highlight the habit the
   * previewed template produced. Falls back to `onCloseLibrary` when omitted or
   * when the habit id is unknown.
   */
  onGoToHabit?: (habitId: Id<'habits'>) => void;
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
  onCloseLibrary,
  onGoToHabit,
}: LibraryOverlaysProps) {
  // The detail modal has two distinct exits and they must not collapse into
  // one. Back only hides the overlay — CatalogView stays mounted underneath
  // (MainBrowseView), so scroll position, search text and the selected
  // category all survive. Exit-to-home additionally dismisses the library.
  // The preview is hidden FIRST so the overlay never outlives the screen that
  // owns its state.
  const handleBackToLibrary = () => state.setShowFullsizePreview(false);
  const handleExitToHome = () => {
    state.setShowFullsizePreview(false);
    onCloseLibrary?.();
  };
  // Unlike exit-to-home the preview stays up: home closes the whole library
  // once the row is on screen, so hiding the preview first would only flash
  // the catalog underneath for a few hundred ms.
  const handleGoToHabit = (habitId: Id<'habits'>) => {
    if (onGoToHabit) {
      onGoToHabit(habitId);
      return;
    }
    state.setShowFullsizePreview(false);
    onCloseLibrary?.();
  };

  return (
    <TemplatesScreenModals
      habitIdByTemplateId={state.habitIdByTemplateId}
      importedTemplateIds={state.importedTemplateIds}
      importingTemplateId={state.importingTemplateId}
      previewInitialAnchor={state.previewInitialAnchor}
      previewTemplate={state.previewTemplate}
      showCustomizeModal={state.showCustomizeModal}
      showFullsizePreview={state.showFullsizePreview}
      showPaywall={state.showPaywall}
      onBackToLibrary={handleBackToLibrary}
      onCloseCustomize={() => state.setShowCustomizeModal(false)}
      onClosePaywall={() => state.setShowPaywall(false)}
      onExitToHome={handleExitToHome}
      onGoToHabit={handleGoToHabit}
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
