/**
 * PopularSection - "Trending Now" header + horizontal carousel of TrendingCards
 */

import { FlatList, StyleSheet, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { spacing } from '../../../../theme/spacing';
import { SectionHeader } from '../SectionHeader';
import { SeeAllButton } from '../SectionHeader/SeeAllButton';
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
  return (
    <View testID='templates-trending-section' style={s.container}>
      <SectionHeader
        rightSlot={
          <SeeAllButton
            testID='templates-trending-see-all'
            accessibilityLabel='See all popular habits'
            onPress={onSeeAll}
          />
        }
        subtitle='What people are starting this week'
        title='Quick wins to build momentum'
      />
      <FlatList
        testID='templates-popular-scroll'
        horizontal
        data={templates}
        contentContainerStyle={s.list}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ index, item }) => (
          <TrendingCard
            description={item.description}
            frequency={item.frequency}
            hasResearch={!!item.scientificReference}
            icon={item.icon}
            iconColor={item.iconColor}
            isImported={importedTemplateIds.has(item._id)}
            isImporting={importingTemplateId === item._id}
            name={item.name}
            popularityPrefix={index < 3 ? '🔥' : undefined}
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
  container: { marginTop: spacing.base },
  list: { gap: spacing.md, paddingHorizontal: spacing.base },
});
