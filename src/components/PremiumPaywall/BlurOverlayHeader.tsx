/**
 * Blur overlay variant components: Header
 */

import React from 'react';
import { View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
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
        className='h-8 w-8 items-center justify-center rounded-full bg-white/20'
        disabled={disabled}
        onPress={onPress}
      >
        <Ionicons color='rgba(255,255,255,0.6)' name='close' size={18} />
      </AnimatedPressable>
    </View>
  );
}
