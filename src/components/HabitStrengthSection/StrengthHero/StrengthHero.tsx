/**
 * StrengthHero Component
 *
 * The centered hero for the Strength section:
 * - Large progress ring with the current level's emoji + animated percentage
 * - Level name (Starting / Building / Developing / Strong / Automatic)
 *
 * The "X% to <next level>" goal-gradient hint lives on the StrengthProgressBar
 * below, so the hero stays a clean, proud focal point.
 *
 * @example
 * ```tsx
 * <StrengthHero strength={68} journey={journey} />
 * ```
 */

import React from 'react';
import { Text, View } from 'react-native';

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
  const { current } = journey;
  const stageColor = current.color;

  const { animatedStrength, roundedStrength } =
    useStrengthHeroAnimations(strength);

  return (
    <View className='items-center'>
      <ProgressRing
        animatedStrength={animatedStrength}
        emoji={current.emoji}
        label={current.label}
        ringColor={stageColor}
        roundedStrength={roundedStrength}
      />
      <Text className='mt-2.5 text-xl font-bold' style={{ color: stageColor }}>
        {current.label}
      </Text>
    </View>
  );
});
