/**
 * ExplainerBreakdown Component
 * Body/Mind/Emotion breakdown explanation
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

export function ExplainerBreakdown() {
  const { colors } = useThemeColors();

  return (
    <View className='mb-3 rounded-xl p-3' style={{ backgroundColor: colors.background }}>
      <Text className='mb-2 text-xs font-semibold' style={{ color: colors.text.primary }}>
        Visualize How You'll Feel:
      </Text>
      <View className='gap-1.5'>
        <Text className='text-xs' style={{ color: colors.text.secondary }}>
          <Text className='font-medium'>Body:</Text> Physical sensations (light
          vs heavy)
        </Text>
        <Text className='text-xs' style={{ color: colors.text.secondary }}>
          <Text className='font-medium'>Mind:</Text> Mental state (clear vs
          foggy)
        </Text>
        <Text className='text-xs' style={{ color: colors.text.secondary }}>
          <Text className='font-medium'>Emotion:</Text> Feelings (pride vs
          regret)
        </Text>
      </View>
    </View>
  );
}
