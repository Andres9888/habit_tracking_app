/* eslint-disable max-lines */
/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { useCallback, useMemo, useState } from 'react';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import {
  ExploreAllSection,
  useGroupedTemplates,
} from './components/ExploreAllSection';
import { PremiumPacksSection } from './components/PremiumPacksSection';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesScreenModals } from './components';
import { PostImportSetupSheet } from '../templates/PostImportSetupSheet';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './views/FeedbackOverlays';
import { MainBrowseView } from './views/MainBrowseView';
import { renderCategorySearch } from './views/renderCategorySearch';
import { renderSubView } from './views/renderSubView';
import {
  GOAL_COLLECTIONS,
  getFeaturedGoalId,
  type GoalCollection,
} from './data/goalCollections';

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
  const browseAllCategoriesPreviewIcons = useMemo(
    () => mainBrowseData.categoryList.slice(0, 4).map((cat) => cat.icon),
    [mainBrowseData.categoryList]
  );
  const browseAllCategoriesTotalCount = data.allTemplates?.length ?? 0;

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
        browseAllCategoriesPreviewIcons={browseAllCategoriesPreviewIcons}
        browseAllCategoriesTotalCount={browseAllCategoriesTotalCount}
        browseAllCategoryCount={mainBrowseData.categoryList.length}
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
        featuredGoalId={featuredGoalId}
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
