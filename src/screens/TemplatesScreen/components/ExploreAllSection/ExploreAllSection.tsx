/**
 * Explore All Habits — grouped list below curated browse sections
 */

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { fontFamilies, typography } from '../../../../theme/typography';
import { SectionHeader } from '../SectionHeader';
import { buildTopTemplateByCategory } from './buildTopTemplateByCategory';
import { CategoryGroupSection } from './CategoryGroupSection';
import { ExploreDivider } from './ExploreDivider';
import type { ExploreAllSectionProps } from './ExploreAllSection.types';

export function ExploreAllSection({
  groups,
  importedTemplateIds,
  importingTemplateId,
  totalCount,
  onImport,
  onPreview,
}: ExploreAllSectionProps) {
  const { colors } = useThemeColors();
  const templatesByCategory = useMemo(
    () => buildTopTemplateByCategory(groups),
    [groups]
  );
  if (groups.length === 0) return null;

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
          templatesByCategory={templatesByCategory}
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
