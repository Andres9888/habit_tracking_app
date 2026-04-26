/**
 * Visualization cards for mental contrasting exercise summary
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sun, CloudRain, Brain } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';

interface VisualizationCardsProps {
  positiveVisualization: string;
  negativeVisualization: string;
}

export function VisualizationCards({
  positiveVisualization,
  negativeVisualization,
}: VisualizationCardsProps) {
  const { colors } = useThemeColors();

  return (
    <View className='gap-4 pb-4'>
      {/* Positive */}
      <View
        className='rounded-2xl border p-4'
        style={{ borderColor: colors.status.success, backgroundColor: colors.status.successLight }}
      >
        <View className='mb-3 flex-row items-center gap-2'>
          <Sun color={colors.status.success} size={iconSizes.medium} />
          <Text className='text-sm font-semibold' style={{ color: colors.status.successText }}>
            Success Vision
          </Text>
        </View>
        <Text className='text-sm leading-relaxed' style={{ color: colors.status.successText }}>
          "{positiveVisualization}"
        </Text>
      </View>

      {/* Negative */}
      <View className='rounded-2xl p-4' style={{ backgroundColor: colors.status.errorLight, borderWidth: 1, borderColor: colors.status.error }}>
        <View className='mb-3 flex-row items-center gap-2'>
          <CloudRain color={colors.status.error} size={iconSizes.medium} />
          <Text className='text-sm font-semibold' style={{ color: colors.status.errorText }}>
            Failure Consequences
          </Text>
        </View>
        <Text className='text-sm leading-relaxed' style={{ color: colors.status.errorText }}>
          "{negativeVisualization}"
        </Text>
      </View>

      {/* Insight */}
      <View className='rounded-2xl p-4' style={{ backgroundColor: colors.status.premiumLight }}>
        <View className='flex-row items-start gap-2'>
          <Brain className='mt-0.5' color={colors.status.premium} size={iconSizes.small} />
          <View className='flex-1'>
            <Text className='text-sm font-semibold' style={{ color: colors.status.premiumText }}>
              Mental Contrasting Complete
            </Text>
            <Text className='mt-1 text-xs leading-relaxed' style={{ color: colors.status.premiumText }}>
              By holding both visions in mind, you've created a productive
              tension that drives action. Review these visualizations when
              motivation dips.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
