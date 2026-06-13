/**
 * CategoryRow — one horizontal carousel of templates for a single category.
 * Header shows category icon/label/count + "See all →"; body is a horizontal
 * FlatList of TrendingCards (matching PopularSection's card pattern).
 */

import { FlatList, StyleSheet, View } from 'react-native';
import { spacing } from '../../../../theme/spacing';
import { getCategoryMeta } from '../../data/categoryMeta';
import { SectionHeader } from '../SectionHeader';
import { SeeAllButton } from '../SectionHeader/SeeAllButton';
import { TrendingCard } from '../TrendingCard';
import type { CategoryRowProps } from './CategoryRowsSection.types';

const ROW_LIMIT = 10;

export function CategoryRow({
  group,
  importedTemplateIds,
  importingTemplateId,
  onImport,
  onPreview,
  onSeeAll,
}: CategoryRowProps) {
  const items = group.templates.slice(0, ROW_LIMIT);
  const subtitle = getCategoryMeta(group.category).subtitle;

  return (
    <View style={s.container}>
      <SectionHeader
        title={`${group.icon} ${group.label}`}
        subtitle={subtitle}
        rightSlot={
          <SeeAllButton
            accessibilityLabel={`See all ${group.label} habits`}
            label='See all →'
            onPress={onSeeAll}
          />
        }
      />
      <FlatList
        horizontal
        data={items}
        contentContainerStyle={s.list}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TrendingCard
            description={item.description}
            frequency={item.frequency}
            hasResearch={!!item.scientificReference}
            icon={item.icon}
            iconColor={item.iconColor}
            isImported={importedTemplateIds.has(item._id)}
            isImporting={importingTemplateId === item._id}
            name={item.name}
            popularityScore={item.popularityScore ?? 0}
            template={item}
            onImport={() => onImport(item)}
            onPress={() => onPreview(item)}
          />
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: spacing.lg },
  list: { gap: spacing.md, paddingHorizontal: spacing.base },
});
