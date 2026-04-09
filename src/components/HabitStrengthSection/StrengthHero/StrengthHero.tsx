/**
 * StrengthHero Component
 *
 * Displays the current habit strength with:
 * - Circular progress ring (72x72px) with animated fill
 * - Percentage number with count-up animation
 * - Strength label (Strong/Developing/Weak)
 * - Delta badge showing change vs previous period
 *
 * @example
 * ```tsx
 * <StrengthHero
 *   strength={72}
 *   label="strong"
 *   delta={12}
 *   deltaLabel="vs last month"
 * />
 * ```
 */

import React from 'react';
import { View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';

import { getStrengthColors } from '../constants';
import { ProgressRing } from './ProgressRing';
import { StatusDisplay } from './StatusDisplay';
import type { StrengthHeroProps } from './types';
import { useStrengthHeroAnimations } from './useStrengthHeroAnimations';

/**
 * StrengthHero displays the main strength indicator with animated ring.
 */
export const StrengthHero = React.memo(function StrengthHero({
  strength,
  label,
  delta,
  deltaLabel,
  color,
}: StrengthHeroProps) {
  const { colors: themeColors } = useThemeColors();
  const strengthColors = getStrengthColors(themeColors);
  // Guard against invalid label - default to 'weak'
  const safeLabel = label && strengthColors[label] ? label : 'weak';
  // Get colors based on strength level
  const colors = strengthColors[safeLabel];
  const ringColor = color || colors.primary;

  // Animation state
  const { animatedStrength, roundedStrength } =
    useStrengthHeroAnimations(strength);

  return (
    <View className='flex-row items-center'>
      <ProgressRing
        animatedStrength={animatedStrength}
        ringColor={ringColor}
        roundedStrength={roundedStrength}
      />
      <StatusDisplay delta={delta} deltaLabel={deltaLabel} label={label} />
    </View>
  );
});
