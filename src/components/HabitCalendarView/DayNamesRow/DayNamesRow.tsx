import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DayNamesRow() {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row px-1'>
      {DAY_NAMES.map((day, index) => {
        const isWeekend = index === 0 || index === 6; // Sunday (0) or Saturday (6)
        return (
          <View key={day} className='flex-1 items-center py-2'>
            <Text
              className='text-[10px] font-semibold tracking-widest'
              style={{
                color: isWeekend ? colors.primary[500] : colors.text.tertiary,
              }}
            >
              {day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
