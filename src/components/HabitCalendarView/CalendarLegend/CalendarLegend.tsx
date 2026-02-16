import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

export function CalendarLegend() {
  const { colors } = useThemeColors();

  const legendItems = [
    { color: colors.primary[500], label: 'Completed' },
    { color: '#FB7185', label: 'Missed' },
    {
      borderColor: colors.primary[400],
      color: 'transparent',
      label: 'Today',
    },
    { color: colors.gray[300], label: 'Upcoming' },
  ];

  return (
    <View className='flex-row flex-wrap items-center justify-center gap-4 pb-1 pt-2'>
      {legendItems.map(({ color, label, borderColor }) => (
        <View key={label} className='flex-row items-center gap-1.5'>
          <View
            className='h-2.5 w-2.5 rounded-full'
            style={{
              backgroundColor: color,
              borderColor: borderColor ?? 'transparent',
              borderWidth: borderColor ? 1.5 : 0,
            }}
          />
          <Text
            className='text-[10px] font-medium'
            style={{ color: colors.text.tertiary }}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
