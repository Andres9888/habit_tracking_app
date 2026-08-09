/**
 * Primary footer action for the template preview:
 * the import CTA, or the success pill once added.
 *
 * When a start-small version exists, a quiet subline under the label previews
 * the floor commitment before the tap — only while not yet imported.
 */

import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { footerStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
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
  /** Floor version shown under the CTA while still deciding. */
  startSmallVersion?: string;
  successPillStyle: object;
  templateName: string;
  onImport: () => void;
}

export function FooterPrimaryAction(p: FooterPrimaryActionProps) {
  const palette = useDetailPalette();
  const startWith = p.startSmallVersion?.trim();

  if (p.isImported) {
    return (
      <Animated.View
        testID='templates-preview-added'
        style={[
          footerStyles.successButton,
          { backgroundColor: palette.addedBg },
          p.successPillStyle,
        ]}
      >
        <Animated.View style={p.checkmarkAnimatedStyle}>
          <Check
            color={palette.addedFg}
            size={iconSizes.large}
            strokeWidth={3}
          />
        </Animated.View>
        <Text
          style={[footerStyles.successButtonText, { color: palette.addedFg }]}
        >
          Added
        </Text>
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
        { backgroundColor: palette.addBg, shadowColor: palette.addShadow },
        p.isImporting && { opacity: 0.5 },
        p.importButtonStyle,
      ]}
      onPress={p.onImport}
      {...p.createPressHandlers(p.importButtonScale)}
    >
      {p.isImporting ? (
        <View style={footerStyles.importButtonRow}>
          <ActivityIndicator color={palette.addFg} size='small' />
          <Text
            style={[footerStyles.importButtonText, { color: palette.addFg }]}
          >
            Adding…
          </Text>
        </View>
      ) : (
        <View style={footerStyles.importButtonContent}>
          <Text
            style={[footerStyles.importButtonText, { color: palette.addFg }]}
          >
            {p.importLabel}
          </Text>
          {startWith ? (
            <Text
              numberOfLines={1}
              style={[footerStyles.importSubline, { color: palette.addFg }]}
            >
              {`Start with: ${startWith}`}
            </Text>
          ) : null}
        </View>
      )}
    </AnimatedPressable>
  );
}
