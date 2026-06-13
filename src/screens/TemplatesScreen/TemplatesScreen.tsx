/* eslint-disable max-lines */
/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { useCallback, useMemo } from 'react';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import { SearchResults } from './components/SearchResults';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesScreenModals, TemplatesLoadingState } from './components';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './views/FeedbackOverlays';
import { MainBrowseView } from './views/MainBrowseView';
import { renderSubView } from './views/renderSubView';
import { GOAL_COLLECTIONS, type GoalCollection } from './data/goalCollections';
import { usePrescription, getGoalTemplates } from './hooks/usePrescription';
import { useSelectedGoal } from './hooks/useSelectedGoal';
import {
  trackLibraryEvent,
  type TemplateImportSource,
} from './utils/libraryAnalytics';
import { sortTemplatesByImportState } from './utils/sortTemplatesByImportState';

const CATEGORY_INDEX_LIMIT = 6;

interface TemplatesScreenContentProps {
  onCloseLibrary?: () => void;
  onViewHabit?: (habitId: Id<'habits'>) => void;
}

function TemplatesScreenContent({
  onCloseLibrary,
  onViewHabit,
}: TemplatesScreenContentProps) {
  const props = useTemplatesScreenProps();
  const { data, handlers, mainBrowseData, packConfirm, state, viewNav } = props;
  const { selectedGoalId, setSelectedGoalId } = useSelectedGoal();
  const sortedFilteredTemplates = useMemo(
    () =>
      sortTemplatesByImportState(
        props.filteredTemplates,
        state.importedTemplateIds
      ),
    [props.filteredTemplates, state.importedTemplateIds]
  );

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

  const prescription = usePrescription(
    selectedGoalId,
    data.allTemplates,
    state.importedTemplateIds
  );

  const goalTemplates = useMemo(
    () =>
      selectedGoalId
        ? getGoalTemplates(
            selectedGoalId,
            data.allTemplates,
            state.importedTemplateIds
          )
        : [],
    [data.allTemplates, selectedGoalId, state.importedTemplateIds]
  );

  const importedStepCounts = useMemo(() => {
    if (!selectedGoalId || !prescription) return {};
    return { [selectedGoalId]: prescription.importedStepCount };
  }, [prescription, selectedGoalId]);

  const selectedGoal = useMemo(
    () => GOAL_COLLECTIONS.find((g) => g.id === selectedGoalId) ?? null,
    [selectedGoalId]
  );

  const heroCopy = useMemo(() => {
    if (!selectedGoal || !prescription || prescription.importedStepCount < 1) {
      return { subtitle: undefined, title: undefined };
    }
    const firstImported = prescription.steps.find((step) =>
      state.importedTemplateIds.has(step.template._id)
    );
    const habitName = firstImported?.template.name ?? 'your habit';
    return {
      title: `Your ${selectedGoal.problemLabel.toLowerCase()} path`,
      subtitle: `🌱 Keep going with ${habitName} — the first week matters most.`,
    };
  }, [prescription, selectedGoal, state.importedTemplateIds]);

  const handleGoalSelect = useCallback(
    (goal: GoalCollection) => {
      state.setSearchQuery('');
      const nextId = selectedGoalId === goal.id ? null : goal.id;
      if (nextId) {
        trackLibraryEvent({ type: 'chip_selected', goalId: nextId });
      } else {
        trackLibraryEvent({ type: 'chip_deselected', goalId: goal.id });
      }
      setSelectedGoalId(nextId);
    },
    [selectedGoalId, setSelectedGoalId, state]
  );

  const categoryIndex = useMemo(
    () =>
      mainBrowseData.categoryList.slice(0, CATEGORY_INDEX_LIMIT).map((c) => ({
        categoryId: c.categoryId,
        count: c.count,
        icon: c.icon,
        label: c.label,
      })),
    [mainBrowseData.categoryList]
  );

  const makeImportHandler = useCallback(
    (source: TemplateImportSource) => (template: Doc<'templates'>) => {
      trackLibraryEvent({
        type: 'template_added',
        templateId: template._id,
        source,
      });
      state.setPreviewTemplate(template);
      void handlers.handleDirectImport(template._id);
    },
    [handlers, state]
  );

  const handlePopularImport = useMemo(
    () => makeImportHandler('popular'),
    [makeImportHandler]
  );
  const handlePrescriptionImport = useMemo(
    () => makeImportHandler('prescription'),
    [makeImportHandler]
  );
  const handleCatalogImport = useMemo(
    () => makeImportHandler('catalog'),
    [makeImportHandler]
  );

  const handleDetailsDirectImport = useCallback(
    async (id: Id<'templates'>) => {
      trackLibraryEvent({
        type: 'template_added',
        templateId: id,
        source: 'details',
      });
      await handlers.handleDirectImport(id);
    },
    [handlers]
  );

  const handleSeedTemplates = () => {
    void handlers.handleSeedTemplates();
  };
  const handlePackConfirm = () => {
    void packConfirm.handleConfirm();
  };
  const handleSeeAll = () => {
    viewNav.openCatalog();
  };
  const handleOpenCategory = useCallback(
    (categoryId: string) => {
      viewNav.openCatalog(categoryId);
    },
    [viewNav]
  );

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

  const subView = renderSubView({
    activeView: viewNav.activeView,
    allTemplates: data.allTemplates,
    importedTemplateIds: state.importedTemplateIds,
    importingTemplateId: state.importingTemplateId,
    onBack: viewNav.goBack,
    onImport: handleCatalogImport,
    onPreview: handlers.handleTemplatePreview,
  });
  if (subView) {
    return (
      <>
        {subView}
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
          onDirectImport={handleDetailsDirectImport}
          onImport={handlers.handleTemplateImport}
          packConfirmPack={packConfirm.selectedPack}
          packConfirmVisible={!!packConfirm.selectedPack}
          onPackCancel={packConfirm.handleCancel}
          onPackConfirm={handlePackConfirm}
        />
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
      </>
    );
  }

  return (
    <MainBrowseView
      categoryIndex={categoryIndex}
      goalTemplates={goalTemplates}
      heroSubtitle={heroCopy.subtitle}
      heroTitle={heroCopy.title}
      importedStepCounts={importedStepCounts}
      prescription={prescription}
      selectedGoalId={selectedGoalId}
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
      importingTemplateId={state.importingTemplateId}
      isSearchActive={state.isSearchActive}
      modals={
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
          onDirectImport={handleDetailsDirectImport}
          onImport={handlers.handleTemplateImport}
          packConfirmPack={packConfirm.selectedPack}
          packConfirmVisible={!!packConfirm.selectedPack}
          onPackCancel={packConfirm.handleCancel}
          onPackConfirm={handlePackConfirm}
        />
      }
      onGoalSelect={handleGoalSelect}
      onOpenCategory={handleOpenCategory}
      onPopularImport={handlePopularImport}
      onPrescriptionImport={handlePrescriptionImport}
      onPreview={handlers.handleTemplatePreview}
      onSearchChange={state.setSearchQuery}
      onSearchClear={() => state.setSearchQuery('')}
      onSeeAll={handleSeeAll}
      rowSections={mainBrowseData.browseRowSections}
      searchQuery={state.searchQuery}
      searchResultsSection={
        <SearchResults
          filteredTemplates={sortedFilteredTemplates}
          getCategoryLabel={props.getCategoryLabel}
          hasActiveFilters={state.hasActiveFilters}
          importedTemplateIds={state.importedTemplateIds}
          importingTemplateId={state.importingTemplateId}
          searchQuery={state.searchQuery}
          selectedCategory={state.selectedCategory}
          setShowSortOptions={state.setShowSortOptions}
          showSortOptions={state.showSortOptions}
          sortOption={state.sortOption}
          onImport={handlers.handleTemplateImport}
          onPreview={handlers.handleTemplatePreview}
          onResetFilters={handlers.handleResetFilters}
          onSelectSort={handlers.handleSelectSortOption}
          onToggleSortOptions={() =>
            state.setShowSortOptions(!state.showSortOptions)
          }
        />
      }
      selectedCategory={state.selectedCategory}
      totalHabitCount={data.allTemplates?.length ?? 0}
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
