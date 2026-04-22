/**
 * Explore All Habits — accordion of categories below curated browse sections.
 * Collapsed by default — tap a category to reveal its habits.
 */

import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { fontFamilies } from '../../../../theme/typography';
import { SectionHeader } from '../SectionHeader';
import { AccordionCategoryCard } from './AccordionCategoryCard';
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
        subtitle='Top 2 per category — tap to see the rest'
        title='Discover more habits'
      />
      <View style={s.accordion}>
        {groups.map((group) => (
          <AccordionCategoryCard
            key={group.category}
            group={group}
            importedTemplateIds={importedTemplateIds}
            importingTemplateId={importingTemplateId}
            onImport={onImport}
            onPreview={onPreview}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  accordion: {
    paddingTop: spacing.xs,
  },
  count: {
    flexShrink: 0,
    fontFamily: fontFamilies.monospace,
    fontSize: 12,
  },
});
