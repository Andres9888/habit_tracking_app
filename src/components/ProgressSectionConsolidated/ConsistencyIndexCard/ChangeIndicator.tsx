/**
 * ChangeIndicator Component
 *
 * Shows the change from previous period with trend icon.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface ChangeIndicatorProps {
  change: number | null;
}

export function ChangeIndicator({ change }: ChangeIndicatorProps) {
  const { colors } = useThemeColors();

  if (change === null) return null;

  return (
    <View className='mt-3 flex-row items-center justify-center border-t pt-3' style={{ borderColor: colors.gray[100] }}>
      {change >= 0 ? (
        <TrendingUp color={colors.status.success} size={14} style={{ marginRight: 4 }} />
      ) : (
        <TrendingDown color={colors.status.warning} size={14} style={{ marginRight: 4 }} />
      )}
      <Text
        className='text-xs font-medium'
        style={{ color: change >= 0 ? colors.status.success : colors.status.warning }}
      >
        {change >= 0 ? '+' : ''}
        {change}% vs last period
      </Text>
    </View>
  );
}
