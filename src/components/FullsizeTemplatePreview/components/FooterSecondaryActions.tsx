/**
 * Secondary footer actions for the template preview: Customize link.
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { footerStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FooterSecondaryActionsProps {
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  customizeButtonScale: SharedValue<number>;
  customizeButtonStyle: object;
  isImporting: boolean;
  onCustomize: () => void;
}

export function FooterSecondaryActions({
  createPressHandlers,
  customizeButtonScale,
  customizeButtonStyle,
  isImporting,
  onCustomize,
}: FooterSecondaryActionsProps) {
  const palette = useDetailPalette();

  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Customize habit details before adding'
      accessibilityLabel='Customize habit before adding'
      accessibilityRole='button'
      disabled={isImporting}
      testID='templates-preview-customize'
      style={[footerStyles.customizeLink, customizeButtonStyle]}
      onPress={onCustomize}
      {...createPressHandlers(customizeButtonScale, 0.98)}
    >
      <Text
        style={[
          footerStyles.customizeLinkText,
          { color: palette.textSecondary },
        ]}
      >
        Customize
      </Text>
    </AnimatedPressable>
  );
}
