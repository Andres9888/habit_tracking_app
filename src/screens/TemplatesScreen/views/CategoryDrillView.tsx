/* eslint-disable max-lines */
/**
 * CategoryDrillView - Slide-in view showing templates for a single category.
 * With sort controls, section grouping (Popular / All), Top Pick badge, and social proof.
 */

import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations, springs } from '../../../theme/animations';
import { borderRadius, spacing } from '../../../theme/spacing';
import { getCategoryMeta } from '../data/categoryMeta';
import { fontWeights, typography } from '@/theme/typography';
import {
  useCategoryDrillFilters,
  type DrillSort,
} from '../hooks/useCategoryDrillFilters';
import {
  useDrillSections,
  type DrillListItem,
} from '../hooks/useDrillSections';
import { TemplateListCard } from './TemplateListCard';
import { CategoryHero } from './CategoryHero';
import { DrillSectionLabel } from './DrillSectionLabel';

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
  categoryId,
  importedTemplateIds,
  importingTemplateId,
  onBack,
  onImport,
  onPreview,
  templates,
}: CategoryDrillViewProps) {
  const { colors } = useThemeColors();
  const meta = getCategoryMeta(categoryId);
  const { filtered, hideImported, setSort, sort, toggleHideImported } =
    useCategoryDrillFilters(templates, importedTemplateIds);
  const listData = useDrillSections(filtered, sort);

  const renderItem = ({
    item,
    index,
  }: {
    item: DrillListItem;
    index: number;
  }) => {
    if (item.kind === 'header') return <DrillSectionLabel label={item.label} />;
    return (
      <Animated.View
        entering={FadeInDown.delay(index * durations.stagger)
          .duration(durations.enter)
          .springify()
          .damping(springs.standard.damping)}
      >
        <TemplateListCard
          getCategoryLabel={() => ''}
          importedTemplateIds={importedTemplateIds}
          importingTemplateId={importingTemplateId}
          isTopPick={item.isTopPick}
          item={item.template}
          popularityCount={item.popularityCount}
          searchQuery=''
          onImport={() => onImport(item.template)}
          onPreview={() => onPreview(item.template)}
        />
      </Animated.View>
    );
  };

  return (
    <View
      testID='templates-category-view'
      style={[s.container, { backgroundColor: colors.background }]}
    >
      <CategoryHero
        habitCount={templates.length}
        meta={meta}
        onBack={onBack}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[s.filterBar, { borderBottomColor: colors.border }]}
        contentContainerStyle={s.filterBarContent}
      >
        {SORT_OPTIONS.map((opt) => (
          <Pressable
            accessibilityRole='button'
            accessibilityState={{ selected: sort === opt.key }}
            key={opt.key}
            style={[
              s.chip,
              { backgroundColor: colors.card, borderColor: colors.border },
              sort === opt.key && {
                backgroundColor: meta.bgColor,
                borderColor: meta.borderColor,
              },
            ]}
            onPress={() => setSort(opt.key)}
          >
            <Text
              style={[
                s.chipText,
                { color: colors.text.secondary },
                sort === opt.key && { color: meta.textColor },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
        <View style={[s.chipDivider, { backgroundColor: colors.border }]} />
        <Pressable
          accessibilityRole='button'
          accessibilityState={{ selected: hideImported }}
          style={[
            s.chip,
            { backgroundColor: colors.card, borderColor: colors.border },
            hideImported && {
              backgroundColor: meta.bgColor,
              borderColor: meta.borderColor,
            },
          ]}
          onPress={toggleHideImported}
        >
          <Text
            style={[
              s.chipText,
              { color: colors.text.secondary },
              hideImported && { color: meta.textColor },
            ]}
          >
            {hideImported ? '✓ Not added' : 'Not added'}
          </Text>
        </Pressable>
      </ScrollView>
      <FlatList
        data={listData}
        contentContainerStyle={s.list}
        keyExtractor={(item, index) =>
          item.kind === 'header' ? `header-${index}` : item.template._id
        }
        renderItem={renderItem}
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
  chipDivider: { alignSelf: 'center', height: 18, width: 1 },
  chipText: { ...typography.caption, fontWeight: fontWeights.semibold },
  container: { flex: 1 },
  filterBar: { borderBottomWidth: 1, flexShrink: 0 },
  filterBarContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
