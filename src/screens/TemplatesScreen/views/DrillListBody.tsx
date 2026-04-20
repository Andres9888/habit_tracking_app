/**
 * DrillListBody — shared filter chips + habit list for category and goal drills.
 * Hero is composed by the parent; this component owns only the list chrome.
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

interface DrillChipColors {
  bgColor: string;
  borderColor: string;
  textColor: string;
}

interface DrillListBodyProps {
  chipColors: DrillChipColors;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

const SORT_OPTIONS: { key: DrillSort; label: string }[] = [
  { key: 'popular', label: 'Popular' },
  { key: 'az', label: 'A-Z' },
];

export function DrillListBody({
  chipColors,
  importedTemplateIds,
  importingTemplateId,
  onImport,
  onPreview,
  templates,
}: DrillListBodyProps) {
  const { colors } = useThemeColors();
  const { filtered, hideImported, setSort, sort, toggleHideImported } =
    useCategoryDrillFilters(templates, importedTemplateIds);
  const listData = useDrillSections(filtered, sort);
  const notAddedCount = templates.filter(
    (t) => !importedTemplateIds.has(t._id)
  ).length;

  const renderItem = ({
    item,
    index,
  }: {
    item: DrillListItem;
    index: number;
  }) => {
    if (item.kind === 'divider')
      return <View style={[s.divider, { backgroundColor: colors.border }]} />;
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
    <>
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
                backgroundColor: chipColors.bgColor,
                borderColor: chipColors.borderColor,
              },
            ]}
            onPress={() => setSort(opt.key)}
          >
            <Text
              style={[
                s.chipText,
                { color: colors.text.secondary },
                sort === opt.key && { color: chipColors.textColor },
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
              backgroundColor: chipColors.bgColor,
              borderColor: chipColors.borderColor,
            },
          ]}
          onPress={toggleHideImported}
        >
          <Text
            style={[
              s.chipText,
              { color: colors.text.secondary },
              hideImported && { color: chipColors.textColor },
            ]}
          >
            {hideImported ? '✓ Not added' : `Not added · ${notAddedCount}`}
          </Text>
        </Pressable>
      </ScrollView>
      <FlatList
        key={sort}
        data={listData}
        contentContainerStyle={s.list}
        keyExtractor={(item, index) =>
          item.kind === 'divider' ? `divider-${index}` : item.template._id
        }
        renderItem={renderItem}
      />
    </>
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
  divider: {
    height: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.md,
  },
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
