/**
 * CategoryRowsSection — Netflix-style stack of horizontal category carousels.
 * Replaces the old ExploreAllSection accordion. Shows top N priority categories
 * as rows; "Browse all" footer leads to the full sortable seeAll list.
 */

import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { getCategoryPriority } from '../../data/categoryPriority';
import { SectionHeader } from '../SectionHeader';
import { CategoryRow } from './CategoryRow';
import type { CategoryRowsSectionProps } from './CategoryRowsSection.types';

const ROW_COUNT = 6;

export function CategoryRowsSection({
  groups,
  importedTemplateIds,
  importingTemplateId,
  totalCount,
  onBrowseAll,
  onImport,
  onPreview,
  onSeeAllRow,
}: CategoryRowsSectionProps) {
  const { colors } = useThemeColors();

  const topGroups = useMemo(
    () =>
      [...groups]
        .sort(
          (a, b) =>
            getCategoryPriority(a.category) - getCategoryPriority(b.category)
        )
        .slice(0, ROW_COUNT),
    [groups]
  );

  if (!topGroups.length) return null;

  return (
    <View style={s.section}>
      <SectionHeader
        title='Browse by area'
        subtitle='Find the habits that shape who you become'
      />
      {topGroups.map((group) => (
        <CategoryRow
          key={group.category}
          group={group}
          importedTemplateIds={importedTemplateIds}
          importingTemplateId={importingTemplateId}
          onImport={onImport}
          onPreview={onPreview}
          onSeeAll={() => onSeeAllRow(group.category)}
        />
      ))}
      <Pressable
        accessibilityLabel={`Browse all ${totalCount} habits across every category`}
        accessibilityRole='button'
        style={[
          s.browseAll,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
        onPress={onBrowseAll}
      >
        <Text style={[s.browseAllLabel, { color: colors.text.primary }]}>
          Browse all {totalCount} habits
        </Text>
        <Text style={[s.browseAllArrow, { color: colors.primary[600] }]}>→</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  browseAll: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  browseAllArrow: { ...typography.body, fontWeight: '700' },
  browseAllLabel: { ...typography.bodySmall, fontWeight: '700' },
  section: { marginTop: spacing.lg },
});
