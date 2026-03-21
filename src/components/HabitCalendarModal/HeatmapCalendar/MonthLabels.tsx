import { View, Text } from 'react-native';
import { format } from 'date-fns';
import { useThemeColors } from '../../../theme/ThemeContext';

interface MonthLabelsProps {
  months: Date[];
}

export function MonthLabels({ months }: MonthLabelsProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-3 flex-row'>
      <View className='w-12' />
      {months.map((month, monthIndex) => (
        <View key={monthIndex} className='flex-1'>
          <Text className='text-center text-xs font-medium' style={{ color: colors.text.secondary }}>
            {format(month, 'MMM')}
          </Text>
        </View>
      ))}
    </View>
  );
}
