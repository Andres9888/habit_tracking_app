/**
 * PopularSection - "Trending Now" header + horizontal carousel of TrendingCards
 */

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { SectionHeader } from '../SectionHeader';
import { TrendingCard } from '../TrendingCard';

interface PopularSectionProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  templates: Doc<'templates'>[];
}

export function PopularSection({
  importedTemplateIds,
  importingTemplateId,
  onImport,
  onPreview,
  onSeeAll,
  templates,
}: PopularSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View testID='templates-trending-section' style={s.container}>
      <SectionHeader
        rightSlot={
          <Pressable
            testID='templates-trending-see-all'
            accessibilityLabel='See all trending templates'
            accessibilityRole='button'
            hitSlop={8}
            onPress={onSeeAll}
          >
            <Text style={[s.seeAll, { color: colors.primary[600] }]}>See all</Text>
          </Pressable>
        }
        title='Trending right now'
      />
      <FlatList
        testID='templates-popular-scroll'
        horizontal
        data={templates}
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
  container: { marginTop: spacing.base },
  list: { gap: spacing.md, paddingHorizontal: spacing.base },
  seeAll: { ...typography.bodySmall },
});
