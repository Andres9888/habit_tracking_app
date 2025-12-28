/**
 * ConnectionPath Component
 * Renders a single SVG path between consecutive completed cells
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import type { ConnectionPathProps, ChainConnection } from './types';
import { generateConnectionPath, getStrengthConfig } from './utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * ConnectionPath renders the visual link between two consecutive completed cells
 *
 * Features:
 * - Strength-based line thickness and opacity
 * - Staggered entrance animation
 * - Shimmer effect for strong streaks
 * - Accent color for active streaks, muted for historical
 */
export function ConnectionPath({
  connection,
  config,
  animationDelay,
}: ConnectionPathProps) {
  const { habitColor, reduceMotion, cellSize } = config;
  const strengthConfig = getStrengthConfig(connection.strength);

  // Animation values
  const progress = useSharedValue(reduceMotion ? 1 : 0);
  const shimmerOffset = useSharedValue(0);

  // Calculate path
  const pathD = generateConnectionPath(connection, cellSize);

  // Entrance animation
  useEffect(() => {
    if (!reduceMotion) {
      progress.value = withDelay(
        animationDelay,
        withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        })
      );
    }
  }, [animationDelay, progress, reduceMotion]);

  // Shimmer animation for strong streaks
  useEffect(() => {
    if (!reduceMotion && strengthConfig.shimmerSpeed > 0) {
      const animate = () => {
        shimmerOffset.value = 0;
        shimmerOffset.value = withTiming(1, {
          duration: strengthConfig.shimmerSpeed,
          easing: Easing.inOut(Easing.ease),
        });
      };

      animate();
      const interval = setInterval(animate, strengthConfig.shimmerSpeed + 500);
      return () => clearInterval(interval);
    }
  }, [reduceMotion, shimmerOffset, strengthConfig.shimmerSpeed]);

  // Determine colors
  const lineColor = strengthConfig.useAccent
    ? habitColor
    : config.useMutedColors
      ? '#d6d3d1' // stone-300
      : '#a8a29e'; // stone-400

  // Animated path props
  const animatedPathProps = useAnimatedProps(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, strengthConfig.maxOpacity]);
    const dashOffset = interpolate(progress.value, [0, 1], [100, 0]);

    return {
      opacity,
      strokeDashoffset: reduceMotion ? 0 : dashOffset,
    };
  });

  // Calculate path bounds for proper sizing
  const { fromPosition, toPosition } = connection;
  const minX = Math.min(fromPosition.x, toPosition.x) - cellSize;
  const minY = Math.min(fromPosition.y, toPosition.y) - cellSize;
  const maxX = Math.max(fromPosition.x, toPosition.x) + cellSize;
  const maxY = Math.max(fromPosition.y, toPosition.y) + cellSize;
  const width = maxX - minX;
  const height = maxY - minY;

  // Gradient ID for shimmer effect
  const gradientId = `shimmer-${connection.id}`;

  return (
    <Svg
      width={width}
      height={height}
      style={[
        styles.container,
        {
          left: minX,
          top: minY,
        },
      ]}
      viewBox={`${minX} ${minY} ${width} ${height}`}
    >
      {/* Shimmer gradient for strong streaks */}
      {strengthConfig.shimmerSpeed > 0 && (
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={lineColor} stopOpacity={strengthConfig.maxOpacity} />
            <Stop offset="40%" stopColor="#ffffff" stopOpacity={0.6} />
            <Stop offset="60%" stopColor="#ffffff" stopOpacity={0.6} />
            <Stop offset="100%" stopColor={lineColor} stopOpacity={strengthConfig.maxOpacity} />
          </LinearGradient>
        </Defs>
      )}

      {/* Main connection path */}
      <AnimatedPath
        d={pathD}
        stroke={strengthConfig.shimmerSpeed > 0 ? `url(#${gradientId})` : lineColor}
        strokeWidth={strengthConfig.height}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={reduceMotion ? undefined : '100'}
        animatedProps={animatedPathProps}
      />

      {/* Shadow glow for legendary streaks */}
      {strengthConfig.showShadow && (
        <Path
          d={pathD}
          stroke={habitColor}
          strokeWidth={strengthConfig.height + 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.2}
        />
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    pointerEvents: 'none',
  },
});

export default ConnectionPath;
