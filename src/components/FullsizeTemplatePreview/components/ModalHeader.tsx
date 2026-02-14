/**
 * Modal header for FullsizeTemplatePreview
 * Contains close button with animation
 */

import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { layoutStyles } from '../styles';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ModalHeaderProps {
  topInset: number;
  closeButtonStyle: object;
  closeButtonAnimatedOpacityStyle: object;
  closeButtonPressHandlers: PressHandlers;
  onClose: () => void;
}

export function ModalHeader({
  topInset,
  closeButtonStyle,
  closeButtonAnimatedOpacityStyle,
  closeButtonPressHandlers,
  onClose,
}: ModalHeaderProps) {
  return (
    <Animated.View
      style={[
        layoutStyles.header,
        { paddingTop: topInset > 0 ? topInset : 12 },
        closeButtonAnimatedOpacityStyle,
      ]}
    >
      <AnimatedPressable
        accessible
        accessibilityHint='Double tap to close this preview'
        accessibilityLabel='Close preview'
        accessibilityRole='button'
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
        style={[layoutStyles.closeButton, closeButtonStyle]}
        onPress={onClose}
        {...closeButtonPressHandlers}
      >
        <X color='#3D3833' size={24} strokeWidth={2.5} />
      </AnimatedPressable>
    </Animated.View>
  );
}
