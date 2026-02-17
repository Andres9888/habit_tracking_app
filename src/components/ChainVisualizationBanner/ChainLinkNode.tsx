/* eslint-disable max-lines */
/**
 * ChainLinkNode.tsx
 *
 * A single animated chain link node for the ChainVisualizationBanner.
 *
 * Visuals:
 * - Completed day: SVG chain-link oval with accent color fill + inner highlight
 * - Missed day: hollow oval with dashed border (broken look)
 * - Future/pre-habit: ghost oval (very faded)
 *
 * Animation:
 * - Spring entrance (scale + fade)
 * - Shimmer overlay when streak >= 7
 */

import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, Easing } from 'react-native';
import Svg, { Ellipse, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { ChainDayStatus } from './chainBannerUtils';
import { getLinkSize } from './chainBannerUtils';

interface ChainLinkNodeProps {
  status: ChainDayStatus;
  runLength: number;
  dayLabel: string;
  isToday: boolean;
  accentColor: string;
  shimmerPosition: Animated.Value;
  hasShimmer: boolean;
  /** Entrance animation values from parent */
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
  /** Whether this is a newly-completed link (triggers extra bounce) */
  isNewlyCompleted?: boolean;
  reduceMotion?: boolean;
}

/** Parse hex to r,g,b components */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const parsed = Number.parseInt(clean, 16);
  return {
    r: (parsed >> 16) & 0xff,
    g: (parsed >> 8) & 0xff,
    b: parsed & 0xff,
  };
}

/** Darken a hex color by a factor (0–1) */
function darkenColor(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  const d = (v: number) =>
    Math.max(0, Math.round(v * (1 - factor)))
      .toString(16)
      .padStart(2, '0');
  return `#${d(r)}${d(g)}${d(b)}`;
}

/** Lighten a hex color */
function lightenColor(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  const l = (v: number) =>
    Math.min(255, Math.round(v + (255 - v) * factor))
      .toString(16)
      .padStart(2, '0');
  return `#${l(r)}${l(g)}${l(b)}`;
}

const ChainLinkNodeComponent: React.FC<ChainLinkNodeProps> = ({
  status,
  runLength,
  dayLabel,
  isToday,
  accentColor,
  shimmerPosition,
  hasShimmer,
  scaleAnim,
  opacityAnim,
  isNewlyCompleted = false,
  reduceMotion = false,
}) => {
  const size = getLinkSize(runLength);
  const isCompleted = status === 'completed';
  const isMissed = status === 'missed';
  const isGhost = status === 'pre-habit' || status === 'future';

  // Extra bounce for newly-completed links
  const bounceAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isNewlyCompleted && !reduceMotion) {
      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1.35,
          damping: 6,
          stiffness: 250,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          damping: 18,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewlyCompleted]);

  // Shimmer translate (from -size to +size range)
  const shimmerTranslate = shimmerPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-size * 2, size * 2],
  });

  const fillColor = isCompleted
    ? accentColor
    : isMissed
    ? '#d4d0cb'
    : '#e8e6e3';
  const darkFill = isCompleted ? darkenColor(accentColor, 0.2) : '#b8b4af';
  const lightHighlight = isCompleted ? lightenColor(accentColor, 0.35) : '#eeeceb';
  const opacity = isGhost ? 0.25 : isMissed ? 0.55 : 1;

  // Chain-link oval dimensions
  const rx = size * 0.52;
  const ry = size * 0.38;
  const svgW = size * 1.1;
  const svgH = size * 0.85;
  const cx = svgW / 2;
  const cy = svgH / 2;
  // Inner hole (hollow oval)
  const innerRx = rx * 0.42;
  const innerRy = ry * 0.42;

  // Today ring highlight
  const todayRingColor = isCompleted ? lightHighlight : '#a8a5a0';

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        opacity: Animated.multiply(opacityAnim, opacity),
        transform: [
          { scale: Animated.multiply(scaleAnim, bounceAnim) },
        ],
      }}
    >
      <View style={{ width: svgW, height: svgH, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={svgW} height={svgH}>
          <Defs>
            <LinearGradient id={`lg-${dayLabel}-${runLength}`} x1='0' y1='0' x2='0' y2='1'>
              <Stop offset='0' stopColor={lightHighlight} stopOpacity='0.7' />
              <Stop offset='0.5' stopColor={fillColor} stopOpacity='1' />
              <Stop offset='1' stopColor={darkFill} stopOpacity='1' />
            </LinearGradient>
          </Defs>

          {/* Outer ring / body */}
          <Ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={isMissed ? 'none' : `url(#lg-${dayLabel}-${runLength})`}
            stroke={isMissed ? '#b8b4af' : darkFill}
            strokeWidth={isMissed ? 1.5 : 0}
            strokeDasharray={isMissed ? '3,2' : undefined}
          />

          {/* Inner hole for completed links — creates the chain-link look */}
          {isCompleted && (
            <Ellipse
              cx={cx}
              cy={cy}
              rx={innerRx}
              ry={innerRy}
              fill='rgba(255,255,255,0.22)'
            />
          )}

          {/* Today ring */}
          {isToday && (
            <Ellipse
              cx={cx}
              cy={cy}
              rx={rx + 2}
              ry={ry + 2}
              fill='none'
              stroke={todayRingColor}
              strokeWidth={1.5}
              strokeDasharray='4,2'
            />
          )}

          {/* Missed: X mark */}
          {isMissed && (
            <>
              <Path
                d={`M ${cx - innerRx * 0.6} ${cy - innerRy * 0.6} L ${cx + innerRx * 0.6} ${cy + innerRy * 0.6}`}
                stroke='#9b9590'
                strokeWidth={1.2}
                strokeLinecap='round'
              />
              <Path
                d={`M ${cx + innerRx * 0.6} ${cy - innerRy * 0.6} L ${cx - innerRx * 0.6} ${cy + innerRy * 0.6}`}
                stroke='#9b9590'
                strokeWidth={1.2}
                strokeLinecap='round'
              />
            </>
          )}
        </Svg>

        {/* Shimmer overlay for high-streak links */}
        {isCompleted && hasShimmer && (
          <Animated.View
            pointerEvents='none'
            style={{
              position: 'absolute',
              width: svgW,
              height: svgH,
              borderRadius: ry,
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: size * 0.6,
                backgroundColor: 'rgba(255,255,255,0.28)',
                borderRadius: ry,
                transform: [{ translateX: shimmerTranslate }],
              }}
            />
          </Animated.View>
        )}
      </View>

      {/* Day label below the link */}
      <Text
        style={{
          color: isCompleted ? accentColor : '#9b9590',
          fontSize: 10,
          fontWeight: isToday ? '700' : '500',
          marginTop: 2,
          textAlign: 'center',
        }}
      >
        {dayLabel}
      </Text>
    </Animated.View>
  );
};

export const ChainLinkNode = React.memo(ChainLinkNodeComponent);
