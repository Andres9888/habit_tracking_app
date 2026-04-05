/**
 * TrendIndicator Component
 *
 * Shows weekly trend direction with icon and value.
 * Used in HeroStrengthSection to display strength change.
 * Memoized since weeklyChange is a primitive prop.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

interface TrendIndicatorProps {
  weeklyChange: number;
}

/**
 * TrendIndicator - Shows weekly trend direction with icon and value
 * Memoized to prevent re-renders when parent updates unrelated props
 */
export const TrendIndicator = React.memo(function TrendIndicator({
  weeklyChange,
}: TrendIndicatorProps) {
  const { colors } = useThemeColors();

  if (weeklyChange > 0) {
    return (
      <View
        accessibilityLabel={`Up ${weeklyChange} percent this week`}
        accessibilityRole='text'
        className='flex-row items-center gap-1 rounded-full px-2 py-0.5'
        style={{ backgroundColor: colors.status.successLight }}
      >
        <TrendingUp color={colors.status.success} size={iconSizes.small} />
        <Text className='text-xs font-medium' style={{ color: colors.status.success }}>
          +{weeklyChange}%
        </Text>
      </View>
    );
  }

  if (weeklyChange < 0) {
    return (
      <View
        accessibilityLabel={`Down ${Math.abs(weeklyChange)} percent this week`}
        accessibilityRole='text'
        className='flex-row items-center gap-1 rounded-full px-2 py-0.5'
        style={{ backgroundColor: colors.status.errorLight }}
      >
        <TrendingDown color={colors.status.error} size={iconSizes.small} />
        <Text className='text-xs font-medium' style={{ color: colors.status.error }}>
          {weeklyChange}%
        </Text>
      </View>
    );
  }

  return (
    <View
      accessibilityLabel='Stable this week'
      accessibilityRole='text'
      className='flex-row items-center gap-1 rounded-full px-2 py-0.5'
      style={{ backgroundColor: colors.gray[100] }}
    >
      <Minus color={colors.text.secondary} size={iconSizes.small} />
      <Text className='text-xs font-medium' style={{ color: colors.text.secondary }}>Stable</Text>
    </View>
  );
});

export default TrendIndicator;
