/**
 * BreakIndicator Component
 * Renders a visual indicator showing where a streak was broken
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import type { BreakIndicatorProps } from './types';
import { generateBreakPath, calculateBreakCenter } from './utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

/**
 * BreakIndicator renders a dashed line with an "X" icon to indicate
 * where a streak was broken (gap between two segments)
 *
 * Features:
 * - Dashed line connecting the two cells surrounding the break
 * - "X" icon at the center to emphasize the break
 * - Subtle entrance animation
 * - Configurable appearance (color, opacity, thickness)
 */
export function BreakIndicator({
  break_,
  config,
  reduceMotion,
  cellSize,
  animationDelay,
}: BreakIndicatorProps) {
  const { color, opacity, thickness, dashPattern, showIcon, iconSize } = config;

  // Animation value
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  // Calculate path
  const pathD = useMemo(() => generateBreakPath(break_, cellSize), [break_, cellSize]);

  // Calculate center for icon
  const center = useMemo(() => calculateBreakCenter(break_), [break_]);

  // Entrance animation
  useEffect(() => {
    if (!reduceMotion) {
      progress.value = withDelay(
        animationDelay,
        withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        })
      );
    }
  }, [animationDelay, progress, reduceMotion]);

  // Animated path props
  const animatedPathProps = useAnimatedProps(() => {
    const animatedOpacity = interpolate(progress.value, [0, 1], [0, opacity]);
    const dashOffset = interpolate(progress.value, [0, 1], [50, 0]);

    return {
      opacity: animatedOpacity,
      strokeDashoffset: reduceMotion ? 0 : dashOffset,
    };
  });

  // Animated icon props (X marks)
  const animatedLine1Props = useAnimatedProps(() => {
    const animatedOpacity = interpolate(progress.value, [0.5, 1], [0, opacity]);
    const scale = interpolate(progress.value, [0.5, 1], [0.5, 1]);

    return {
      opacity: animatedOpacity,
      strokeWidth: thickness * scale,
    };
  });

  const animatedLine2Props = useAnimatedProps(() => {
    const animatedOpacity = interpolate(progress.value, [0.6, 1], [0, opacity]);
    const scale = interpolate(progress.value, [0.6, 1], [0.5, 1]);

    return {
      opacity: animatedOpacity,
      strokeWidth: thickness * scale,
    };
  });

  // Animated circle background for icon
  const animatedCircleProps = useAnimatedProps(() => {
    const animatedOpacity = interpolate(progress.value, [0.4, 0.8], [0, opacity * 0.3]);
    const animatedR = interpolate(progress.value, [0.4, 0.8], [0, iconSize / 2 + 2]);

    return {
      opacity: animatedOpacity,
      r: animatedR,
    };
  });

  // Don't render if positions are missing
  if (!break_.beforePosition || !break_.afterPosition || !pathD || !center) {
    return null;
  }

  // Calculate bounds for SVG viewport
  const minX = Math.min(break_.beforePosition.x, break_.afterPosition.x) - cellSize;
  const minY = Math.min(break_.beforePosition.y, break_.afterPosition.y) - cellSize;
  const maxX = Math.max(break_.beforePosition.x, break_.afterPosition.x) + cellSize;
  const maxY = Math.max(break_.beforePosition.y, break_.afterPosition.y) + cellSize;
  const width = maxX - minX;
  const height = maxY - minY;

  // Calculate X icon positions (diagonal lines)
  const halfIcon = iconSize / 2;
  const x1Start = center.x - halfIcon * 0.7;
  const y1Start = center.y - halfIcon * 0.7;
  const x1End = center.x + halfIcon * 0.7;
  const y1End = center.y + halfIcon * 0.7;
  const x2Start = center.x + halfIcon * 0.7;
  const y2Start = center.y - halfIcon * 0.7;
  const x2End = center.x - halfIcon * 0.7;
  const y2End = center.y + halfIcon * 0.7;

  return (
    <Svg
      height={height}
      style={[
        styles.container,
        {
          left: minX,
          top: minY,
        },
      ]}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      width={width}
    >
      {/* Dashed line connecting the cells */}
      <AnimatedPath
        animatedProps={animatedPathProps}
        d={pathD}
        fill="none"
        stroke={color}
        strokeDasharray={dashPattern}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={thickness}
      />

      {/* Break icon (X mark) */}
      {showIcon && (
        <>
          {/* Background circle */}
          <AnimatedCircle
            animatedProps={animatedCircleProps}
            cx={center.x}
            cy={center.y}
            fill="#ffffff"
          />

          {/* X mark - line 1 (top-left to bottom-right) */}
          <AnimatedLine
            animatedProps={animatedLine1Props}
            x1={x1Start}
            y1={y1Start}
            x2={x1End}
            y2={y1End}
            stroke={color}
            strokeLinecap="round"
          />

          {/* X mark - line 2 (top-right to bottom-left) */}
          <AnimatedLine
            animatedProps={animatedLine2Props}
            x1={x2Start}
            y1={y2Start}
            x2={x2End}
            y2={y2End}
            stroke={color}
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    pointerEvents: 'none',
    position: 'absolute',
  },
});

export default BreakIndicator;
