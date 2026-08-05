import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * DayNamesRow - Row of day abbreviations (Sun-Sat) for the calendar
 *
 * Features:
 * - Dark mode support via ThemeContext
 * - Semantic color system for accessibility
 * - Uppercase day abbreviations with letter-spacing
 */
export function DayNamesRow() {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row px-1'>
      {DAY_NAMES.map((day) => (
        <View key={day} className='flex-1 items-center py-2'>
          <Text
            className='text-[10px] font-semibold tracking-widest'
            style={{ color: colors.gray[500] }}
          >
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
}
