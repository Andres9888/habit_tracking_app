/**
 * ModalBackdrop Component
 * Animated backdrop overlay with tap-to-close functionality
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { StyleSheet, Pressable, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

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
      accessible={false}
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
