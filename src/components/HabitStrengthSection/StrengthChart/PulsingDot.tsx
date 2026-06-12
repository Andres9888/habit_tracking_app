/**
 * PulsingDot Component
 *
 * Static endpoint dot at the current chart position (motion rule: no
 * decorative infinite loops). Name/props kept so StrengthChart is unchanged.
 */

import React from 'react';

import { Circle } from 'react-native-svg';

import { useThemeColors } from '@/theme/ThemeContext';

import { DOT_RADIUS } from '../constants';

interface PulsingDotProps {
  /** X coordinate */
  cx: number;
  /** Y coordinate */
  cy: number;
  /** Dot fill color */
  color: string;
  /** Unused; kept for call-site compatibility */
  animatedDotProps?: object;
}

/**
 * Renders a static endpoint dot with a card-color halo.
 */
export const PulsingDot = React.memo(function PulsingDot({
  cx,
  cy,
  color,
}: PulsingDotProps) {
  const { colors } = useThemeColors();
  // Guard against NaN coordinates - default to 0
  const safeCx = typeof cx === 'number' && !Number.isNaN(cx) ? cx : 0;
  const safeCy = typeof cy === 'number' && !Number.isNaN(cy) ? cy : 0;

  return (
    <Circle
      cx={safeCx}
      cy={safeCy}
      fill={color}
      r={DOT_RADIUS}
      stroke={colors.card}
      strokeWidth={2}
    />
  );
});
