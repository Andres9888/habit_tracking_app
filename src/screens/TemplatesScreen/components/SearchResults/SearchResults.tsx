/**
 * SearchResults — inline search results surface on MainBrowseView.
 *
 * Replaces the prior full-view swap to CategorySearchView. Lives inside
 * MainBrowseView below the sticky SearchBar, so the bar never remounts.
 */

import { Pressable, Text, View } from 'react-native';
import type { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { SortOption } from '../../../templates/constants';
import { styles as templateStyles } from '../../../templates/templatesScreenStyles';
import { TemplatesList } from '../../views/TemplatesList';
import { FilterControls } from '../FilterControls';
import { styles as s } from './styles';

interface SearchResultsProps {
  filteredTemplates: Doc<'templates'>[];
  getCategoryLabel: (categoryId: string) => string;
  hasActiveFilters: boolean;
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onResetFilters: () => void;
  onSelectSort: (option: SortOption) => void;
  onToggleSortOptions: () => void;
  searchQuery: string;
  selectedCategory: string;
  setShowSortOptions: (visible: boolean) => void;
  showSortOptions: boolean;
  sortOption: SortOption;
}

export function SearchResults(p: SearchResultsProps) {
  const { colors } = useThemeColors();
  const count = p.filteredTemplates.length;
  const label = count === 1 ? 'habit' : 'habits';
  const trimmedQuery = p.searchQuery.trim();
  const showSearchEmptyState = count === 0 && trimmedQuery.length > 0;
  const headerText = trimmedQuery
    ? `${count} ${label} for “${trimmedQuery}”`
    : p.selectedCategory === 'all'
      ? `${count} ${label}`
      : `${count} ${label} · ${p.getCategoryLabel(p.selectedCategory)}`;

  return (
    <View style={s.wrap}>
      <View style={s.resultHeader}>
        <Text style={[s.count, { color: colors.text.secondary }]}>
          {headerText}
        </Text>
        <FilterControls
          showSortOptions={p.showSortOptions}
          sortOption={p.sortOption}
          onSelectSort={p.onSelectSort}
          onToggleSortOptions={p.onToggleSortOptions}
        />
      </View>
      {showSearchEmptyState ? (
        <View style={[s.empty, { borderColor: colors.border }]}>
          <Text style={[s.emptyTitle, { color: colors.text.primary }]}>
            No habits match “{trimmedQuery}”
          </Text>
          <Text style={[s.emptyDescription, { color: colors.text.secondary }]}>
            Try a different word, or browse by category below.
          </Text>
        </View>
      ) : (
        <TemplatesList
          effectiveViewMode='search'
          filteredTemplates={p.filteredTemplates}
          getCategoryLabel={p.getCategoryLabel}
          hasActiveFilters={p.hasActiveFilters}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          searchQuery={p.searchQuery}
          selectedCategory={p.selectedCategory}
          onImport={p.onImport}
          onPreview={p.onPreview}
          onResetFilters={p.onResetFilters}
        />
      )}
      {p.showSortOptions ? (
        <Pressable
          accessibilityLabel='Close sort options'
          accessibilityRole='button'
          style={templateStyles.dropdownBackdrop}
          onPress={() => p.setShowSortOptions(false)}
        />
      ) : null}
    </View>
  );
}
