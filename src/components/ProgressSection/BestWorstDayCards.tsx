import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Trophy, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

import type { DayStats } from './types';
import { triggerHaptic } from '@/utils/haptics';

interface BestWorstDayCardsProps {
  bestDay: DayStats;
  worstDay: DayStats;
  onWorstDayPress?: () => void;
}

export function BestWorstDayCards({
  bestDay,
  worstDay,
  onWorstDayPress,
}: BestWorstDayCardsProps) {
  const { colors } = useThemeColors();
  const handleWorstDayPress = () => {
    triggerHaptic('tap');
    onWorstDayPress?.();
  };

  return (
    <View className='flex-row gap-2'>
      <View
        accessibilityLabel={`Best day: ${bestDay.day} with ${bestDay.rate}% success rate`}
        className='flex-1 rounded-xl border p-3'
        style={{ borderColor: colors.status.successLight, backgroundColor: colors.status.successLight }}
      >
        <View className='mb-1 flex-row items-center gap-1.5'>
          <Trophy color={colors.status.success} size={iconSizes.small} />
          <Text className='text-xs font-medium' style={{ color: colors.status.successText }}>Best Day</Text>
        </View>
        <Text className='text-lg font-bold' style={{ color: colors.status.successText }}>
          {bestDay.day}
        </Text>
        <Text className='text-xs' style={{ color: colors.status.successText }}>
          {bestDay.rate}% success
        </Text>
      </View>

      <Pressable
        accessibilityHint='Opens tips to improve this day'
        accessibilityLabel={`Focus on ${worstDay.day} with ${worstDay.rate}% success rate. Tap for tips.`}
        accessibilityRole='button'
        className='flex-1 rounded-xl border p-3 active:opacity-80'
        style={{ borderColor: colors.status.warningLight, backgroundColor: colors.status.warningLight }}
        onPress={handleWorstDayPress}
      >
        <View className='mb-1 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-1.5'>
            <AlertTriangle color={colors.status.warning} size={iconSizes.small} />
            <Text className='text-xs font-medium' style={{ color: colors.status.warningText }}>Focus On</Text>
          </View>
          <ChevronRight color={colors.status.warning} size={iconSizes.small} />
        </View>
        <Text className='text-lg font-bold' style={{ color: colors.status.warningText }}>{worstDay.day}</Text>
        <Text className='text-xs' style={{ color: colors.status.warningText }}>
          {worstDay.rate}% • tap for tips
        </Text>
      </Pressable>
    </View>
  );
}
