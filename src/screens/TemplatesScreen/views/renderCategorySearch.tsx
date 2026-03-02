/**
 * Renders CategorySearchView with all required props
 */

import { CategorySearchView } from '.';

interface RenderParams {
  data: { categories: any };
  filteredTemplates: any;
  getCategoryLabel: any;
  handlers: any;
  state: any;
}

export function renderCategorySearch({ data, filteredTemplates, getCategoryLabel, handlers, state }: RenderParams) {
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
      setShowCelebration={state.setShowCelebration}
      setResearchOnly={state.setResearchOnly}
      setSearchQuery={state.setSearchQuery}
      setShowCustomizeModal={state.setShowCustomizeModal}
      setShowFullsizePreview={state.setShowFullsizePreview}
      setShowSortOptions={state.setShowSortOptions}
      setShowToast={state.setShowToast}
      showCelebration={state.showCelebration}
      showCustomizeModal={state.showCustomizeModal}
      showFullsizePreview={state.showFullsizePreview}
      showSortOptions={state.showSortOptions}
      showToast={state.showToast}
      sortOption={state.sortOption}
      toastMessage={state.toastMessage}
      toastTemplateData={state.toastTemplateData}
    />
  );
}
