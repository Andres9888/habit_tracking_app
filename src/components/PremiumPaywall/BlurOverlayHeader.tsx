/**
 * Blur overlay variant components: Header
 */

import React from 'react';
import { View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface BlurOverlayHeaderProps {
  disabled: boolean;
  onPress: () => void;
}

export function BlurOverlayHeader({ disabled, onPress }: BlurOverlayHeaderProps) {
  return (
    <View className='items-end px-5 pt-14'>
      <AnimatedPressable
        accessibilityLabel='Close paywall'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-white/90'
        disabled={disabled}
        onPress={onPress}
      >
        <Ionicons color={colors.text.primary} name='close' size={24} />
      </AnimatedPressable>
    </View>
  );
}
