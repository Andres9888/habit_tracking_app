/**
 * Secondary footer action for the template preview.
 *
 * Pre-add it is "Customize"; post-add it is the way out. The added state used
 * to unmount this row entirely, which parked the user on a several-screen
 * article about a habit they had just committed to, with no next step offered
 * at the highest-intent moment in the flow.
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
  isImported: boolean;
  isImporting: boolean;
  onCustomize: () => void;
  onDone: () => void;
}

export function FooterSecondaryActions({
  createPressHandlers,
  customizeButtonScale,
  customizeButtonStyle,
  isImported,
  isImporting,
  onCustomize,
  onDone,
}: FooterSecondaryActionsProps) {
  const palette = useDetailPalette();

  const label = isImported ? 'Find another habit' : 'Customize';

  return (
    <AnimatedPressable
      accessible
      accessibilityHint={
        isImported
          ? 'Close this habit and return to the library'
          : 'Customize habit details before adding'
      }
      accessibilityLabel={
        isImported ? 'Find another habit' : 'Customize habit before adding'
      }
      accessibilityRole='button'
      disabled={isImporting}
      testID={
        isImported
          ? 'templates-preview-find-another'
          : 'templates-preview-customize'
      }
      style={[footerStyles.customizeLink, customizeButtonStyle]}
      onPress={isImported ? onDone : onCustomize}
      {...createPressHandlers(customizeButtonScale, 0.98)}
    >
      <Text
        style={[
          footerStyles.customizeLinkText,
          { color: palette.textSecondary },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
