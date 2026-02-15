
import React from 'react';
import { View } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { layoutStyles } from '../styles';

interface DismissIndicatorProps {
  animatedStyle: AnimatedStyle;
}

export function DismissIndicator({ animatedStyle }: DismissIndicatorProps) {
  return (
    <Animated.View style={[layoutStyles.dismissIndicator, animatedStyle]}>
      <View style={layoutStyles.dismissPill} />
    </Animated.View>
  );
}
