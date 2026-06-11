/**
 * DrillFilterBar — sort + hide-imported chips above drill lists.
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '@/theme/typography';
import type { DrillSort } from '../hooks/useCategoryDrillFilters';

export interface DrillChipColors {
  bgColor: string;
  borderColor: string;
  textColor: string;
}

interface DrillFilterBarProps {
  chipColors: DrillChipColors;
  hideImported: boolean;
  notAddedCount: number;
  onSelectSort: (sort: DrillSort) => void;
  onToggleHideImported: () => void;
  sort: DrillSort;
}

const SORT_OPTIONS: { key: DrillSort; label: string }[] = [
  { key: 'popular', label: 'Popular' },
  { key: 'az', label: 'A-Z' },
];

export function DrillFilterBar(p: DrillFilterBarProps) {
  const { colors } = useThemeColors();
  const selectedChip = {
    backgroundColor: p.chipColors.bgColor,
    borderColor: p.chipColors.borderColor,
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[s.filterBar, { borderBottomColor: colors.border }]}
      contentContainerStyle={s.filterBarContent}
    >
      {SORT_OPTIONS.map((opt) => (
        <Pressable
          accessibilityRole='button'
          accessibilityState={{ selected: p.sort === opt.key }}
          key={opt.key}
          style={[
            s.chip,
            { backgroundColor: colors.card, borderColor: colors.border },
            p.sort === opt.key && selectedChip,
          ]}
          onPress={() => p.onSelectSort(opt.key)}
        >
          <Text
            style={[
              s.chipText,
              { color: colors.text.secondary },
              p.sort === opt.key && { color: p.chipColors.textColor },
            ]}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
      <View style={[s.chipDivider, { backgroundColor: colors.border }]} />
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ selected: p.hideImported }}
        style={[
          s.chip,
          { backgroundColor: colors.card, borderColor: colors.border },
          p.hideImported && selectedChip,
        ]}
        onPress={p.onToggleHideImported}
      >
        <Text
          style={[
            s.chipText,
            { color: colors.text.secondary },
            p.hideImported && { color: p.chipColors.textColor },
          ]}
        >
          {p.hideImported ? '✓ Not added' : `Not added · ${p.notAddedCount}`}
        </Text>
      </Pressable>
    </ScrollView>
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
  filterBar: { borderBottomWidth: 1, flexGrow: 0, flexShrink: 0 },
  filterBarContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
});
