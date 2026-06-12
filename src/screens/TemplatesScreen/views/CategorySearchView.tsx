/** Category/search view mode — filtered template list. */
import { View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import {
  CategoryHeader,
  FilterControls,
  SearchBar,
  TemplateModals,
} from '../components';
import type { CategorySearchViewProps } from './CategorySearchView.types';
import { FeedbackOverlays } from './FeedbackOverlays';
import { SortOptionsBackdrop } from './SortOptionsBackdrop';
import { TemplatesList } from './TemplatesList';

export function CategorySearchView(p: CategorySearchViewProps) {
  const { colors } = useThemeColors();
  const { handlers: h, filteredTemplates: templates } = p;
  const handleImport = (
    templateId: Parameters<typeof h.handleTemplateImport>[0]
  ) => {
    void h.handleTemplateImport(templateId);
  };

  return (
    <View
      testID='templates-search-results'
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <CategoryHeader
        categories={p.categories}
        filteredCount={templates.length}
        getCategoryLabel={p.getCategoryLabel}
        searchQuery={p.searchQuery}
        selectedCategory={p.selectedCategory}
        viewMode={p.effectiveViewMode}
        onBackPress={h.handleBackToBrowse}
      />
      <View style={styles.searchSection}>
        <SearchBar
          autoFocus={p.searchQuery.length > 0}
          inputHint='Search habits, categories, or science'
          value={p.searchQuery}
          onChangeText={p.setSearchQuery}
          onClear={() => p.setSearchQuery('')}
        />
        <View style={styles.controlRow}>
          <FilterControls
            showSortOptions={p.showSortOptions}
            sortOption={p.sortOption}
            onSelectSort={h.handleSelectSortOption}
            onToggleSortOptions={() => p.setShowSortOptions((v) => !v)}
          />
        </View>
      </View>
      <TemplatesList
        effectiveViewMode={p.effectiveViewMode}
        filteredTemplates={templates}
        getCategoryLabel={p.getCategoryLabel}
        hasActiveFilters={p.hasActiveFilters}
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
        searchQuery={p.searchQuery}
        selectedCategory={p.selectedCategory}
        onImport={handleImport}
        onPreview={h.handleTemplatePreview}
        onResetFilters={h.handleResetFilters}
      />
      <TemplateModals
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
        previewInitialAnchor={p.previewInitialAnchor}
        previewTemplate={p.previewTemplate}
        showCustomizeModal={p.showCustomizeModal}
        showFullsizePreview={p.showFullsizePreview}
        onCloseCustomize={() => p.setShowCustomizeModal(false)}
        onCloseFullsize={() => p.setShowFullsizePreview(false)}
        onCustomize={h.handleCustomizeFromPreview}
        onDirectImport={h.handleDirectImport}
        onImport={h.handleTemplateImport}
      />
      <FeedbackOverlays
        feedbackVariant={null}
        sessionImportCount={0}
        showCelebration={p.showCelebration}
        showToast={p.showToast}
        toastMessage={p.toastMessage}
        toastOnAction={p.toastOnAction}
        toastTemplateData={p.toastTemplateData}
        onAddAnother={() => p.setShowToast(false)}
        onDismissCelebration={() => p.setShowCelebration(false)}
        onDismissToast={() => p.setShowToast(false)}
        onViewHabit={() => p.setShowToast(false)}
      />
      <SortOptionsBackdrop
        visible={p.showSortOptions}
        onClose={() => p.setShowSortOptions(false)}
      />
    </View>
  );
}
