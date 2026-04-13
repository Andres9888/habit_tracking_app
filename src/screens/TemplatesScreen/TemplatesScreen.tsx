/* eslint-disable max-lines */
/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { useCallback, useMemo, useState } from 'react';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import { CategoryGrid } from './components/CategoryGrid';
import {
  ExploreAllSection,
  useGroupedTemplates,
} from './components/ExploreAllSection';
import { getTimeAwareFeatured } from './components/FeaturedCollection/featuredCollections';
import { PremiumPacksSection } from './components/PremiumPacksSection';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesScreenModals } from './components';
import { PostImportSetupSheet } from '../templates/PostImportSetupSheet';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './views/FeedbackOverlays';
import { MainBrowseView } from './views/MainBrowseView';
import { renderCategorySearch } from './views/renderCategorySearch';
import { renderSubView } from './views/renderSubView';
import type { GoalCollection } from './data/goalCollections';

function TemplatesScreenContent() {
  // Post-import setup state
  const [setupHabitId, setSetupHabitId] = useState<Id<'habits'> | null>(null);
  const [setupTemplate, setSetupTemplate] = useState<Doc<'templates'> | null>(
    null
  );
  const [showSetupSheet, setShowSetupSheet] = useState(false);

  const handlePostImportSetup = useCallback(
    (habitId: Id<'habits'>, template: Doc<'templates'>) => {
      setSetupHabitId(habitId);
      setSetupTemplate(template);
      setShowSetupSheet(true);
    },
    []
  );

  const props = useTemplatesScreenProps({
    onPostImportSetup: handlePostImportSetup,
  });
  const { data, handlers, mainBrowseData, packConfirm, state, viewNav } = props;
  const { groups, totalCount } = useGroupedTemplates(data.allTemplates);

  const handleCloseSetupSheet = useCallback(() => {
    setShowSetupSheet(false);
    setSetupHabitId(null);
    setSetupTemplate(null);
  }, []);

  const handleDrillIntoCategory = useCallback(
    (categoryId: string) => {
      state.setSearchQuery('');
      viewNav.openCategory(categoryId);
    },
    [state, viewNav]
  );

  const handleGoalSelect = useCallback(
    (goal: GoalCollection) => {
      handleDrillIntoCategory(goal.categories[0]);
    },
    [handleDrillIntoCategory]
  );

  const handleStartHerePress = useCallback(() => {
    handleDrillIntoCategory('morning_routine');
  }, [handleDrillIntoCategory]);

  const featuredHabitCount = useMemo(() => {
    const categoryId = getTimeAwareFeatured().categoryId;
    return (
      data.allTemplates?.filter((t) => t.category === categoryId).length ?? 0
    );
  }, [data.allTemplates]);
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
  const handleSelectCategory = (categoryId: string | null) => {
    handlers.handleSelectCategory(categoryId ?? 'all');
  };
  const isNewUser = (data.userHabitCount ?? 0) <= 1;

  if (!data.isLoading && !data.allTemplates?.length) {
    return (
      <TemplatesEmptyState
        isSeeding={state.isSeeding}
        onSeedTemplates={handleSeedTemplates}
      />
    );
  }

  if (state.effectiveViewMode !== 'browse') return renderCategorySearch(props);
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
          onClosePaywall={() => state.setShowPaywall(false)}
          onCustomize={handlers.handleCustomizeFromPreview}
          onDirectImport={handlers.handleDirectImport}
          onImport={handlers.handleTemplateImport}
          packConfirmPack={packConfirm.selectedPack}
          packConfirmVisible={!!packConfirm.selectedPack}
          onPackCancel={packConfirm.handleCancel}
          onPackConfirm={handlePackConfirm}
        />
        <PostImportSetupSheet
          habitId={setupHabitId}
          template={setupTemplate}
          visible={showSetupSheet}
          onClose={handleCloseSetupSheet}
        />
      </>
    );
  }

  return (
    <>
      <MainBrowseView
        isNewUser={isNewUser}
        onGoalSelect={handleGoalSelect}
        onStartHerePress={handleStartHerePress}
        categoryGrid={
          <CategoryGrid
            categories={mainBrowseData.categoryList}
            onSelectCategory={handleDrillIntoCategory}
          />
        }
        exploreAllSection={
          <ExploreAllSection
            getCategoryLabel={props.getCategoryLabel}
            groups={groups}
            importedTemplateIds={state.importedTemplateIds}
            importingTemplateId={state.importingTemplateId}
            totalCount={totalCount}
            onImport={handleImport}
            onPreview={handlers.handleTemplatePreview}
          />
        }
        featuredHabitCount={featuredHabitCount}
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
        importedTemplateIds={state.importedTemplateIds}
        importingTemplateId={state.importingTemplateId}
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
        onFeaturedPress={handleDrillIntoCategory}
        onImport={handleImport}
        onPreview={handlers.handleTemplatePreview}
        onSearchChange={state.setSearchQuery}
        onSearchClear={() => state.setSearchQuery('')}
        onSelectQuickFilter={(categoryId) => {
          if (categoryId !== null) handleDrillIntoCategory(categoryId);
        }}
        onSeeAll={handleSeeAll}
        popularTemplates={mainBrowseData.popularTemplates}
        premiumPacksSection={
          <PremiumPacksSection
            packs={mainBrowseData.premiumPacks}
            onPackPress={packConfirm.handlePackPress}
          />
        }
        quickFilterCategories={mainBrowseData.quickFilterCategories}
        searchAnimatedStyle={props.animations.searchAnimatedStyle}
        searchQuery={state.searchQuery}
        selectedQuickFilter={
          state.selectedCategory === 'all' ? null : state.selectedCategory
        }
      />
      <PostImportSetupSheet
        habitId={setupHabitId}
        template={setupTemplate}
        visible={showSetupSheet}
        onClose={handleCloseSetupSheet}
      />
    </>
  );
}

export default function TemplatesScreen() {
  return (
    <ScreenErrorBoundary screenName='Templates'>
      <TemplatesScreenContent />
    </ScreenErrorBoundary>
  );
}
