/**
 * CategoryDrillView - Slide-in view showing templates for a single category
 * With sort/filter controls and "hide imported" toggle
 */

import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();
  const meta = getCategoryMeta(categoryId);
  const getCategoryLabel = (_categoryId: string) => meta.label;
  const habitCountLabel = `${templates.length} habit${templates.length === 1 ? '' : 's'}`;
  const scienceCount = templates.filter((t) => t.scientificReference).length;
  const { filtered, hideImported, setSort, sort, toggleHideImported } =
    useCategoryDrillFilters(templates, importedTemplateIds);

  return (
    <View testID="templates-category-view" style={[s.container, { backgroundColor: colors.background }]}>
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
            style={[s.chip, { backgroundColor: colors.card, borderColor: colors.border }, sort === opt.key && { backgroundColor: colors.primary[600], borderColor: colors.primary[700] }]}
            onPress={() => setSort(opt.key)}
          >
            <Text style={[s.chipText, { color: colors.text.secondary }, sort === opt.key && { color: colors.text.inverse }]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole='button'
          accessibilityState={{ selected: hideImported }}
          style={[s.chip, { backgroundColor: colors.card, borderColor: colors.border }, hideImported && { backgroundColor: `${colors.primary[500]}1A`, borderColor: `${colors.primary[500]}4D` }]}
          onPress={toggleHideImported}
        >
          <Text style={[s.chipText, { color: colors.text.secondary }, hideImported && { color: colors.primary[600] }]}>
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
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: { ...typography.caption, fontWeight: fontWeights.semibold },
  container: { flex: 1 },
  filterBarContent: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
