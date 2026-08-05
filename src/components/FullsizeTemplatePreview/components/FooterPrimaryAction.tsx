/**
 * Primary footer action for the template preview: the import CTA (Duolingo
 * press-depth), or the success pill once added.
 */

import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Plus } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { iconSizes } from '@/theme/iconSizes';
import { darkenColor } from '../../CreateHabitModal/components/StickyCreateBar/colorUtils';
import { footerStyles } from '../styles';
import { useCtaDepth } from '../hooks/useCtaDepth';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FooterPrimaryActionProps {
  checkmarkAnimatedStyle: object;
  iconColor: string;
  importLabel: string;
  isImported: boolean;
  isImporting: boolean;
  reducedMotion: boolean;
  successPillStyle: object;
  templateName: string;
  onImport: () => void;
}

export function FooterPrimaryAction(p: FooterPrimaryActionProps) {
  const { depthStyle, pressHandlers } = useCtaDepth({ reducedMotion: p.reducedMotion });

  if (p.isImported) {
    // No deep backing color here: the wrap must stay transparent so nothing
    // peeks out while the success pill springs from 0.95 to 1.
    return (
      <View style={footerStyles.ctaShadowWrap}>
        <Animated.View
          testID='templates-preview-added'
          style={[footerStyles.successButton, p.successPillStyle]}
        >
          <Animated.View style={p.checkmarkAnimatedStyle}>
            <Check color={colors.text.inverse} size={iconSizes.large} strokeWidth={3} />
          </Animated.View>
          <Text style={footerStyles.successButtonText}>Added!</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[footerStyles.ctaShadowWrap, { backgroundColor: darkenColor(p.iconColor, 22) }]}>
      <AnimatedPressable
        accessible
        accessibilityHint='Add this habit to your list'
        accessibilityLabel={`Add ${p.templateName} to my habits`}
        accessibilityRole='button'
        disabled={p.isImporting}
        testID='templates-preview-quick-add'
        style={[
          footerStyles.importButton,
          { backgroundColor: p.iconColor },
          p.isImporting && { opacity: 0.5 },
          depthStyle,
        ]}
        onPress={p.onImport}
        {...pressHandlers}
      >
        {p.isImporting ? (
          <View style={footerStyles.importButtonContent}>
            <ActivityIndicator color={colors.text.inverse} size='small' />
            <Text style={footerStyles.importButtonText}>Adding…</Text>
          </View>
        ) : (
          <View style={footerStyles.importButtonContent}>
            <Plus color={colors.text.inverse} size={iconSizes.medium} strokeWidth={2.4} />
            <Text style={footerStyles.importButtonText}>{p.importLabel}</Text>
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
}
