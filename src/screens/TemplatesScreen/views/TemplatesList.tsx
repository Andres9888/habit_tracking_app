/**
 * Template list with scroll shadows for CategorySearchView
 */

import { useCallback, useRef } from 'react';
import { FlatList, View } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { useTemplatesStyles } from '../../templates/templatesScreenStyles';
import { ScrollShadows, TemplatesListEmpty } from '../components';
import { useScrollShadows } from '../useScrollShadows';
import { TemplateListCard } from './TemplateListCard';
import type { ViewMode } from '../TemplatesScreen.types';

interface TemplatesListProps {
  effectiveViewMode: ViewMode;
  filteredTemplates: Doc<'templates'>[];
  hasActiveFilters: boolean;
  importingTemplateId: Id<'templates'> | null;
  selectedCategory: string;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onResetFilters: () => void;
}

export function TemplatesList(props: TemplatesListProps) {
  const styles = useTemplatesStyles();
  const {
    effectiveViewMode,
    filteredTemplates,
    hasActiveFilters,
    importingTemplateId,
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
        importingTemplateId={importingTemplateId}
        item={item}
        onImport={onImport}
        onPreview={onPreview}
      />
    ),
    [importingTemplateId, onImport, onPreview]
  );

  // Fixed height for getItemLayout optimization
  const ITEM_HEIGHT = 88;

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.listWrapper}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.listContent}
        data={filteredTemplates}
        getItemLayout={getItemLayout}
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
