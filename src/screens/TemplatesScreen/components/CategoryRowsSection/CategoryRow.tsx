/**
 * CategoryRow — one horizontal carousel of templates for a single category.
 * Header shows category icon/label/count + "See all →"; body is a horizontal
 * FlatList of TrendingCards (matching PopularSection's card pattern).
 */

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { getCategoryMeta } from '../../data/categoryMeta';
import { SectionHeader } from '../SectionHeader';
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
  const { colors } = useThemeColors();
  const items = group.templates.slice(0, ROW_LIMIT);
  const subtitle = getCategoryMeta(group.category).subtitle;

  return (
    <View style={s.container}>
      <SectionHeader
        title={`${group.icon} ${group.label}`}
        subtitle={subtitle}
        rightSlot={
          <Pressable
            accessibilityLabel={`See all ${group.label} habits`}
            accessibilityRole='button'
            hitSlop={8}
            onPress={onSeeAll}
          >
            <Text style={[s.seeAll, { color: colors.primary[600] }]}>
              See all →
            </Text>
          </Pressable>
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
  seeAll: { ...typography.bodySmall, fontWeight: '600' },
});
