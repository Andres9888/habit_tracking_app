/** SortOrderPicker — inline family segmented control + direction picker */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
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
  const family = getSortFamily(selected);
  const showDirection = family !== 'manual';

  return (
    <View
      className='gap-3 border-b px-4 py-3'
      style={{ borderColor: colors.border, backgroundColor: trayBg }}
    >
      <View className='gap-1'>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.secondary,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.2,
            textTransform: 'uppercase',
          }}
        >
          Sort by
        </Text>
        <Text style={{ ...typography.caption, color: colors.text.tertiary }}>
          Choose the habit detail that controls list order.
        </Text>
      </View>
      <SortFamilyPicker selected={selected} onSelect={onSelect} />
      {showDirection ? (
        <Text
          style={{
            ...typography.caption,
            color: colors.text.secondary,
            fontWeight: fontWeights.semibold,
          }}
        >
          Direction
        </Text>
      ) : null}
      <SortDirectionPicker selected={selected} onSelect={onSelect} />
    </View>
  );
}
