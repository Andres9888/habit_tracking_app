/**
 * ConfettiParticle - Shape-aware confetti particle component
 *
 * Renders 5 distinct shapes for celebration effects:
 * - Circle: Simple round particle
 * - Star: 5-pointed star using overlapping triangles
 * - Heart: Classic heart shape using two circles + rotated square
 * - Sparkle: 4-pointed star burst
 * - Ribbon: Thin rectangular streamer with rotation
 *
 * Uses react-native-reanimated for 60fps performance.
 * Shapes are pure React Native Views (no SVG dependency).
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { ConfettiShape } from './types';

interface ConfettiParticleProps {
  /** The confetti shape to render */
  shape: ConfettiShape;
  /** Color of the particle */
  color: string;
  /** Base size in pixels (will be multiplied by sizeFactor) */
  size: number;
  /** Size multiplier (0.8 - 1.2 for variety) */
  sizeFactor?: number;
  /** Animated style for position, rotation, opacity transforms */
  animatedStyle: AnimatedStyle<{
    opacity?: number;
    transform?: Array<
      | { translateX: number }
      | { translateY: number }
      | { rotate: string }
      | { scale: number }
    >;
  }>;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Circle shape - simple round particle
 */
const CircleShape = memo(function CircleShape({
  color,
  actualSize,
}: {
  color: string;
  actualSize: number;
}) {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: actualSize / 2,
        height: actualSize,
        width: actualSize,
      }}
    />
  );
});

/**
 * Star shape - 5-pointed star using two overlapping triangles technique
 * Creates a star effect using CSS transforms
 */
const StarShape = memo(function StarShape({
  color,
  actualSize,
}: {
  color: string;
  actualSize: number;
}) {
  const triangleSize = actualSize * 0.6;
  const triangleHeight = triangleSize * 0.866; // equilateral triangle height

  return (
    <View
      style={{
        alignItems: 'center',
        height: actualSize,
        justifyContent: 'center',
        width: actualSize,
      }}
    >
      {/* Upper triangle pointing up */}
      <View
        style={{
          borderBottomColor: color,
          borderBottomWidth: triangleHeight,
          borderLeftColor: 'transparent',
          borderLeftWidth: triangleSize / 2,
          borderRightColor: 'transparent',
          borderRightWidth: triangleSize / 2,
          height: 0,
          position: 'absolute',
          top: actualSize * 0.1,
          width: 0,
        }}
      />
      {/* Lower triangle pointing down */}
      <View
        style={{
          borderLeftColor: 'transparent',
          borderLeftWidth: triangleSize / 2,
          borderRightColor: 'transparent',
          borderRightWidth: triangleSize / 2,
          borderTopColor: color,
          borderTopWidth: triangleHeight,
          bottom: actualSize * 0.1,
          height: 0,
          position: 'absolute',
          width: 0,
        }}
      />
    </View>
  );
});

/**
 * Heart shape - classic heart using two circles and rotated square
 */
const HeartShape = memo(function HeartShape({
  color,
  actualSize,
}: {
  color: string;
  actualSize: number;
}) {
  const halfSize = actualSize / 2;
  const circleRadius = halfSize * 0.5;

  return (
    <View
      style={{
        height: actualSize,
        transform: [{ rotate: '-45deg' }],
        width: actualSize,
      }}
    >
      {/* Left circle of heart */}
      <View
        style={{
          backgroundColor: color,
          borderRadius: circleRadius,
          height: circleRadius * 2,
          left: -circleRadius,
          position: 'absolute',
          top: halfSize - circleRadius,
          width: circleRadius * 2,
        }}
      />
      {/* Top circle of heart */}
      <View
        style={{
          backgroundColor: color,
          borderRadius: circleRadius,
          height: circleRadius * 2,
          left: halfSize - circleRadius,
          position: 'absolute',
          top: -circleRadius,
          width: circleRadius * 2,
        }}
      />
      {/* Square body */}
      <View
        style={{
          backgroundColor: color,
          height: halfSize,
          left: 0,
          position: 'absolute',
          top: halfSize - circleRadius,
          width: halfSize,
        }}
      />
    </View>
  );
});

/**
 * Sparkle shape - 4-pointed star burst
 */
const SparkleShape = memo(function SparkleShape({
  color,
  actualSize,
}: {
  color: string;
  actualSize: number;
}) {
  const armWidth = actualSize * 0.15;
  const armLength = actualSize;

  return (
    <View
      style={{
        alignItems: 'center',
        height: actualSize,
        justifyContent: 'center',
        width: actualSize,
      }}
    >
      {/* Vertical arm */}
      <View
        style={{
          backgroundColor: color,
          borderRadius: armWidth / 2,
          height: armLength,
          position: 'absolute',
          width: armWidth,
        }}
      />
      {/* Horizontal arm */}
      <View
        style={{
          backgroundColor: color,
          borderRadius: armWidth / 2,
          height: armWidth,
          position: 'absolute',
          width: armLength,
        }}
      />
      {/* 45-degree arm */}
      <View
        style={{
          backgroundColor: color,
          borderRadius: armWidth / 2,
          height: armLength * 0.7,
          position: 'absolute',
          transform: [{ rotate: '45deg' }],
          width: armWidth,
        }}
      />
      {/* -45-degree arm */}
      <View
        style={{
          backgroundColor: color,
          borderRadius: armWidth / 2,
          height: armLength * 0.7,
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
          width: armWidth,
        }}
      />
    </View>
  );
});

/**
 * Ribbon shape - thin rectangular streamer
 */
const RibbonShape = memo(function RibbonShape({
  color,
  actualSize,
}: {
  color: string;
  actualSize: number;
}) {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 1,
        height: actualSize * 1.5,
        width: actualSize * 0.25,
      }}
    />
  );
});

/**
 * Main confetti particle component
 * Renders the appropriate shape based on the shape prop
 */
export const ConfettiParticle = memo(function ConfettiParticle({
  shape,
  color,
  size,
  sizeFactor = 1,
  animatedStyle,
  testID,
}: ConfettiParticleProps) {
  const actualSize = size * sizeFactor;

  const shapeComponent = useMemo(() => {
    switch (shape) {
      case 'circle': {
        return <CircleShape actualSize={actualSize} color={color} />;
      }
      case 'star': {
        return <StarShape actualSize={actualSize} color={color} />;
      }
      case 'heart': {
        return <HeartShape actualSize={actualSize} color={color} />;
      }
      case 'sparkle': {
        return <SparkleShape actualSize={actualSize} color={color} />;
      }
      case 'ribbon': {
        return <RibbonShape actualSize={actualSize} color={color} />;
      }
      default: {
        return <CircleShape actualSize={actualSize} color={color} />;
      }
    }
  }, [shape, color, actualSize]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={[styles.particle, animatedStyle]}
      testID={testID}
    >
      {shapeComponent}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});

export default ConfettiParticle;
