/** SortOrderPicker — inline family segmented control + direction chip */
import { View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { SortDirectionChip } from './components/SortDirectionChip';
import { SortFamilyPicker } from './components/SortFamilyPicker';
import type { HabitSortMode } from '../../features/habits/types';

interface SortOrderPickerProps {
  selected: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function SortOrderPicker({ selected, onSelect }: SortOrderPickerProps) {
  const { colors, isDark } = useThemeColors();
  const trayBg = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)';

  return (
    <View
      className='border-b px-4 py-2.5'
      style={{ borderColor: colors.border, backgroundColor: trayBg }}
    >
      <View className='flex-row items-center'>
        <View className='mr-4 w-10' />
        <SortFamilyPicker selected={selected} onSelect={onSelect} />
      </View>
      <SortDirectionChip selected={selected} onSelect={onSelect} />
    </View>
  );
}
