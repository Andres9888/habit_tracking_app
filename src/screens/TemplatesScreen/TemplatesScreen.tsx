/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import type { Doc } from '../../../convex/_generated/dataModel';
import { CategoryGrid } from './components/CategoryGrid';
import { ExploreAllSection, useGroupedTemplates } from './components/ExploreAllSection';
import { PremiumPacksSection } from './components/PremiumPacksSection';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesScreenModals } from './components';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './views/FeedbackOverlays';
import { MainBrowseView } from './views/MainBrowseView';
import { renderCategorySearch } from './views/renderCategorySearch';
import { renderSubView } from './views/renderSubView';

function TemplatesScreenContent() {
  const props = useTemplatesScreenProps();
  const { data, handlers, mainBrowseData, packConfirm, state, viewNav } = props;
  const { groups, totalCount } = useGroupedTemplates(data.allTemplates);
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
  if (subView) return subView;

  return (
    <MainBrowseView
      categoryGrid={
        <CategoryGrid
          categories={mainBrowseData.categoryList}
          onSelectCategory={(categoryId) =>
            handlers.handleSelectCategory(categoryId)
          }
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
      onFeaturedPress={(categoryId: string) =>
        handlers.handleSelectCategory(categoryId)
      }
      onImport={handleImport}
      onPreview={handlers.handleTemplatePreview}
      onSearchChange={state.setSearchQuery}
      onSearchClear={() => state.setSearchQuery('')}
      onSelectQuickFilter={handleSelectCategory}
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
  );
}

export default function TemplatesScreen() {
  return (
    <ScreenErrorBoundary screenName='Templates'>
      <TemplatesScreenContent />
    </ScreenErrorBoundary>
  );
}
