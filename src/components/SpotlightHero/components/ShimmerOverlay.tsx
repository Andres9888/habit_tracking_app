/**
 * ShimmerOverlay Component
 * Animated shimmer effect for the spotlight hero
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

interface ShimmerOverlayProps {
  shimmerStyle: AnimatedStyle<ViewStyle>;
}

export const ShimmerOverlay: React.FC<ShimmerOverlayProps> = ({
  shimmerStyle,
}) => (
  <Animated.View style={[styles.shimmer, shimmerStyle]}>
    <LinearGradient
      colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
      end={{ x: 1, y: 0.5 }}
      start={{ x: 0, y: 0.5 }}
      style={styles.shimmerGradient}
    />
  </Animated.View>
);

const styles = StyleSheet.create({
  shimmer: {
    height: '200%',
    left: 0,
    position: 'absolute',
    top: '-50%',
    width: 100,
  },
  shimmerGradient: {
    flex: 1,
    width: 100,
  },
});
