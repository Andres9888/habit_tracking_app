/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { PackConfirmSheet } from '../../components/PackConfirmSheet';
import { PaywallSheet } from '../../components/PaywallSheet';
import type { Doc } from '../../../convex/_generated/dataModel';
import { CategoryGrid } from './components/CategoryGrid';
import { PremiumPacksSection } from './components/PremiumPacksSection';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplateModals } from './components';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { FeedbackOverlays } from './views/FeedbackOverlays';
import { MainBrowseView } from './views/MainBrowseView';
import { renderCategorySearch } from './views/renderCategorySearch';
import { renderSubView } from './views/renderSubView';

function TemplatesScreenContent() {
  const props = useTemplatesScreenProps();
  const { data, state, handlers, viewNav, mainBrowseData, packConfirm } = props;

  if (!data.isLoading && !data.allTemplates?.length) {
    return (
      <TemplatesEmptyState
        isSeeding={state.isSeeding}
        onSeedTemplates={handlers.handleSeedTemplates}
      />
    );
  }

  if (state.effectiveViewMode === 'category' || state.effectiveViewMode === 'search')
    return renderCategorySearch(props);

  const handleImport = (t: Doc<'templates'>) => handlers.handleDirectImport(t._id);
  const subView = renderSubView({
    activeView: viewNav.activeView, allTemplates: data.allTemplates,
    importedTemplateIds: state.importedTemplateIds, importingTemplateId: state.importingTemplateId,
    onBack: viewNav.goBack, onImport: handleImport, onPreview: handlers.handleTemplatePreview,
  });
  if (subView) return subView;

  return (
    <MainBrowseView
      categoryGrid={
        <CategoryGrid
          categories={mainBrowseData.categoryList}
          onSelectCategory={viewNav.openCategory}
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
      headerAnimatedStyle={props.animations.headerAnimatedStyle}
      importedTemplateIds={state.importedTemplateIds}
      importingTemplateId={state.importingTemplateId}
      isPremiumUser={data.isPremiumUser}
      modals={
        <>
          <TemplateModals
            importedTemplateIds={state.importedTemplateIds}
            importingTemplateId={state.importingTemplateId}
            previewTemplate={state.previewTemplate}
            showCustomizeModal={state.showCustomizeModal}
            showFullsizePreview={state.showFullsizePreview}
            onCloseCustomize={() => state.setShowCustomizeModal(false)}
            onCloseFullsize={() => state.setShowFullsizePreview(false)}
            onCustomize={handlers.handleCustomizeFromPreview}
            onDirectImport={handlers.handleDirectImport}
            onImport={handlers.handleTemplateImport}
          />
          <PaywallSheet visible={state.showPaywall} onClose={() => state.setShowPaywall(false)} />
          <PackConfirmSheet
            pack={packConfirm.selectedPack} visible={!!packConfirm.selectedPack}
            onCancel={packConfirm.handleCancel} onConfirm={packConfirm.handleConfirm}
          />
        </>
      }
      onFeaturedPress={() => viewNav.openCategory('morning_routine')}
      onImport={handleImport}
      onPreview={handlers.handleTemplatePreview}
      onSearchChange={state.setSearchQuery}
      onSearchClear={() => state.setSearchQuery('')}
      onSeeAll={viewNav.openSeeAll}
      popularTemplates={mainBrowseData.popularTemplates}
      premiumPacksSection={
        <PremiumPacksSection packs={mainBrowseData.premiumPacks} onPackPress={packConfirm.handlePackPress} />
      }
      searchAnimatedStyle={props.animations.searchAnimatedStyle}
      searchQuery={state.searchQuery}
      userHabitCount={data.userHabitCount}
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
