/**
 * Explore All Habits — grouped list below curated browse sections
 */

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { fontFamilies, typography } from '../../../../theme/typography';
import { SectionHeader } from '../SectionHeader';
import { CategoryGroupHeader } from './CategoryGroupHeader';
import { ExploreDivider } from './ExploreDivider';
import { ExploreHabitRow } from './ExploreHabitRow';
import type {
  CategoryGroup,
  ExploreAllSectionProps,
} from './ExploreAllSection.types';

function CategoryGroupSection({
  defaultExpanded = false,
  group,
  importedTemplateIds,
  importingTemplateId,
  onImport,
  onPreview,
}: {
  defaultExpanded?: boolean;
  group: CategoryGroup;
} & Pick<
  ExploreAllSectionProps,
  'importedTemplateIds' | 'importingTemplateId' | 'onImport' | 'onPreview'
>) {
  const [expanded, setExpanded] = useState(defaultExpanded);

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
      {(expanded ? group.templates : group.templates.slice(0, 3)).map((item) => (
        <ExploreHabitRow
          key={item._id}
          importedTemplateIds={importedTemplateIds}
          importingTemplateId={importingTemplateId}
          item={item}
          onImport={onImport}
          onPreview={onPreview}
        />
      ))}
    </View>
  );
}

export function ExploreAllSection({
  groups,
  importedTemplateIds,
  importingTemplateId,
  totalCount,
  onImport,
  onPreview,
}: ExploreAllSectionProps) {
  const { colors } = useThemeColors();
  if (!groups.length) return null;

  return (
    <View>
      <ExploreDivider />
      <SectionHeader
        rightSlot={
          <Text style={[s.count, { color: colors.text.tertiary }]}>
            {totalCount} habits
          </Text>
        }
        title='Browse by area'
      />
      <Text style={[s.intro, { color: colors.text.secondary }]}>
        Every strong habit fits into a larger part of your life.
      </Text>
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
  intro: { ...typography.caption, paddingBottom: spacing.sm, paddingHorizontal: spacing.base },
});
