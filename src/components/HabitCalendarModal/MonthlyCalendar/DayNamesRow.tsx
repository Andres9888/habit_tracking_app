import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DayNamesRow() {
  const { colors } = useThemeColors();

  return (
    <View className='mb-3 flex-row'>
      {DAY_NAMES.map((day) => (
        <View key={day} className='w-[14.28%] items-center'>
          <Text className='text-sm font-medium' style={{ color: colors.text.secondary }}>{day}</Text>
        </View>
      ))}
    </View>
  );
}
