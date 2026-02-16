/**
 * ModalHeader - Header with close and share buttons
 */

import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { X, Share2 } from 'lucide-react-native';
import { AccessibleText } from '../../ui/AccessibleText';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { headerStyles, themedHeaderStyles } from '../styles';
import type { HeaderProps } from '../TemplateScienceModal.types';

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
  const themed = themedHeaderStyles(colors);

  return (
    <Animated.View style={[themed.header, headerAnimatedStyle]}>
      <AnimatedPressable
        accessibilityHint='Share this template with others'
        accessibilityLabel='Share template'
        accessibilityRole='button'
        style={[themed.shareButton, shareButtonAnimatedStyle]}
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        onPress={onShare}
        {...pressHandlers}
      >
        <Share2 color={colors.text.secondary} size={20} strokeWidth={2} />
      </AnimatedPressable>

      <Animated.View style={headerTitleAnimatedStyle}>
        <AccessibleText
          scalingType='strict'
          numberOfLines={1}
          style={[
            themed.headerTitle,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          {templateName}
        </AccessibleText>
      </Animated.View>

      <AnimatedPressable
        accessibilityHint='Double tap to close this modal'
        accessibilityLabel='Close habit details'
        accessibilityRole='button'
        style={[themed.closeButton, closeButtonAnimatedStyle]}
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        onPress={onClose}
        {...pressHandlers}
      >
        <X color={colors.text.secondary} size={24} strokeWidth={2} />
      </AnimatedPressable>
    </Animated.View>
  );
};
