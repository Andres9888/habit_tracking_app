/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesLoadingState } from './components/TemplatesLoadingState';
import { useTemplatesScreenProps } from './hooks/useTemplatesScreenProps';
import { BrowseView, CategorySearchView } from './views';

function TemplatesScreenContent() {
  const props = useTemplatesScreenProps();
  const { data, state, handlers, filteredTemplates, getCategoryLabel } = props;

  if (data.isLoading) return <TemplatesLoadingState />;
  if (!data.allTemplates?.length) {
    return (
      <TemplatesEmptyState
        isSeeding={state.isSeeding}
        onSeedTemplates={handlers.handleSeedTemplates}
      />
    );
  }

  const isCategoryOrSearchMode =
    state.effectiveViewMode === 'category' ||
    state.effectiveViewMode === 'search';
  if (isCategoryOrSearchMode) {
    return (
      <CategorySearchView
        categories={data.categories}
        effectiveViewMode={state.effectiveViewMode}
        filteredTemplates={filteredTemplates}
        getCategoryLabel={getCategoryLabel}
        handlers={handlers}
        hasActiveFilters={state.hasActiveFilters}
        importedTemplateIds={state.importedTemplateIds}
        importingTemplateId={state.importingTemplateId}
        previewTemplate={state.previewTemplate}
        researchOnly={state.researchOnly}
        searchQuery={state.searchQuery}
        selectedCategory={state.selectedCategory}
        setResearchOnly={state.setResearchOnly}
        setSearchQuery={state.setSearchQuery}
        setShowCustomizeModal={state.setShowCustomizeModal}
        setShowFullsizePreview={state.setShowFullsizePreview}
        setShowSortOptions={state.setShowSortOptions}
        setShowToast={state.setShowToast}
        showCustomizeModal={state.showCustomizeModal}
        showFullsizePreview={state.showFullsizePreview}
        showSortOptions={state.showSortOptions}
        showToast={state.showToast}
        sortOption={state.sortOption}
        toastMessage={state.toastMessage}
      />
    );
  }

  return (
    <BrowseView
      animations={props.animations}
      browseTab={state.browseTab}
      categories={data.categories}
      expandedCategories={state.expandedCategories}
      filteredTemplates={filteredTemplates}
      handlers={handlers}
      importedTemplateIds={state.importedTemplateIds}
      importingTemplateId={state.importingTemplateId}
      isPremiumUser={props.isPremiumUser}
      previewTemplate={state.previewTemplate}
      researchOnly={state.researchOnly}
      scienceCountsByCategory={props.scienceCountsByCategory}
      scrollViewRef={state.scrollViewRef}
      searchQuery={state.searchQuery}
      setResearchOnly={state.setResearchOnly}
      setSearchQuery={state.setSearchQuery}
      setShowCustomizeModal={state.setShowCustomizeModal}
      setShowFullsizePreview={state.setShowFullsizePreview}
      setShowSortOptions={state.setShowSortOptions}
      setShowToast={state.setShowToast}
      showCustomizeModal={state.showCustomizeModal}
      showFullsizePreview={state.showFullsizePreview}
      showSortOptions={state.showSortOptions}
      showToast={state.showToast}
      sortOption={state.sortOption}
      tabIndicator={props.tabIndicator}
      templatesByCategory={props.templatesByCategory}
      toastMessage={state.toastMessage}
      totalCount={data.allTemplates?.length || 0}
      onCloseSortOptions={() => state.setShowSortOptions(false)}
      onTabPress={props.handleTabPress}
    />
  );
}

export default function TemplatesScreen() {
  return (
    <ErrorBoundary>
      <TemplatesScreenContent />
    </ErrorBoundary>
  );
}
