/**
 * ModalBackdrop Component
 * Animated backdrop overlay with tap-to-close functionality
 */

import React from 'react';
import { StyleSheet, Pressable, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';

interface ModalBackdropProps {
  disableBackdropClose: boolean;
  onClose: () => void;
  backdropStyle: AnimatedStyle<ViewStyle>;
}

export function ModalBackdrop({
  disableBackdropClose,
  onClose,
  backdropStyle,
}: ModalBackdropProps) {
  const handlePress = () => {
    if (!disableBackdropClose) {
      triggerHaptic('tap');
      onClose();
    }
  };

  return (
    <Pressable
      accessibilityLabel={disableBackdropClose ? undefined : 'Close modal'}
      accessibilityRole={disableBackdropClose ? undefined : 'button'}
      style={StyleSheet.absoluteFill}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: '#000' },
          backdropStyle,
        ]}
      />
    </Pressable>
  );
}
