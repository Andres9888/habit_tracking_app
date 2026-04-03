/**
 * CategoryDrillView - Slide-in view showing templates for a single category
 * With sort/filter controls and "hide imported" toggle
 */

import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { TemplateCard } from '../../../components/TemplateCard';
import { colors } from '../../../theme/colors';
import { durations, springs } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { getCategoryMeta } from '../data/categoryMeta';
import {
  useCategoryDrillFilters,
  type DrillSort,
} from '../hooks/useCategoryDrillFilters';

interface CategoryDrillViewProps {
  categoryId: string;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

const SORT_OPTIONS: { key: DrillSort; label: string }[] = [
  { key: 'popular', label: 'Popular' },
  { key: 'az', label: 'A-Z' },
];

export function CategoryDrillView({
  categoryId, importedTemplateIds, importingTemplateId,
  onBack, onImport, onPreview, templates,
}: CategoryDrillViewProps) {
  const meta = getCategoryMeta(categoryId);
  const scienceCount = templates.filter((t) => t.scientificReference).length;
  const { filtered, hideImported, setSort, sort, toggleHideImported } =
    useCategoryDrillFilters(templates, importedTemplateIds);

  return (
    <View testID="templates-category-view" style={s.container}>
      <ScreenHeader
        subtitle={`${templates.length} templates \u00B7 ${scienceCount} science-backed`}
        title={`${meta.icon} ${meta.label}`}
        onBack={onBack}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterBarContent}>
        {SORT_OPTIONS.map((opt) => (
          <Pressable
            key={opt.key}
            style={[s.chip, sort === opt.key && s.chipActive]}
            onPress={() => setSort(opt.key)}
          >
            <Text style={[s.chipText, sort === opt.key && s.chipTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          style={[s.chip, hideImported && s.toggleActive]}
          onPress={toggleHideImported}
        >
          <Text style={[s.chipText, hideImported && s.toggleTextActive]}>
            Hide imported
          </Text>
        </Pressable>
      </ScrollView>
      <FlatList
        data={filtered}
        contentContainerStyle={s.list}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * durations.stagger).duration(durations.enter).springify().damping(springs.standard.damping)}>
            <TemplateCard
              category={item.category}
              description={item.description}
              frequency={item.frequency}
              icon={item.icon}
              iconColor={item.iconColor}
              id={item._id}
              index={index}
              isImported={importedTemplateIds.has(item._id)}
              isImporting={importingTemplateId === item._id}
              name={item.name}
              popularityScore={item.popularityScore}
              scientificLink={item.scientificLink}
              scientificReference={item.scientificReference}
              showPreviewCTA
              youtubeLink={item.youtubeLink}
              onImport={() => onImport(item)}
              onPreview={() => onPreview(item)}
            />
          </Animated.View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    backgroundColor: colors.light.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[700],
  },
  chipText: { color: colors.text.secondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  container: { backgroundColor: colors.background, flex: 1 },
  filterBarContent: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.base, paddingVertical: 8 },
  list: { paddingBottom: 100 },
  toggleActive: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderColor: 'rgba(16,185,129,0.3)',
  },
  toggleTextActive: { color: colors.primary[600] },
});
