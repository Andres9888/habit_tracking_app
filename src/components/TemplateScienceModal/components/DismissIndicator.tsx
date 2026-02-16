import React from 'react';
import { View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { layoutStyles, themedLayoutStyles } from '../styles';

interface DismissIndicatorProps {
  animatedStyle: AnimatedStyle;
}

export function DismissIndicator({ animatedStyle }: DismissIndicatorProps) {
  const { colors } = useThemeColors();
  const themed = themedLayoutStyles(colors);

  return (
    <Animated.View style={[layoutStyles.dismissIndicator, animatedStyle]}>
      <View style={[layoutStyles.dismissPill, themed.dismissPill]} />
    </Animated.View>
  );
}
