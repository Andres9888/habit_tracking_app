/**
 * PopularSection - "Trending Now" header + horizontal carousel of TrendingCards
 */

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { isSimpleHabit } from '../../utils/simplicityScore';
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
      <View style={s.header}>
        <Text style={[s.title, { color: colors.text.primary }]}>Trending right now</Text>
        <Pressable
          testID='templates-trending-see-all'
          accessibilityLabel='See all trending templates'
          accessibilityRole='button'
          hitSlop={8}
          onPress={onSeeAll}
        >
          <Text style={[s.seeAll, { color: colors.primary[600] }]}>See all</Text>
        </Pressable>
      </View>
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
            isSimple={isSimpleHabit(item)}
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
  container: { gap: spacing.sm, marginTop: spacing.base },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
  },
  list: { gap: spacing.md, paddingHorizontal: spacing.base },
  seeAll: { ...typography.bodySmall },
  title: { ...typography.heading3 },
});
