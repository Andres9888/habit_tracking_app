/**
 * TrendChangeBadge Component
 * Displays the change badge for monthly trend comparison
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

interface TrendChangeBadgeProps {
  change: number;
}

export function TrendChangeBadge({ change }: TrendChangeBadgeProps) {
  const { colors } = useThemeColors();
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <View
      className='mt-3 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5'
      style={{
        backgroundColor: isPositive
          ? colors.status.successLight
          : isNegative
            ? colors.status.errorLight
            : colors.gray[50],
      }}
    >
      {isPositive ? (
        <>
          <TrendingUp color={colors.status.success} size={iconSizes.small} />
          <Text className='text-sm font-semibold' style={{ color: colors.status.success }}>
            +{change}% improvement
          </Text>
        </>
      ) : isNegative ? (
        <>
          <TrendingDown color={colors.status.error} size={iconSizes.small} />
          <Text className='text-sm font-semibold' style={{ color: colors.status.error }}>
            {change}% from last month
          </Text>
        </>
      ) : (
        <Text className='text-sm font-medium' style={{ color: colors.text.secondary }}>
          Same as last month
        </Text>
      )}
    </View>
  );
}
