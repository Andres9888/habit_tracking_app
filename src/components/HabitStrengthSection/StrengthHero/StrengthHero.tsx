/**
 * StrengthHero Component
 *
 * The centered hero for the Strength section:
 * - Large progress ring with the animated percentage
 * - Level name (Starting / Building / Developing / Strong / Automatic)
 * - The "X% to <next level>" goal-gradient hint, riding with the proud focal
 *   point so the section tells the progress story in one place.
 *
 * @example
 * ```tsx
 * <StrengthHero strength={68} journey={journey} />
 * ```
 */

import React from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';

import { ProgressRing } from './ProgressRing';
import type { StrengthHeroProps } from './types';
import { useStrengthHeroAnimations } from './useStrengthHeroAnimations';

/**
 * StrengthHero displays the main strength indicator with animated ring.
 */
export const StrengthHero = React.memo(function StrengthHero({
  strength,
  journey,
}: StrengthHeroProps) {
  const { colors } = useThemeColors();
  const { current } = journey;
  const stageColor = current.color;

  const { animatedStrength, roundedStrength } =
    useStrengthHeroAnimations(strength);

  return (
    <View className='items-center'>
      <ProgressRing
        animatedStrength={animatedStrength}
        label={current.label}
        ringColor={stageColor}
        roundedStrength={roundedStrength}
      />
      <Text
        className='mt-2.5 text-xl font-bold'
        style={{ color: colors.text.primary }}
      >
        {current.label}
      </Text>
      {journey.next ? (
        <Text
          className='mt-1 text-xs'
          style={{ color: colors.text.secondary }}
        >
          {journey.pctToNext}% to {journey.next.label}
        </Text>
      ) : null}
    </View>
  );
});
