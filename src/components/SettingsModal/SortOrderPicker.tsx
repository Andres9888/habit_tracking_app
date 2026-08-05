/** SortOrderPicker — inline family segmented control + direction picker */
import { View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { SortDirectionPicker } from './components/SortDirectionPicker';
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
      <SortFamilyPicker selected={selected} onSelect={onSelect} />
      <SortDirectionPicker selected={selected} onSelect={onSelect} />
    </View>
  );
}
