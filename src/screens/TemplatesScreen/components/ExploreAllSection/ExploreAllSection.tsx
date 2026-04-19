/**
 * Explore All Habits — grouped list below curated browse sections
 */

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontFamilies, fontWeights, typography } from '../../../../theme/typography';
import { spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { CategoryGroupHeader } from './CategoryGroupHeader';
import { ExploreDivider } from './ExploreDivider';
import { ExploreHabitRow } from './ExploreHabitRow';
import type { CategoryGroup, ExploreAllSectionProps } from './ExploreAllSection.types';

function CategoryGroupSection({
  group, importedTemplateIds, importingTemplateId, onImport, onPreview,
}: {
  group: CategoryGroup;
} & Pick<ExploreAllSectionProps, 'importedTemplateIds' | 'importingTemplateId' | 'onImport' | 'onPreview'>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <CategoryGroupHeader
        count={group.templates.length}
        expanded={expanded}
        icon={group.icon}
        label={group.label}
        subtitle={group.subtitle}
        onToggle={() => setExpanded((prev) => !prev)}
      />
      {expanded
        ? group.templates.map((item) => (
            <ExploreHabitRow
              key={item._id}
              importedTemplateIds={importedTemplateIds}
              importingTemplateId={importingTemplateId}
              item={item}
              onImport={onImport}
              onPreview={onPreview}
            />
          ))
        : null}
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
            Browse by category
          </Text>
          <Text style={[s.subtitle, { color: colors.text.secondary }]}>
            Sorted by popularity
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
  subtitle: { ...typography.caption, marginTop: 2 },
  title: { ...typography.heading3, fontWeight: fontWeights.bold },
});
