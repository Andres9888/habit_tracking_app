/**
 * Category/Search view mode - shows filtered template list
 */

import { Pressable, View } from 'react-native';
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
        onCreateCustom={h.handleBackToBrowse}
        onSelectCategory={(categoryId) => {
          p.setSearchQuery(p.getCategoryLabel(categoryId));
        }}
        searchQuery={p.searchQuery}
        selectedCategory={p.selectedCategory}
        onImport={handleImport}
        onPreview={h.handleTemplatePreview}
        onResetFilters={h.handleResetFilters}
      />
      <TemplateModals
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
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
        showCelebration={p.showCelebration}
        showToast={p.showToast}
        toastMessage={p.toastMessage}
        toastTemplateData={p.toastTemplateData}
        onDismissCelebration={() => p.setShowCelebration(false)}
        onDismissToast={() => p.setShowToast(false)}
      />
      {p.showSortOptions ? (
        <Pressable
          accessibilityLabel='Close sort options'
          accessibilityRole='button'
          style={styles.dropdownBackdrop}
          onPress={() => p.setShowSortOptions(false)}
        />
      ) : null}
    </View>
  );
}
