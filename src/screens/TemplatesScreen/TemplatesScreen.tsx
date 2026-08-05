/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Id } from '../../../convex/_generated/dataModel';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesLoadingState } from './components';
import { useLibraryScreenActions } from './hooks/useLibraryScreenActions';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import {
  LibraryFeedbackOverlays,
  LibraryModals,
} from './views/LibraryOverlays';
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

  const actions = useLibraryScreenActions({
    handlers,
    packConfirm,
    state,
    onViewHabit,
  });

  // Do not paint the catalog until both inputs that determine card placement
  // are ready. Rendering warm templates against an unresolved imported-ID set
  // briefly puts every card in its category, then moves added cards after the
  // query resolves — the visible first-open shuffle.
  if (
    (data.isLoading && !data.allTemplates?.length) ||
    !state.isImportedStateReady
  ) {
    return <TemplatesLoadingState onClose={() => onCloseLibrary?.()} />;
  }

  if (!data.isLoading && !data.allTemplates?.length) {
    return (
      <TemplatesEmptyState
        isSeeding={state.isSeeding}
        onSeedTemplates={actions.handleSeedTemplates}
      />
    );
  }

  return (
    <MainBrowseView
      allTemplates={data.allTemplates ?? []}
      feedbackOverlays={
        <LibraryFeedbackOverlays actions={actions} state={state} />
      }
      frozenImportedIds={state.frozenImportedIds}
      importedTemplateIds={state.importedTemplateIds}
      importingTemplateId={state.importingTemplateId}
      modals={
        <LibraryModals
          actions={actions}
          handlers={handlers}
          packConfirm={packConfirm}
          state={state}
          onCloseLibrary={onCloseLibrary}
        />
      }
      onClose={() => onCloseLibrary?.()}
      onPopularImport={actions.handlePopularImport}
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
