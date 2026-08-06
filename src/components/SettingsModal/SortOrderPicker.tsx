/** SortOrderPicker — inline family segmented control + direction picker */
import { Text, View } from 'react-native';
import { typography } from '@/theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { SortDirectionPicker } from './components/SortDirectionPicker';
import { SortFamilyPicker } from './components/SortFamilyPicker';
import { getSortFamily } from './SortOrderPicker.constants';
import type { HabitSortMode } from '../../features/habits/types';

interface SortOrderPickerProps {
  selected: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function SortOrderPicker({ selected, onSelect }: SortOrderPickerProps) {
  const { colors, isDark } = useThemeColors();
  const trayBg = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)';
  // Custom order has no direction to pick — say where the ordering comes from
  // instead, so the empty space below the segments isn't a dead end.
  const isCustom = getSortFamily(selected) === 'manual';

  return (
    <View
      className='border-b px-4 py-2.5'
      style={{ borderColor: colors.border, backgroundColor: trayBg }}
    >
      <SortFamilyPicker selected={selected} onSelect={onSelect} />
      {isCustom ? (
        <Text
          className='pt-2'
          style={{ ...typography.caption, color: colors.text.tertiary }}
        >
          Drag habits on the home screen to reorder
        </Text>
      ) : null}
      <SortDirectionPicker selected={selected} onSelect={onSelect} />
    </View>
  );
}
