/**
 * BatchedConnectionPath Component
 * Renders multiple connections in a single SVG for improved performance
 *
 * This component is specifically optimized for year view where we may have
 * 200-364 connections. Instead of creating individual Svg elements for each
 * connection, we batch them into a single SVG with multiple paths.
 */

import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import type { ChainConnection, ConnectionConfig } from './types';
import {
  generateConnectionPath,
  getStrengthConfig,
  DEFAULT_PROGRESSION_GRADIENT,
  calculateProgressionOpacity,
  calculateProgressionThickness,
  calculateProgressionColor,
} from './utils';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface BatchedConnectionPathProps {
  /** Array of connections to render in this batch */
  connections: ChainConnection[];
  /** Visual configuration */
  config: ConnectionConfig;
  /** SVG viewport dimensions */
  viewBox: {
    minX: number;
    minY: number;
    width: number;
    height: number;
  };
  /** Animation delay for the batch (ms) */
  animationDelay?: number;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Renders multiple connection paths in a single SVG element
 *
 * Performance benefits:
 * - Single SVG element instead of N elements
 * - No per-connection animation hooks
 * - Reduced React reconciliation overhead
 * - Uses CSS-style opacity animation instead of Reanimated per-path
 */
export function BatchedConnectionPath({
  connections,
  config,
  viewBox,
  animationDelay = 0,
  testID,
}: BatchedConnectionPathProps) {
  const { habitColor, reduceMotion, cellSize, progressionGradient } = config;

  // Use progression gradient (default enabled if not specified)
  const gradient = progressionGradient ?? DEFAULT_PROGRESSION_GRADIENT;

  // Pre-calculate all path data and styles
  const pathData = useMemo(() => {
    return connections.map((connection) => {
      const strengthConfig = getStrengthConfig(connection.strength);
      const baseOpacity = strengthConfig.maxOpacity;
      const baseThickness = strengthConfig.height;
      const baseColor = strengthConfig.useAccent
        ? habitColor
        : config.useMutedColors
          ? '#d6d3d1' // stone-300
          : '#a8a29e'; // stone-400

      const color = calculateProgressionColor(connection, baseColor, gradient);
      const opacity = calculateProgressionOpacity(
        connection,
        baseOpacity,
        gradient
      );
      const thickness = calculateProgressionThickness(
        connection,
        baseThickness,
        gradient
      );
      const pathD = generateConnectionPath(connection, cellSize);

      return {
        color,
        id: connection.id,
        opacity,
        pathD,
        showShadow: strengthConfig.showShadow,
        thickness,
      };
    });
  }, [connections, habitColor, config.useMutedColors, cellSize, gradient]);

  // Simple fade-in animation for the entire batch
  const animatedStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return { opacity: 1 };
    }
    return {};
  });

  // Don't render if no connections
  if (connections.length === 0) {
    return null;
  }

  const { minX, minY, width, height } = viewBox;

  // Use Reanimated's FadeIn for simple entrance animation
  const enteringAnimation = reduceMotion
    ? undefined
    : FadeIn.delay(animationDelay)
        .duration(400)
        .easing(Easing.out(Easing.cubic));

  return (
    <AnimatedSvg
      entering={enteringAnimation}
      height={height}
      style={[styles.container, animatedStyle, { left: minX, top: minY }]}
      testID={testID}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      width={width}
    >
      <G>
        {/* Shadow paths for legendary streaks (rendered first, behind) */}
        {pathData
          .filter((p) => p.showShadow)
          .map((path) => (
            <Path
              key={`shadow-${path.id}`}
              d={path.pathD}
              fill='none'
              opacity={0.2}
              stroke={habitColor}
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={path.thickness + 4}
            />
          ))}

        {/* Main connection paths */}
        {pathData.map((path) => (
          <Path
            key={path.id}
            d={path.pathD}
            fill='none'
            opacity={path.opacity}
            stroke={path.color}
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={path.thickness}
          />
        ))}
      </G>
    </AnimatedSvg>
  );
}

const styles = StyleSheet.create({
  container: {
    pointerEvents: 'none',
    position: 'absolute',
  },
});

export default BatchedConnectionPath;
