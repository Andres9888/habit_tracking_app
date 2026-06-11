/**
 * DrillListBody — shared filter chips + habit list for category and goal drills.
 * Hero is composed by the parent; this component owns only the list chrome.
 */

import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { useCategoryDrillFilters } from '../hooks/useCategoryDrillFilters';
import {
  useDrillSections,
  type DrillListItem,
} from '../hooks/useDrillSections';
import { HabitTemplateCard } from '../components/HabitTemplateCard';
import { DrillFilterBar, type DrillChipColors } from './DrillFilterBar';

interface DrillListBodyProps {
  chipColors: DrillChipColors;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

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
          .easing(Easing.out(Easing.cubic))}
      >
        <HabitTemplateCard
          descriptionLines={3}
          isImported={importedTemplateIds.has(item.template._id)}
          isImporting={importingTemplateId === item.template._id}
          isTopPick={item.isTopPick}
          item={item.template}
          onImport={() => onImport(item.template)}
          onPreview={() => onPreview(item.template)}
        />
      </Animated.View>
    );
  };

  return (
    <>
      <DrillFilterBar
        chipColors={chipColors}
        hideImported={hideImported}
        notAddedCount={notAddedCount}
        sort={sort}
        onSelectSort={setSort}
        onToggleHideImported={toggleHideImported}
      />
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
  divider: {
    height: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.md,
  },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
