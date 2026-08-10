/**
 * Primary footer action for the template preview:
 * the import CTA, or the success pill once added.
 *
 * Single-line label only — Start small lives in its own panel above; a CTA
 * subline duplicated that string, truncated, and failed contrast.
 */

import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { footerStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FooterPrimaryActionProps {
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  importButtonScale: SharedValue<number>;
  importButtonStyle: object;
  importLabel: string;
  isImporting: boolean;
  templateName: string;
  onImport: () => void;
}

export function FooterPrimaryAction(p: FooterPrimaryActionProps) {
  const palette = useDetailPalette();

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
        { backgroundColor: palette.addBg, shadowColor: palette.addShadow },
        p.isImporting && { opacity: 0.5 },
        p.importButtonStyle,
      ]}
      onPress={p.onImport}
      {...p.createPressHandlers(p.importButtonScale)}
    >
      <View style={footerStyles.importButtonContent}>
        {p.isImporting ? (
          <ActivityIndicator color={palette.addFg} size='small' />
        ) : null}
        <Text style={[footerStyles.importButtonText, { color: palette.addFg }]}>
          {p.isImporting ? 'Adding…' : p.importLabel}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
