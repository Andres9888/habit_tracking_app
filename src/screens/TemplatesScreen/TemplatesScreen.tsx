/* eslint-disable max-lines */
/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { useCallback, useMemo } from 'react';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Doc } from '../../../convex/_generated/dataModel';
import { CategoryRowsSection } from './components/CategoryRowsSection';
import { useGroupedTemplates } from './components/ExploreAllSection';
import { PremiumPacksSection } from './components/PremiumPacksSection';
import { SearchResults } from './components/SearchResults';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesScreenModals } from './components';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './views/FeedbackOverlays';
import { MainBrowseView } from './views/MainBrowseView';
import { renderSubView } from './views/renderSubView';
import {
  GOAL_COLLECTIONS,
  getFeaturedGoalId,
  type GoalCollection,
} from './data/goalCollections';

interface TemplatesScreenContentProps {
  onCloseLibrary?: () => void;
}

function TemplatesScreenContent({
  onCloseLibrary,
}: TemplatesScreenContentProps) {
  const props = useTemplatesScreenProps();
  const { data, handlers, mainBrowseData, packConfirm, state, viewNav } = props;
  const { groups, totalCount } = useGroupedTemplates(data.allTemplates);

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

  const handleImport = (template: Doc<'templates'>) => {
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
    onImport: handleImport,
    onPreview: handlers.handleTemplatePreview,
  });
  if (subView) {
    return (
      <>
        {subView}
        <TemplatesScreenModals
          importedTemplateIds={state.importedTemplateIds}
          importingTemplateId={state.importingTemplateId}
          previewTemplate={state.previewTemplate}
          showCustomizeModal={state.showCustomizeModal}
          showFullsizePreview={state.showFullsizePreview}
          showPaywall={state.showPaywall}
          onCloseCustomize={() => state.setShowCustomizeModal(false)}
          onCloseFullsize={() => state.setShowFullsizePreview(false)}
          onCloseLibrary={onCloseLibrary}
          onClosePaywall={() => state.setShowPaywall(false)}
          onCustomize={handlers.handleCustomizeFromPreview}
          onDirectImport={handlers.handleDirectImport}
          onImport={handlers.handleTemplateImport}
          packConfirmPack={packConfirm.selectedPack}
          packConfirmVisible={!!packConfirm.selectedPack}
          onPackCancel={packConfirm.handleCancel}
          onPackConfirm={handlePackConfirm}
        />
      </>
    );
  }

  return (
    <>
      <MainBrowseView
        exploreAllSection={
          <CategoryRowsSection
            groups={groups}
            importedTemplateIds={state.importedTemplateIds}
            importingTemplateId={state.importingTemplateId}
            totalCount={totalCount}
            onBrowseAll={handleSeeAll}
            onImport={handleImport}
            onPreview={handlers.handleTemplatePreview}
            onSeeAllRow={viewNav.openCategory}
          />
        }
        featuredGoalId={featuredGoalId}
        featuredStarterTemplates={featuredStarterTemplates}
        feedbackOverlays={
          <FeedbackOverlays
            showCelebration={state.showCelebration}
            showToast={state.showToast}
            toastMessage={state.toastMessage}
            toastTemplateData={state.toastTemplateData}
            onDismissCelebration={() => state.setShowCelebration(false)}
            onDismissToast={() => state.setShowToast(false)}
          />
        }
        habitCountsByGoalId={habitCountsByGoalId}
        importedTemplateIds={state.importedTemplateIds}
        importingTemplateId={state.importingTemplateId}
        isSearchActive={state.isSearchActive}
        modals={
          <TemplatesScreenModals
            importedTemplateIds={state.importedTemplateIds}
            importingTemplateId={state.importingTemplateId}
            previewTemplate={state.previewTemplate}
            showCustomizeModal={state.showCustomizeModal}
            showFullsizePreview={state.showFullsizePreview}
            showPaywall={state.showPaywall}
            onCloseCustomize={() => state.setShowCustomizeModal(false)}
            onCloseFullsize={() => state.setShowFullsizePreview(false)}
            onCloseLibrary={onCloseLibrary}
            onClosePaywall={() => state.setShowPaywall(false)}
            onCustomize={handlers.handleCustomizeFromPreview}
            onDirectImport={handlers.handleDirectImport}
            onImport={handlers.handleTemplateImport}
            packConfirmPack={packConfirm.selectedPack}
            packConfirmVisible={!!packConfirm.selectedPack}
            onPackCancel={packConfirm.handleCancel}
            onPackConfirm={handlePackConfirm}
          />
        }
        onGoalSelect={handleGoalSelect}
        onImport={handleImport}
        onPreview={handlers.handleTemplatePreview}
        onSearchChange={state.setSearchQuery}
        onSearchClear={() => state.setSearchQuery('')}
        onSeeAll={handleSeeAll}
        popularTemplates={mainBrowseData.popularTemplates}
        premiumPacksSection={
          <PremiumPacksSection
            packs={mainBrowseData.premiumPacks}
            onPackPress={packConfirm.handlePackPress}
          />
        }
        searchAnimatedStyle={props.animations.searchAnimatedStyle}
        searchQuery={state.searchQuery}
        searchResultsSection={
          <SearchResults
            filteredTemplates={props.filteredTemplates}
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
      />
    </>
  );
}

interface TemplatesScreenProps {
  onCloseLibrary?: () => void;
}

export default function TemplatesScreen({
  onCloseLibrary,
}: TemplatesScreenProps = {}) {
  return (
    <ScreenErrorBoundary screenName='Templates'>
      <TemplatesScreenContent onCloseLibrary={onCloseLibrary} />
    </ScreenErrorBoundary>
  );
}
