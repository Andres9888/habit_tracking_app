/**
 * Secondary footer actions for the template preview:
 * "Start the full version" (when a start-small CTA is primary) + Customize.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { footerStyles } from '../styles';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FooterSecondaryActionsProps {
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  customizeButtonScale: SharedValue<number>;
  customizeButtonStyle: object;
  hasStartSmall: boolean;
  isImporting: boolean;
  templateName: string;
  onCustomize: () => void;
  onImport: () => void;
}

export function FooterSecondaryActions({
  createPressHandlers,
  customizeButtonScale,
  customizeButtonStyle,
  hasStartSmall,
  isImporting,
  templateName,
  onCustomize,
  onImport,
}: FooterSecondaryActionsProps) {
  return (
    <View style={footerStyles.secondaryRow}>
      {hasStartSmall ? (
        <Pressable
          accessible
          accessibilityHint='Add this habit at its full size'
          accessibilityLabel={`Start ${templateName} at full size`}
          accessibilityRole='button'
          disabled={isImporting}
          testID='templates-preview-full-version'
          style={footerStyles.customizeLink}
          onPress={onImport}
        >
          <Text style={footerStyles.customizeLinkText}>
            Start the full version
          </Text>
        </Pressable>
      ) : null}
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
        <Text style={footerStyles.customizeLinkText}>Customize</Text>
      </AnimatedPressable>
    </View>
  );
}
