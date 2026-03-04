/**
 * SelectAllRow — Checkbox + "Select All" label shown during selection mode.
 */

import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Checkbox } from '../../../components/Checkbox';
import { useThemeColors } from '../../../theme/ThemeContext';

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
    <Animated.View entering={FadeInDown.duration(200)} exiting={FadeOutUp.duration(150)}>
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
  count: { color: '#a855f7', fontSize: 12, fontWeight: '600' },
  label: { flex: 1, fontSize: 14, fontWeight: '500' },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
});

export const SelectAllRow = memo(SelectAllRowComponent);
