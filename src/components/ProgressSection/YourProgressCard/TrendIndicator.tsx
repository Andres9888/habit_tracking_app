import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

interface TrendIndicatorProps {
  weeklyChange: number;
}

export function TrendIndicator({ weeklyChange }: TrendIndicatorProps) {
  const { colors: themeColors } = useThemeColors();

  if (weeklyChange > 0) {
    return (
      <View
        className='flex-row items-center gap-1 rounded-full px-2 py-0.5'
        style={{ backgroundColor: themeColors.status.successLight }}
      >
        <TrendingUp color={themeColors.status.success} size={iconSizes.micro} />
        <Text className='text-xs font-semibold' style={{ color: themeColors.status.success }}>
          +{weeklyChange}%
        </Text>
      </View>
    );
  }

  if (weeklyChange < 0) {
    return (
      <View className='flex-row items-center gap-1 rounded-full px-2 py-0.5' style={{ backgroundColor: themeColors.status.errorLight }}>
        <TrendingDown color={themeColors.status.error} size={iconSizes.micro} />
        <Text className='text-xs font-semibold' style={{ color: themeColors.status.error }}>
          {weeklyChange}%
        </Text>
      </View>
    );
  }

  return (
    <View className='flex-row items-center gap-1 rounded-full px-2 py-0.5' style={{ backgroundColor: themeColors.background }}>
      <Minus color={themeColors.text.secondary} size={iconSizes.micro} />
      <Text className='text-xs font-semibold' style={{ color: themeColors.text.secondary }}>Stable</Text>
    </View>
  );
}
