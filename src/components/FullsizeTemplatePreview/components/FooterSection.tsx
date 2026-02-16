/**
 * Footer section for FullsizeTemplatePreview
 * Contains import and customize buttons with success state
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { createFooterStyles } from '../styles';
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
  successButtonGlowStyle,
  successIconBounceStyle,
  createPressHandlers,
  importButtonScale,
  customizeButtonScale,
  onImport,
  onCustomize,
}: FooterSectionProps) {
  const { colors } = useThemeColors();
  const footerStyles = React.useMemo(
    () => createFooterStyles(colors),
    [colors],
  );

  return (
    <View style={footerStyles.footerGradientWrapper}>
      <LinearGradient
        colors={[
          `${colors.background}00`,
          colors.background,
          colors.background,
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
            <View style={footerStyles.successButtonWrapper}>
              <Animated.View
                pointerEvents='none'
                style={[footerStyles.successButtonGlow, successButtonGlowStyle]}
              />
              <Animated.View
                style={[footerStyles.successButton, checkmarkAnimatedStyle]}
              >
                <Animated.View style={successIconBounceStyle}>
                  <Check color='#fff' size={22} strokeWidth={3} />
                </Animated.View>
                <Text style={footerStyles.successButtonText}>Added!</Text>
              </Animated.View>
            </View>
          ) : (
            <AnimatedPressable
              accessible
              accessibilityHint='Add this habit template to your list'
              accessibilityLabel={`Import ${templateName} habit`}
              accessibilityRole='button'
              disabled={isImporting}
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
                {isImporting ? 'Importing...' : 'Import This Habit'}
              </Text>
            </AnimatedPressable>
          )}

          {!isImported && (
            <AnimatedPressable
              accessible
              accessibilityHint='Customize habit details before adding'
              accessibilityLabel='Customize habit before importing'
              accessibilityRole='button'
              disabled={isImporting}
              style={[footerStyles.customizeLink, customizeButtonStyle]}
              onPress={onCustomize}
              {...createPressHandlers(customizeButtonScale, 0.98)}
            >
              <Text style={footerStyles.customizeLinkText}>
                Customize First →
              </Text>
            </AnimatedPressable>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
