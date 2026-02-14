/**
 * Template list with scroll shadows for CategorySearchView
 */

import { useCallback, useRef } from 'react';
import { FlatList, View } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
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
  isPremiumUser: boolean;
  selectedCategory: string;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onResetFilters: () => void;
}

export function TemplatesList(props: TemplatesListProps) {
  const {
    effectiveViewMode,
    filteredTemplates,
    hasActiveFilters,
    importingTemplateId,
    isPremiumUser,
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
        isPremiumUser={isPremiumUser}
        item={item}
        onImport={onImport}
        onPreview={onPreview}
      />
    ),
    [importingTemplateId, isPremiumUser, onImport, onPreview]
  );

  return (
    <View style={styles.listWrapper}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.listContent}
        data={filteredTemplates}
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
