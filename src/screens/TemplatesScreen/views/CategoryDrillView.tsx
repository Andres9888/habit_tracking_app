/**
 * CategoryDrillView - Slide-in view showing templates for a single category
 * With sort/filter controls and "hide imported" toggle
 */

import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { colors } from '../../../theme/colors';
import { durations, springs } from '../../../theme/animations';
import { borderRadius, spacing } from '../../../theme/spacing';
import { getCategoryMeta } from '../data/categoryMeta';
import { fontWeights, typography } from '@/theme/typography';
import {
  useCategoryDrillFilters,
  type DrillSort,
} from '../hooks/useCategoryDrillFilters';
import { TemplateListCard } from './TemplateListCard';

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
  { key: 'popular', label: 'Most used' },
  { key: 'az', label: 'A-Z' },
];

export function CategoryDrillView({
  categoryId, importedTemplateIds, importingTemplateId,
  onBack, onImport, onPreview, templates,
}: CategoryDrillViewProps) {
  const meta = getCategoryMeta(categoryId);
  const getCategoryLabel = (_categoryId: string) => meta.label;
  const habitCountLabel = `${templates.length} habit${templates.length === 1 ? '' : 's'}`;
  const scienceCount = templates.filter((t) => t.scientificReference).length;
  const { filtered, hideImported, setSort, sort, toggleHideImported } =
    useCategoryDrillFilters(templates, importedTemplateIds);

  return (
    <View testID="templates-category-view" style={s.container}>
      <ScreenHeader
        subtitle={`${habitCountLabel} \u00B7 ${scienceCount} science-backed`}
        title={`${meta.icon} ${meta.label}`}
        onBack={onBack}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterBarContent}>
        {SORT_OPTIONS.map((opt) => (
          <Pressable
            accessibilityRole='button'
            accessibilityState={{ selected: sort === opt.key }}
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
          accessibilityRole='button'
          accessibilityState={{ selected: hideImported }}
          style={[s.chip, hideImported && s.toggleActive]}
          onPress={toggleHideImported}
        >
          <Text style={[s.chipText, hideImported && s.toggleTextActive]}>
            Hide added
          </Text>
        </Pressable>
      </ScrollView>
      <FlatList
        data={filtered}
        contentContainerStyle={s.list}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * durations.stagger).duration(durations.enter).springify().damping(springs.standard.damping)}>
            <TemplateListCard
              getCategoryLabel={getCategoryLabel}
              importedTemplateIds={importedTemplateIds}
              importingTemplateId={importingTemplateId}
              item={item}
              searchQuery=''
              onImport={(_templateId) => onImport(item)}
              onPreview={(_template) => onPreview(item)}
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
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[700],
  },
  chipText: { ...typography.caption, color: colors.text.secondary, fontWeight: fontWeights.semibold },
  chipTextActive: { color: colors.text.inverse },
  container: { backgroundColor: colors.background, flex: 1 },
  filterBarContent: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
  toggleActive: {
    backgroundColor: `${colors.primary[500]}1A`,
    borderColor: `${colors.primary[500]}4D`,
  },
  toggleTextActive: { color: colors.primary[600] },
});
