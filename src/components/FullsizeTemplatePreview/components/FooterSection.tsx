/**
 * Footer section for FullsizeTemplatePreview
 * Contains import and customize buttons with success state
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { iconSizes } from '@/theme/iconSizes';
import { footerStyles } from '../styles';
import type { FooterSectionProps } from './FooterSection.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FooterSection({
  templateName,
  iconColor,
  isImporting,
  isImported,
  bottomInset,
  importButtonStyle,
  customizeButtonStyle,
  checkmarkAnimatedStyle,
  successPillStyle,
  createPressHandlers,
  importButtonScale,
  customizeButtonScale,
  onImport,
  onCustomize,
}: FooterSectionProps) {
  return (
    <View style={footerStyles.footerGradientWrapper}>
      {/* Intentional rgba gradient — fades from transparent to gray[50] (#FAF8F5) */}
      <LinearGradient
        colors={[
          'rgba(250, 248, 245, 0)',
          'rgba(250, 248, 245, 1)',
          'rgba(250, 248, 245, 1)',
        ]}
        style={footerStyles.footerGradient}
      >
        <View
          style={[
            footerStyles.footer,
            { paddingBottom: Math.max(bottomInset, 20) },
          ]}
        >
          {isImported ? (
            <Animated.View
              testID='templates-preview-added'
              style={[footerStyles.successButton, successPillStyle]}
            >
              <Animated.View style={checkmarkAnimatedStyle}>
                <Check
                  color={colors.text.inverse}
                  size={iconSizes.large}
                  strokeWidth={3}
                />
              </Animated.View>
              <Text style={footerStyles.successButtonText}>Added!</Text>
            </Animated.View>
          ) : (
            <AnimatedPressable
              accessible
              accessibilityHint='Add this habit to your list'
              accessibilityLabel={`Add ${templateName} to my habits`}
              accessibilityRole='button'
              disabled={isImporting}
              testID='templates-preview-quick-add'
              style={[
                footerStyles.importButton,
                { backgroundColor: iconColor },
                isImporting && { opacity: 0.5 },
                importButtonStyle,
              ]}
              onPress={onImport}
              {...createPressHandlers(importButtonScale)}
            >
              <Text style={footerStyles.importButtonText}>
                {isImporting ? 'Adding…' : 'Add to my habits'}
              </Text>
            </AnimatedPressable>
          )}

          {isImported ? null : (
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
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
