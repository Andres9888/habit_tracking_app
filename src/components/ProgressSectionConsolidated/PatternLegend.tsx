/**
 * PatternLegend — Best/Focus legend dots for the WeeklyPatternChart.
 */

import { View, Text } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';

export function PatternLegend() {
  const { colors } = useThemeColors();

  return (
    <View className='mt-2 flex-row items-center justify-center gap-4'>
      <View className='flex-row items-center gap-1'>
        <View className='h-2 w-2 rounded-sm' style={{ backgroundColor: colors.status.success }} />
        <Text className='text-[10px]' style={{ color: colors.text.tertiary }}>
          Best
        </Text>
      </View>
      <View className='flex-row items-center gap-1'>
        <View className='h-2 w-2 rounded-sm' style={{ backgroundColor: colors.status.warning }} />
        <Text className='text-[10px]' style={{ color: colors.text.tertiary }}>
          Focus
        </Text>
      </View>
    </View>
  );
}
