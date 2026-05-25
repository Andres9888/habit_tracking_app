/* eslint-disable max-lines */
/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import { BrowseCategoriesLink } from './components/BrowseCategoriesLink';
import { useGroupedTemplates } from './components/ExploreAllSection';
import { SearchResults } from './components/SearchResults';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesScreenModals } from './components';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { useUserSegment } from './hooks/useUserSegment';
import { useLibraryAnalytics } from './hooks/useLibraryAnalytics';
import { FeedbackOverlays } from './views/FeedbackOverlays';
import { ImportSuccessView } from './views/ImportSuccessView';
import { MainBrowseView } from './views/MainBrowseView';
import { renderSubView } from './views/renderSubView';
import {
  buildCategoryGridItems,
} from './views/CategoriesGridView';
import {
  GOAL_COLLECTIONS,
  getFeaturedGoalId,
  type GoalCollection,
} from './data/goalCollections';
import { filterStarterTemplates } from './data/starterHabits';
import { sortTemplatesByImportState } from './utils/sortTemplatesByImportState';

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
  const segment = useUserSegment({
    userHabitCount: data.userHabitCount ?? 0,
    isPremiumUser: data.isPremiumUser ?? false,
  });
  const [successTemplate, setSuccessTemplate] = useState<Doc<'templates'> | null>(null);
  const successViewActive = successTemplate !== null;
  const analytics = useLibraryAnalytics(segment.baseSegment, segment.landingVariant);

  useEffect(() => {
    analytics.trackLibraryOpen('direct');
    analytics.trackLandingVariantShown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { groups } = useGroupedTemplates(data.allTemplates);
  const categoryGridItems = useMemo(
    () => buildCategoryGridItems(groups),
    [groups]
  );
  const starterTemplates = useMemo(
    () => filterStarterTemplates(data.allTemplates),
    [data.allTemplates]
  );
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

  const handleGoalSelect = useCallback(
    (goal: GoalCollection) => {
      state.setSearchQuery('');
      viewNav.openGoal(goal.id);
    },
    [state, viewNav]
  );

  const featuredGoalId = useMemo(() => getFeaturedGoalId(), []);
  const habitCountsByGoalId = useMemo(() => {
    const counts: Record<string, number> = {};
    GOAL_COLLECTIONS.forEach((goal) => {
      counts[goal.id] =
        data.allTemplates?.filter((t) => goal.categories.includes(t.category))
          .length ?? 0;
    });
    return counts;
  }, [data.allTemplates]);
  const featuredStarterTemplates = useMemo(() => {
    const featured = GOAL_COLLECTIONS.find((g) => g.id === featuredGoalId);
    if (!featured || !data.allTemplates) return [];
    return [...data.allTemplates]
      .filter((t) => featured.categories.includes(t.category))
      .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0))
      .slice(0, 3);
  }, [data.allTemplates, featuredGoalId]);

  const handleImport = useCallback((template: Doc<'templates'>) => {
    state.setPreviewTemplate(template);
    const isFirstImport = (data.userHabitCount ?? 0) === 0;
    void handlers.handleDirectImport(template._id).then(() => {
      analytics.trackLibraryAdd({ fromCustomize: false, isFirstImport, path: 'trending', templateId: template._id });
      setSuccessTemplate(template);
      if (isFirstImport) {
        state.setShowCelebration(false);
        state.setShowToast(false);
      }
    }).catch(() => {
      // fallback: let existing toast handle it
    });
  }, [analytics, data.userHabitCount, handlers, state]);
  const handleSeedTemplates = () => {
    void handlers.handleSeedTemplates();
  };
  const handlePackConfirm = () => {
    void packConfirm.handleConfirm();
  };
  const handleSeeAll = () => {
    void viewNav.openSeeAll();
  };
  const handleOpenStarters = () => {
    void viewNav.openStarters();
  };
  const handleOpenCategories = () => {
    void viewNav.openCategories();
  };
  const handleBrowseByGoal = useCallback(() => {
    const featured = GOAL_COLLECTIONS.find((g) => g.id === featuredGoalId);
    if (featured) handleGoalSelect(featured);
  }, [featuredGoalId, handleGoalSelect]);

  if (!data.isLoading && !data.allTemplates?.length) {
    return (
      <TemplatesEmptyState
        isSeeding={state.isSeeding}
        onSeedTemplates={handleSeedTemplates}
      />
    );
  }

  if (successViewActive && successTemplate) {
    const isFirstImport = (data.userHabitCount ?? 0) <= 1;
    return (
      <ImportSuccessView
        allTemplates={data.allTemplates ?? []}
        isFirstImport={isFirstImport}
        template={successTemplate}
        onAddPairing={handleImport}
        onCloseLibrary={() => { setSuccessTemplate(null); onCloseLibrary?.(); }}
        onDismiss={() => setSuccessTemplate(null)}
        onOpenGuidedPicker={() => { setSuccessTemplate(null); viewNav.openGuidedPicker(); }}
        onPreviewPairing={(t) => { setSuccessTemplate(null); viewNav.openDetail(t._id, 'pairing'); }}
      />
    );
  }

  const handleCustomize = useCallback((template: Doc<'templates'>) => {
    state.setPreviewTemplate(template);
    state.setShowCustomizeModal(true);
  }, [state]);

  const subView = renderSubView({
    activeView: viewNav.activeView,
    allTemplates: data.allTemplates,
    categoryGridItems,
    importedTemplateIds: state.importedTemplateIds,
    importingTemplateId: state.importingTemplateId,
    onBack: viewNav.goBack,
    onCustomize: handleCustomize,
    onImport: handleImport,
    onOpenCategory: viewNav.openCategory,
    onOpenDetail: (templateId, sourcePath) =>
      viewNav.openDetail(templateId, sourcePath as Parameters<typeof viewNav.openDetail>[1]),
    onPreview: (template) => viewNav.openDetail(template._id, 'trending'),
    onTrackDetailOpen: (templateId, sourcePath) =>
      analytics.trackDetailOpen(templateId, sourcePath as Parameters<typeof analytics.trackDetailOpen>[1]),
  });
  if (subView) {
    return (
      <>
        {subView}
        <TemplatesScreenModals
          importingTemplateId={state.importingTemplateId}
          previewTemplate={state.previewTemplate}
          showCustomizeModal={state.showCustomizeModal}
          showPaywall={state.showPaywall}
          onCloseCustomize={() => state.setShowCustomizeModal(false)}
          onClosePaywall={() => state.setShowPaywall(false)}
          onDirectImport={handlers.handleDirectImport}
          onImport={handlers.handleTemplateImport}
          packConfirmPack={packConfirm.selectedPack}
          packConfirmVisible={!!packConfirm.selectedPack}
          onPackCancel={packConfirm.handleCancel}
          onPackConfirm={handlePackConfirm}
        />
        <FeedbackOverlays
          feedbackVariant={state.feedbackVariant}
          sessionImportCount={state.sessionImportCount}
          showCelebration={state.showCelebration}
          showToast={state.showToast}
          toastMessage={state.toastMessage}
          toastTemplateData={state.toastTemplateData}
          onAddAnother={handleAddAnother}
          onDismissCelebration={handleDismissFeedback}
          onDismissToast={handleDismissFeedback}
          onViewHabit={handleViewHabit}
        />
      </>
    );
  }

  const handleSelectChipCategory = (categoryId: string | null) => {
    state.setSearchQuery('');
    state.setSelectedCategory((categoryId ?? 'all') as typeof state.selectedCategory);
  };

  return (
    <>
      <MainBrowseView
        browseCategoriesLink={
          <BrowseCategoriesLink
            categoryCount={groups.length}
            onPress={handleOpenCategories}
          />
        }
        featuredGoalId={featuredGoalId}
        featuredStarterTemplates={featuredStarterTemplates}
        feedbackOverlays={
          <FeedbackOverlays
            feedbackVariant={state.feedbackVariant}
            sessionImportCount={state.sessionImportCount}
            showCelebration={state.showCelebration}
            showToast={state.showToast}
            toastMessage={state.toastMessage}
            toastTemplateData={state.toastTemplateData}
            onAddAnother={handleAddAnother}
            onDismissCelebration={handleDismissFeedback}
            onDismissToast={handleDismissFeedback}
            onViewHabit={handleViewHabit}
          />
        }
        habitCountsByGoalId={habitCountsByGoalId}
        importedTemplateIds={state.importedTemplateIds}
        importingTemplateId={state.importingTemplateId}
        isSearchActive={state.isSearchActive}
        modals={
          <TemplatesScreenModals
            importingTemplateId={state.importingTemplateId}
            previewTemplate={state.previewTemplate}
            showCustomizeModal={state.showCustomizeModal}
            showPaywall={state.showPaywall}
            onCloseCustomize={() => state.setShowCustomizeModal(false)}
            onClosePaywall={() => state.setShowPaywall(false)}
            onDirectImport={handlers.handleDirectImport}
            onImport={handlers.handleTemplateImport}
            packConfirmPack={packConfirm.selectedPack}
            packConfirmVisible={!!packConfirm.selectedPack}
            onPackCancel={packConfirm.handleCancel}
            onPackConfirm={handlePackConfirm}
          />
        }
        helpMeChooseCopy={segment.helpMeChooseCopy}
        landingVariant={segment.landingVariant}
        onBrowseByGoal={handleBrowseByGoal}
        onGoalSelect={handleGoalSelect}
        onHelpMeChoose={viewNav.openGuidedPicker}
        onImport={handleImport}
        onPreview={(template) => viewNav.openDetail(template._id, 'trending')}
        onSearchChange={state.setSearchQuery}
        onSearchClear={() => state.setSearchQuery('')}
        onSeeAll={handleSeeAll}
        onSelectCategory={handleSelectChipCategory}
        onStartHerePress={handleOpenStarters}
        popularTemplates={mainBrowseData.popularTemplates}
        quickFilterCategories={mainBrowseData.quickFilterCategories}
        searchAnimatedStyle={props.animations.searchAnimatedStyle}
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
        sessionImportCount={state.sessionImportCount}
        starterTemplates={starterTemplates}
        userHabitCount={data.userHabitCount}
      />
    </>
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
