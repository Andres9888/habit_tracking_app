/**
 * Renders CategorySearchView with all required props
 */

import { CategorySearchView } from '.';
import type { useTemplatesScreenProps } from '../hooks/useTemplatesScreenProps';

type RenderParams = Pick<
  ReturnType<typeof useTemplatesScreenProps>,
  'data' | 'filteredTemplates' | 'getCategoryLabel' | 'handlers' | 'state'
>;

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
      searchQuery={state.searchQuery}
      selectedCategory={state.selectedCategory}
      setShowCelebration={state.setShowCelebration}
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
