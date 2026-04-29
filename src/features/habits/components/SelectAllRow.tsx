/**
 * SelectAllRow — Checkbox + "Select All" label shown during selection mode.
 */

import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Checkbox } from '../../../components/Checkbox';
import { durations } from '../../../theme/animations';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';

interface SelectAllRowProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}

function SelectAllRowComponent({
  selectedCount,
  totalCount,
  isAllSelected,
  onToggleSelectAll,
}: SelectAllRowProps) {
  const { colors } = useThemeColors();
  const isPartial = selectedCount > 0 && !isAllSelected;

  return (
    <Animated.View entering={FadeInDown.duration(durations.enter)} exiting={FadeOutUp.duration(durations.quick)}>
      <Pressable
        accessibilityLabel={isAllSelected ? 'Deselect all habits' : 'Select all habits'}
        accessibilityRole="button"
        style={s.row}
        onPress={onToggleSelectAll}
      >
        <Checkbox
          checked={isAllSelected}
          indeterminate={isPartial}
          size="md"
          variant="primary"
        />
        <Text style={[s.label, { color: colors.text.secondary }]}>Select All</Text>
        <Text style={s.count}>{selectedCount} of {totalCount}</Text>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  count: { color: palette.premium[500], fontSize: typography.caption.fontSize, fontWeight: fontWeights.semibold },
  label: { flex: 1, fontSize: typography.bodySmall.fontSize, fontWeight: fontWeights.medium },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
});

export const SelectAllRow = memo(SelectAllRowComponent);
