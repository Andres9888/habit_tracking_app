/**
 * @fileoverview TemplatesScreen - Science-backed habit template browser
 * 
 * **What it shows:**
 * - Browse View (default):
 *   - Tab bar (All / By Category)
 *   - Search bar with research filter toggle
 *   - Sort options button
 *   - Template cards grid (all or grouped by category)
 *   - Scroll shadows (top/bottom)
 * - Category/Search View:
 *   - Category header or search results header
 *   - Filtered template list
 *   - Active filters indicator
 * - Empty state (when no templates seeded yet)
 * - Loading skeleton (during initial load)
 * 
 * **How users get here:**
 * - Main tab navigation (Templates tab)
 * - Browse tab from bottom nav
 * 
 * **Key interactions:**
 * - Search → Filters templates by name/description
 * - Category selection → Shows templates in that category
 * - "Research-backed only" toggle → Filters to science-backed templates
 * - Sort options → Name, Popularity, Science-backed
 * - Template card tap → Opens preview modal
 * - "Import" button → Adds template as new habit (with optional customization)
 * - Tab switch (All ↔ By Category) → Changes view layout
 * 
 * **View modes:**
 * - 'browse' - Default view with all templates
 * - 'category' - Filtered by selected category
 * - 'search' - Filtered by search query
 * 
 * **Technical notes:**
 * - 102 lines (main orchestration component)
 * - Delegates to BrowseView and CategorySearchView sub-views
 * - Uses custom hook: useTemplatesScreenProps (centralizes all state/handlers)
 * - Complex prop drilling (consider context or composition pattern)
 * - Handles seeding flow for empty template database
 */

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
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
    <ScreenErrorBoundary screenName="Templates">
      <TemplatesScreenContent />
    </ScreenErrorBoundary>
  );
}
