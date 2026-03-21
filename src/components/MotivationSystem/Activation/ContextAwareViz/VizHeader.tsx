/**
 * VizHeader - Header with animated icon for visualization display
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Sparkles, AlertTriangle } from 'lucide-react-native';

import { useThemeColors } from '../../../../theme/ThemeContext';
import type { VizType } from './types';

interface VizHeaderProps {
  vizType: VizType;
  iconAnimatedStyle: object;
}

export function VizHeader({ vizType, iconAnimatedStyle }: VizHeaderProps) {
  const { colors } = useThemeColors();
  const isSuccess = vizType === 'success';

  return (
    <View className='mb-4 flex-row items-center gap-3'>
      <Animated.View
        className='h-10 w-10 items-center justify-center rounded-xl'
        style={[
          iconAnimatedStyle,
          { backgroundColor: isSuccess ? colors.status.successLight : colors.status.errorLight },
        ]}
      >
        {isSuccess ? (
          <Sparkles color={colors.status.success} size={20} />
        ) : (
          <AlertTriangle color={colors.status.error} size={20} />
        )}
      </Animated.View>
      <View className='flex-1'>
        <Text
          className='text-base font-semibold'
          style={{ color: isSuccess ? colors.status.successText : colors.status.errorText }}
        >
          {isSuccess ? 'Visualize Success' : 'Visualize Consequences'}
        </Text>
        <Text className='text-xs' style={{ color: colors.text.secondary }}>
          {isSuccess
            ? 'Feel the energy of completing this'
            : 'Feel the weight of skipping this'}
        </Text>
      </View>
    </View>
  );
}
