/**
 * Category/Search view mode - shows filtered template list
 */

import { Pressable, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import {
  CategoryHeader,
  FilterControls,
  ResearchFilterButton,
  SearchBar,
  TemplateModals,
} from '../components';
import type { CategorySearchViewProps } from './CategorySearchView.types';
import { FeedbackOverlays } from './FeedbackOverlays';
import { TemplatesList } from './TemplatesList';

export function CategorySearchView(p: CategorySearchViewProps) {
  const { colors } = useThemeColors();
  const { handlers: h, filteredTemplates: templates } = p;
  const toggle = () => p.setResearchOnly((v) => !v);
  const handleImport = (templateId: Parameters<typeof h.handleTemplateImport>[0]) => { void h.handleTemplateImport(templateId); };

  return (
    <View testID="templates-search-results" style={[styles.container, { backgroundColor: colors.background }]}>
      <CategoryHeader
        categories={p.categories}
        filteredCount={templates.length}
        getCategoryLabel={p.getCategoryLabel}
        selectedCategory={p.selectedCategory}
        viewMode={p.effectiveViewMode}
        onBackPress={h.handleBackToBrowse}
      />
      <View style={styles.searchSection}>
        <SearchBar
          placeholder='Search habits or science keywords'
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
          <ResearchFilterButton
            researchOnly={p.researchOnly}
            onToggle={toggle}
          />
        </View>
      </View>
      <TemplatesList
        effectiveViewMode={p.effectiveViewMode}
        filteredTemplates={templates}
        hasActiveFilters={p.hasActiveFilters}
        importingTemplateId={p.importingTemplateId}
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
      {p.showSortOptions ? <Pressable
          accessibilityLabel='Close sort options'
          accessibilityRole='button'
          style={styles.dropdownBackdrop}
          onPress={() => p.setShowSortOptions(false)}
        /> : null}
    </View>
  );
}
