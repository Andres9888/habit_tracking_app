/**
 * CardContainer Component
 *
 * Pressable container with animations for TemplateCard
 */

import type { AnimatedStyle } from 'react-native-reanimated';
import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import { SUCCESS_COLOR } from '../TemplateCard.constants';
import { styles } from '../TemplateCard.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardContainerProps {
  name: string;
  description: string;
  isLocked: boolean;
  isImported: boolean;
  iconColor: string;
  containerStyle: AnimatedStyle<ViewStyle>;
  shadowStyle: AnimatedStyle<ViewStyle>;
  glowStyle: AnimatedStyle<ViewStyle>;
  style?: ViewStyle;
  children: React.ReactNode;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function CardContainer({
  name,
  description,
  isLocked,
  isImported,
  iconColor,
  containerStyle,
  shadowStyle,
  glowStyle,
  style,
  children,
  onPress,
  onPressIn,
  onPressOut,
}: CardContainerProps) {
  const { colors } = useThemeColors();

  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Tap to preview, or tap Import Habit to add to your habits'
      accessibilityLabel={`${name} template. ${description}`}
      accessibilityRole='button'
      style={[
        styles.card,
        { backgroundColor: colors.card, opacity: isLocked ? 0.75 : 1 },
        containerStyle,
        shadowStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        pointerEvents='none'
        style={[
          styles.glowOverlay,
          { backgroundColor: SUCCESS_COLOR },
          glowStyle,
        ]}
      />
      <View
        style={[
          styles.accentBar,
          { backgroundColor: isImported ? SUCCESS_COLOR : iconColor },
        ]}
      />
      {children}
    </AnimatedPressable>
  );
}
