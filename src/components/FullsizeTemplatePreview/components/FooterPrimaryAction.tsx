/**
 * Primary footer action for the template preview:
 * the import CTA, or the success pill once added.
 */

import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { iconSizes } from '@/theme/iconSizes';
import { footerStyles } from '../styles';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FooterPrimaryActionProps {
  checkmarkAnimatedStyle: object;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  importButtonScale: SharedValue<number>;
  importButtonStyle: object;
  importLabel: string;
  isImported: boolean;
  isImporting: boolean;
  successPillStyle: object;
  templateName: string;
  onImport: () => void;
}

export function FooterPrimaryAction(p: FooterPrimaryActionProps) {
  if (p.isImported) {
    return (
      <Animated.View
        testID='templates-preview-added'
        style={[footerStyles.successButton, p.successPillStyle]}
      >
        <Animated.View style={p.checkmarkAnimatedStyle}>
          <Check
            color={colors.text.inverse}
            size={iconSizes.large}
            strokeWidth={3}
          />
        </Animated.View>
        <Text style={footerStyles.successButtonText}>Added!</Text>
      </Animated.View>
    );
  }

  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Add this habit to your list'
      accessibilityLabel={`Add ${p.templateName} to my habits`}
      accessibilityRole='button'
      disabled={p.isImporting}
      testID='templates-preview-quick-add'
      style={[
        footerStyles.importButton,
        p.isImporting && { opacity: 0.5 },
        p.importButtonStyle,
      ]}
      onPress={p.onImport}
      {...p.createPressHandlers(p.importButtonScale)}
    >
      {p.isImporting ? (
        <View style={footerStyles.importButtonContent}>
          <ActivityIndicator color={colors.text.inverse} size='small' />
          <Text style={footerStyles.importButtonText}>Adding…</Text>
        </View>
      ) : (
        <Text style={footerStyles.importButtonText}>{p.importLabel}</Text>
      )}
    </AnimatedPressable>
  );
}
