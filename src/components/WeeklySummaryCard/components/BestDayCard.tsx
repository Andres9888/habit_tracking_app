import { View, Text } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { ColorScheme } from '../types';
import { iconSizes } from '@/theme/iconSizes';

interface BestDayCardProps {
  dayLabel: string;
  rate: number;
  colors: ColorScheme;
}

export function BestDayCard({ dayLabel, rate, colors }: BestDayCardProps) {
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View
      className='mt-3 flex-row items-center gap-3 rounded-2xl p-3'
      style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)' }}
    >
      <View
        className='h-10 w-10 items-center justify-center rounded-xl'
        style={{ backgroundColor: colors.accent + '20' }}
      >
        <Calendar color={colors.accent} size={iconSizes.medium} />
      </View>
      <View className='flex-1'>
        <Text
          className='text-[10px] font-medium uppercase'
          style={{ color: colors.accent }}
        >
          Best Day
        </Text>
        <Text className='text-[15px] font-bold' style={{ color: colors.text }}>
          {dayLabel}
        </Text>
      </View>
      <View className='items-end'>
        <Text className='text-[17px] font-bold' style={{ color: colors.text }}>
          {rate}%
        </Text>
        <Text className='text-[10px] font-medium' style={{ color: themeColors.text.tertiary }}>
          completion
        </Text>
      </View>
    </View>
  );
}
