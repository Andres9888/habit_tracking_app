/**
 * SeedlingIcon - Custom SVG seedling illustration
 *
 * A hand-crafted sprouting plant that replaces the emoji seedling.
 * Renders consistently across iOS and Android (unlike emoji).
 * Uses the emerald color palette from the design system.
 */

import Svg, { Path, Circle } from 'react-native-svg';

import { COLORS } from './constants';

interface SeedlingIconProps {
  size?: number;
}

/** Emerald shades for the illustration */
const LEAF_COLOR = COLORS.emerald500;
const LEAF_HIGHLIGHT = '#34D399'; // emerald-400
const STEM_COLOR = '#059669'; // emerald-600
const SOIL_COLOR = '#A8A29E'; // stone-400
const SOIL_DARK = '#78716C'; // stone-500

export function SeedlingIcon({ size = 36 }: SeedlingIconProps) {
  const scale = size / 36;

  return (
    <Svg fill='none' height={size} viewBox='0 0 36 36' width={size}>
      {/* Soil / ground arc */}
      <Path
        d='M8 28 C8 26, 12 24, 18 24 C24 24, 28 26, 28 28'
        fill={SOIL_COLOR}
        opacity={0.6}
      />
      <Path
        d='M10 28 C10 27, 13 25.5, 18 25.5 C23 25.5, 26 27, 26 28'
        fill={SOIL_DARK}
        opacity={0.4}
      />

      {/* Main stem - gentle curve */}
      <Path
        d='M18 24 C18 20, 17.5 16, 18 12'
        stroke={STEM_COLOR}
        strokeLinecap='round'
        strokeWidth={2 * scale}
      />

      {/* Left leaf - larger, sweeping curve */}
      <Path
        d='M18 16 C14 14, 10 12, 9 9 C12 9, 15 11, 18 16 Z'
        fill={LEAF_COLOR}
      />
      {/* Left leaf vein */}
      <Path
        d='M17 15.5 C14.5 13.5, 12 11.5, 10.5 10'
        opacity={0.4}
        stroke={STEM_COLOR}
        strokeLinecap='round'
        strokeWidth={0.8}
      />

      {/* Right leaf - slightly smaller for asymmetry */}
      <Path
        d='M18 13 C21 11, 24.5 10, 26 8 C24 9.5, 21 11.5, 18 13 Z'
        fill={LEAF_HIGHLIGHT}
      />
      {/* Right leaf vein */}
      <Path
        d='M19 12.5 C21 11.5, 23 10.5, 24.5 9.5'
        opacity={0.3}
        stroke={STEM_COLOR}
        strokeLinecap='round'
        strokeWidth={0.7}
      />

      {/* Tiny unfurling leaf at top */}
      <Path
        d='M18 12 C17 10, 16.5 8.5, 17 7 C17.5 8, 18 9.5, 18 12 Z'
        fill={LEAF_HIGHLIGHT}
        opacity={0.9}
      />

      {/* Dew drop on left leaf */}
      <Circle cx={12} cy={11.5} fill='white' opacity={0.6} r={1.2} />
    </Svg>
  );
}
