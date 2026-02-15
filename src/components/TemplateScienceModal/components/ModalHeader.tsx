/**
 * ModalHeader - Header with close and share buttons
 */

import React from 'react';
import { Text, Pressable } from 'react-native';

import Animated from 'react-native-reanimated';
import { X, Share2 } from 'lucide-react-native';

import type { HeaderProps } from '../TemplateScienceModal.types';
import { headerStyles } from '../styles';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ModalHeader = ({
  closeButtonAnimatedStyle,
  headerAnimatedStyle,
  headerTitleAnimatedStyle,
  onClose,
  onShare,
  pressHandlers,
  shareButtonAnimatedStyle,
  templateName,
}: HeaderProps) => {
  const theme = useAppTheme();
  const { colors } = useThemeColors();

  return (
    <Animated.View style={[headerStyles.header, headerAnimatedStyle]}>
      <AnimatedPressable
        accessibilityHint='Share this template with others'
        accessibilityLabel='Share template'
        accessibilityRole='button'
        style={[headerStyles.shareButton, shareButtonAnimatedStyle]}
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        onPress={onShare}
        {...pressHandlers}
      >
        <Share2 color={colors.text.secondary} size={20} strokeWidth={2} />
      </AnimatedPressable>

      <Animated.View style={headerTitleAnimatedStyle}>
        <Text
          numberOfLines={1}
          style={[
            headerStyles.headerTitle,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          {templateName}
        </Text>
      </Animated.View>

      <AnimatedPressable
        accessibilityHint='Double tap to close this modal'
        accessibilityLabel='Close habit details'
        accessibilityRole='button'
        style={[headerStyles.closeButton, closeButtonAnimatedStyle]}
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        onPress={onClose}
        {...pressHandlers}
      >
        <X color={colors.text.secondary} size={24} strokeWidth={2} />
      </AnimatedPressable>
    </Animated.View>
  );
};
