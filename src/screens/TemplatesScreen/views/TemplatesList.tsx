/**
 * Template list with scroll shadows for CategorySearchView
 */

import { useCallback, useRef } from 'react';
import { FlatList, View } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { styles } from '../../templates/templatesScreenStyles';
import { ScrollShadows, TemplatesListEmpty } from '../components';
import { formatPopularityCount } from '../utils/formatPopularityCount';
import { useScrollShadows } from '../useScrollShadows';
import { TemplateListCard } from './TemplateListCard';
import type { ViewMode } from '../TemplatesScreen.types';

interface TemplatesListProps {
  effectiveViewMode: ViewMode;
  filteredTemplates: Doc<'templates'>[];
  getCategoryLabel: (categoryId: string) => string;
  hasActiveFilters: boolean;
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  searchQuery: string;
  selectedCategory: string;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onResetFilters: () => void;
}

export function TemplatesList(props: TemplatesListProps) {
  const {
    effectiveViewMode,
    filteredTemplates,
    getCategoryLabel,
    hasActiveFilters,
    importedTemplateIds,
    importingTemplateId,
    searchQuery,
    selectedCategory,
    onImport,
    onPreview,
    onResetFilters,
  } = props;

  const flatListRef = useRef<FlatList<Doc<'templates'>>>(null);
  const scrollShadows = useScrollShadows({
    resetDeps: [selectedCategory, filteredTemplates.length, effectiveViewMode],
  });

  const renderItem = useCallback(
    ({ item }: { item: Doc<'templates'> }) => (
      <TemplateListCard
        getCategoryLabel={getCategoryLabel}
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
        item={item}
        popularityCount={formatPopularityCount(item.popularityScore)}
        searchQuery={searchQuery}
        onImport={onImport}
        onPreview={onPreview}
      />
    ),
    [
      getCategoryLabel,
      importedTemplateIds,
      importingTemplateId,
      onImport,
      onPreview,
      searchQuery,
    ]
  );

  return (
    <View style={styles.listWrapper}>
      <FlatList
        ref={flatListRef}
        keyboardDismissMode='on-drag'
        contentContainerStyle={styles.listContent}
        data={filteredTemplates}
        initialNumToRender={8}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <TemplatesListEmpty
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
          />
        }
        maxToRenderPerBatch={8}
        removeClippedSubviews
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        onContentSizeChange={scrollShadows.handleContentSizeChange}
        onLayout={scrollShadows.handleLayout}
        onScroll={scrollShadows.handleScroll}
      />
      <ScrollShadows
        showBottomShadow={scrollShadows.showBottomShadow}
        showTopShadow={scrollShadows.showTopShadow}
      />
    </View>
  );
}
