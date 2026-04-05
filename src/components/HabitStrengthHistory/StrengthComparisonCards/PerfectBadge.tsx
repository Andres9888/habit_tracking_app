/**
 * PerfectBadge - Celebration badge shown when user has 100% completion rate
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

export function PerfectBadge() {
  const { colors } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel='Perfect streak! You have completed every day since starting this habit'
      className='mt-1.5 flex-row items-center gap-1 rounded-full px-2 py-0.5'
      style={{ backgroundColor: colors.status.warningLight }}
      testID='perfect-badge'
    >
      <Sparkles color={colors.status.warning} size={iconSizes.micro} />
      <Text className='text-[10px] font-bold' style={{ color: colors.status.warningText }}>Perfect!</Text>
    </View>
  );
}
