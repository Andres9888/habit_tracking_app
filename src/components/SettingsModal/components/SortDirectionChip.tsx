/** Compact ↑/↓ chip for the Sort order row right accessory */
import { Pressable } from 'react-native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getSegmentedControlColors } from '../SegmentedControl.colors';
import {
  getSortFamily,
  isAscending,
  modeFromFamily,
} from '../SortOrderPicker.constants';
import type { HabitSortMode } from '../../../features/habits/types';

interface SortDirectionChipProps {
  mode: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function SortDirectionChip({ mode, onSelect }: SortDirectionChipProps) {
  const { isDark } = useThemeColors();
  const { accent, selectedBg } = getSegmentedControlColors(isDark);
  const family = getSortFamily(mode);
  const asc = isAscending(mode);

  if (family === 'manual') return null;

  const handlePress = () => {
    void triggerHaptic('selection');
    onSelect(modeFromFamily(family, !asc));
  };

  return (
    <Pressable
      accessibilityLabel={
        asc ? 'Switch to descending sort' : 'Switch to ascending sort'
      }
      accessibilityRole='button'
      hitSlop={6}
      style={{
        width: 32,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selectedBg,
      }}
      onPress={handlePress}
    >
      {asc ? (
        <ArrowUp color={accent} size={iconSizes.small} strokeWidth={2.5} />
      ) : (
        <ArrowDown color={accent} size={iconSizes.small} strokeWidth={2.5} />
      )}
    </Pressable>
  );
}
