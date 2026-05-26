/**
 * PopularSection — "Quick wins" section with top-3 inline cards + carousel.
 *
 * The first 3 trending habits render as compact vertical rows so they're
 * immediately visible without horizontal scrolling. The remaining habits live
 * in a horizontal rail below for users who want to keep browsing.
 */

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { SectionHeader } from '../SectionHeader';
import { TrendingCard } from '../TrendingCard';
import { PopularInlineRow } from './PopularInlineRow';

const INLINE_COUNT = 3;

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
  const inline = templates.slice(0, INLINE_COUNT);
  const rest = templates.slice(INLINE_COUNT);

  return (
    <View testID='templates-trending-section' style={s.container}>
      <SectionHeader
        rightSlot={
          <Pressable
            testID='templates-trending-see-all'
            accessibilityLabel='See all popular habits'
            accessibilityRole='button'
            hitSlop={8}
            onPress={onSeeAll}
          >
            <Text style={[s.seeAll, { color: colors.primary[600] }]}>
              See all
            </Text>
          </Pressable>
        }
        subtitle='What people are starting this week'
        title='Quick wins to build momentum'
      />

      <View style={s.inlineList}>
        {inline.map((item, index) => (
          <PopularInlineRow
            key={item._id}
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
            onImport={() => onImport(item)}
            onPress={() => onPreview(item)}
          />
        ))}
      </View>

      {rest.length > 0 ? (
        <FlatList
          testID='templates-popular-scroll'
          horizontal
          data={rest}
          contentContainerStyle={s.rail}
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
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: spacing.base },
  inlineList: { paddingHorizontal: spacing.base, paddingTop: spacing.sm },
  rail: { gap: spacing.md, paddingHorizontal: spacing.base },
  seeAll: { ...typography.bodySmall },
});
