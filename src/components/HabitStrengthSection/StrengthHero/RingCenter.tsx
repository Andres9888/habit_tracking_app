/** RingCenter - Animated percentage + lowercase microlabel inside the ring. */
import React from 'react';
import { Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { AnimatedPercentage } from './AnimatedPercentage';

interface RingCenterProps {
  animatedStrength: SharedValue<number>;
}

export function RingCenter({ animatedStrength }: RingCenterProps) {
  const { colors } = useThemeColors();
  return (
    <View
      accessibilityElementsHidden
      className='absolute inset-0 items-center justify-center'
    >
      <AnimatedPercentage animatedValue={animatedStrength} />
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 12,
          lineHeight: 14,
          marginTop: 1,
        }}
      >
        strength
      </Text>
    </View>
  );
}
