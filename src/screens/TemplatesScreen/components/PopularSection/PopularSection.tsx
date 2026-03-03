/**
 * PopularSection - "Trending Now" header + horizontal carousel of MiniTemplateCards
 */

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { MiniTemplateCard } from '../../../../components/MiniTemplateCard';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

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
    <View testID="templates-trending-section" style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>🔥 Trending Now</Text>
        <Pressable
          testID="templates-trending-see-all"
          accessibilityLabel="See all trending templates"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onSeeAll}
        >
          <Text style={s.seeAll}>See all</Text>
        </Pressable>
      </View>
      <FlatList
        testID="templates-popular-scroll"
        horizontal
        data={templates}
        contentContainerStyle={s.list}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <MiniTemplateCard
            description={item.description}
            hasResearch={!!item.scientificReference}
            icon={item.icon}
            iconColor={item.iconColor}
            isImported={importedTemplateIds.has(item._id)}
            isImporting={importingTemplateId === item._id}
            name={item.name}
            subtitle={item.frequency}
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
  seeAll: { ...typography.bodySmall, color: colors.primary[600] },
  title: { ...typography.heading3, color: colors.text.primary },
});
