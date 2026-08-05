/* eslint-disable max-lines */
/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { useCallback, useMemo } from 'react';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import { BrowseCategoriesLink } from './components/BrowseCategoriesLink';
import { useGroupedTemplates } from './components/ExploreAllSection';
import { SearchResults } from './components/SearchResults';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesScreenModals } from './components';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './views/FeedbackOverlays';
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
  const goalAggregates = useMemo(() => {
    const countsByGoalId = Object.fromEntries(
      GOAL_COLLECTIONS.map((goal) => [goal.id, 0])
    ) as Record<string, number>;
    const featuredTemplates: Doc<'templates'>[] = [];
    const featured = GOAL_COLLECTIONS.find((g) => g.id === featuredGoalId);
    const featuredCategories = featured ? new Set(featured.categories) : null;
    const goalIdsByCategory = new Map<string, string[]>();

    for (const goal of GOAL_COLLECTIONS) {
      for (const category of goal.categories) {
        const existing = goalIdsByCategory.get(category);
        if (existing) {
          existing.push(goal.id);
        } else {
          goalIdsByCategory.set(category, [goal.id]);
        }
      }
    }

    if (data.allTemplates) {
      for (const template of data.allTemplates) {
        const goalIds = goalIdsByCategory.get(template.category);
        if (goalIds) {
          for (const goalId of goalIds) {
            countsByGoalId[goalId] = (countsByGoalId[goalId] ?? 0) + 1;
          }
        }

        if (featuredCategories?.has(template.category)) {
          featuredTemplates.push(template);
        }
      }
    }

    featuredTemplates.sort(
      (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
    );

    return {
      featuredStarterTemplates: featuredTemplates.slice(0, 3),
      habitCountsByGoalId: countsByGoalId,
    };
  }, [data.allTemplates, featuredGoalId]);
  const featuredStarterTemplates = goalAggregates.featuredStarterTemplates;

  const handleImport = (template: Doc<'templates'>) => {
    state.setPreviewTemplate(template);
    void handlers.handleDirectImport(template._id);
  };
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

  const subView = renderSubView({
    activeView: viewNav.activeView,
    allTemplates: data.allTemplates,
    categoryGridItems,
    importedTemplateIds: state.importedTemplateIds,
    importingTemplateId: state.importingTemplateId,
    onBack: viewNav.goBack,
    onImport: handleImport,
    onOpenCategory: viewNav.openCategory,
    onPreview: handlers.handleTemplatePreview,
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
        habitCountsByGoalId={goalAggregates.habitCountsByGoalId}
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
        onBrowseByGoal={handleBrowseByGoal}
        onGoalSelect={handleGoalSelect}
        onImport={handleImport}
        onPreview={handlers.handleTemplatePreview}
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
