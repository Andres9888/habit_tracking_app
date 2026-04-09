/**
 * Explore All Habits — grouped list below curated browse sections
 */

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamilies, fontWeights, typography } from '../../../../theme/typography';
import { spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { CategoryGroupHeader } from './CategoryGroupHeader';
import { ExploreDivider } from './ExploreDivider';
import { ExploreHabitRow } from './ExploreHabitRow';
import type { CategoryGroup, ExploreAllSectionProps } from './ExploreAllSection.types';

const INITIAL_SHOW = 3;

function CategoryGroupSection({
  group, importedTemplateIds, importingTemplateId, onImport, onPreview,
}: {
  group: CategoryGroup;
} & Pick<ExploreAllSectionProps, 'importedTemplateIds' | 'importingTemplateId' | 'onImport' | 'onPreview'>) {
  const { colors } = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const items = expanded ? group.templates : group.templates.slice(0, INITIAL_SHOW);
  const remaining = group.templates.length - INITIAL_SHOW;

  return (
    <View>
      <CategoryGroupHeader
        count={group.templates.length}
        icon={group.icon}
        label={group.label}
        subtitle={group.subtitle}
      />
      {items.map((item) => (
        <ExploreHabitRow
          key={item._id}
          importedTemplateIds={importedTemplateIds}
          importingTemplateId={importingTemplateId}
          item={item}
          onImport={onImport}
          onPreview={onPreview}
        />
      ))}
      {!expanded && remaining > 0 ? (
        <Pressable onPress={() => setExpanded(true)} style={s.showMore}>
          <Text style={[s.showMoreText, { color: colors.primary[600] }]}>
            Show all {group.templates.length} {group.label.toLowerCase()} habits
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ExploreAllSection({
  groups, importedTemplateIds, importingTemplateId, totalCount, onImport, onPreview,
}: ExploreAllSectionProps) {
  const { colors } = useThemeColors();
  if (!groups.length) return null;

  return (
    <View>
      <ExploreDivider />
      <View style={s.header}>
        <View style={s.headerText}>
          <Text style={[s.title, { color: colors.text.primary }]}>
            Discover more habits
          </Text>
          <Text style={[s.subtitle, { color: colors.text.secondary }]}>
            Browse by category, sorted by popularity
          </Text>
        </View>
        <Text style={[s.count, { color: colors.text.tertiary }]}>
          {totalCount} habits
        </Text>
      </View>
      {groups.map((group) => (
        <CategoryGroupSection
          key={group.category}
          group={group}
          importedTemplateIds={importedTemplateIds}
          importingTemplateId={importingTemplateId}
          onImport={onImport}
          onPreview={onPreview}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  count: { flexShrink: 0, fontFamily: fontFamilies.monospace, fontSize: 12 },
  header: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
  },
  headerText: { flex: 1, minWidth: 0 },
  showMore: { paddingLeft: spacing.base + spacing.md + 44 + spacing.md, paddingVertical: spacing.sm },
  showMoreText: { ...typography.caption, fontWeight: fontWeights.semibold },
  subtitle: { ...typography.caption, marginTop: 2 },
  title: { ...typography.heading3, fontWeight: fontWeights.bold },
});
