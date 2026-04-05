/**
 * Blur overlay variant components: Header
 */

import React from 'react';
import { View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { X } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

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
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        disabled={disabled}
        onPress={onPress}
      >
        <X color='#000000' size={iconSizes.large} />
      </AnimatedPressable>
    </View>
  );
}
