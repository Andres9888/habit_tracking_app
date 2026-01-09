/**
 * Templates Screen - Main orchestration component
 * Browse and import science-backed habit templates
 */

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { TemplatesEmptyState } from './components/TemplatesEmptyState';
import { TemplatesLoadingState } from './components/TemplatesLoadingState';
import {
  useEntranceAnimations,
  useTabIndicator,
} from './TemplatesScreen.animations';
import { useTemplateHandlers } from './TemplatesScreen.handlers';
import { useTemplatesScreenState } from './TemplatesScreen.hooks';
import type { BrowseTab } from './TemplatesScreen.types';
import {
  useFilteredTemplates,
  useScienceCountsByCategory,
  useTemplatesByCategory,
  useTemplatesData,
} from './useTemplatesData';
import { BrowseView, CategorySearchView } from './views';

export default function TemplatesScreen() {
  const reducedMotion = useReduceMotion();
  const animations = useEntranceAnimations({ reducedMotion });
  const tabIndicator = useTabIndicator({ reducedMotion });
  const data = useTemplatesData();
  const state = useTemplatesScreenState({ categories: data.categories });

  const templatesByCategory = useTemplatesByCategory(data.allTemplates);
  const scienceCountsByCategory = useScienceCountsByCategory(data.allTemplates);
  const filteredTemplates = useFilteredTemplates(
    data.allTemplates,
    state.selectedCategory,
    state.researchOnly,
    state.searchQuery,
    state.sortOption
  );

  const handlers = useTemplateHandlers({
    flatListRef: state.flatListRef,
    importTemplate: data.importTemplate,
    seedAdditionalTemplates: data.seedAdditionalTemplates,
    seedNewScienceTemplates: data.seedNewScienceTemplates,
    seedTemplates: data.seedTemplates,
    setExpandedCategories: state.setExpandedCategories,
    setImportedTemplateIds: state.setImportedTemplateIds,
    setImportingTemplateId: state.setImportingTemplateId,
    setIsSeeding: state.setIsSeeding,
    setPreviewTemplate: state.setPreviewTemplate,
    setResearchOnly: state.setResearchOnly,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategory: state.setSelectedCategory,
    setShowCustomizeModal: state.setShowCustomizeModal,
    setShowFullsizePreview: state.setShowFullsizePreview,
    setShowSortOptions: state.setShowSortOptions,
    setShowToast: state.setShowToast,
    setSortOption: state.setSortOption,
    setToastMessage: state.setToastMessage,
    setViewMode: state.setViewMode,
  });

  const getCategoryLabel = (categoryId: string) =>
    data.categories?.find((c) => c.id === categoryId)?.label || categoryId;
  const handleTabPress = (tab: BrowseTab) => {
    state.setBrowseTab(tab);
    tabIndicator.setTabPosition(tab === 'categories' ? 0 : 1);
  };

  if (data.isLoading) return <TemplatesLoadingState />;
  if (!data.allTemplates?.length)
    return (
      <TemplatesEmptyState
        isSeeding={state.isSeeding}
        onSeedTemplates={handlers.handleSeedTemplates}
      />
    );

  if (
    state.effectiveViewMode === 'category' ||
    state.effectiveViewMode === 'search'
  ) {
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
      animations={animations}
      browseTab={state.browseTab}
      categories={data.categories}
      expandedCategories={state.expandedCategories}
      filteredTemplates={filteredTemplates}
      handlers={handlers}
      importedTemplateIds={state.importedTemplateIds}
      importingTemplateId={state.importingTemplateId}
      previewTemplate={state.previewTemplate}
      researchOnly={state.researchOnly}
      scienceCountsByCategory={scienceCountsByCategory}
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
      tabIndicator={tabIndicator}
      templatesByCategory={templatesByCategory}
      toastMessage={state.toastMessage}
      totalCount={data.allTemplates?.length || 0}
      onCloseSortOptions={() => state.setShowSortOptions(false)}
      onTabPress={handleTabPress}
    />
  );
}
