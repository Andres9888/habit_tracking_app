/**
 * Template list with scroll shadows for CategorySearchView
 */

import { useCallback, useRef } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { colors } from '../../../theme/colors';
import { styles } from '../../templates/templatesScreenStyles';
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
  onRefresh: () => Promise<void>;
  onResetFilters: () => void;
  refreshing: boolean;
}

export function TemplatesList(props: TemplatesListProps) {
  const {
    effectiveViewMode,
    filteredTemplates,
    hasActiveFilters,
    importingTemplateId,
    selectedCategory,
    onImport,
    onPreview,
    onRefresh,
    onResetFilters,
    refreshing,
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

  return (
    <View style={styles.listWrapper}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.listContent}
        data={filteredTemplates}
        refreshControl={
          <RefreshControl
            colors={[colors.primary[500]]}
            refreshing={refreshing}
            tintColor={colors.primary[500]}
            onRefresh={() => void onRefresh()}
          />
        }
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <TemplatesListEmpty
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
          />
        }
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
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
