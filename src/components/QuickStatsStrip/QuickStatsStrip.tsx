/**
 * QuickStatsStrip Component
 * Displays 3 key habit metrics: streak, strength, success rate
 * Features animated counting on load with staggered timing
 */

import React, { useEffect, useState } from 'react';
import { View, AccessibilityInfo } from 'react-native';
import { StatCard } from './StatCard';
import type { QuickStatsStripProps } from './types';

const STAGGER_DELAY = 100;

export function QuickStatsStrip({
  animationKey,
  currentStreak,
  habitStrength,
  onStatPress,
  successRate,
}: QuickStatsStripProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => subscription?.remove();
  }, []);

  return (
    <View
      accessible
      accessibilityLabel='Habit statistics'
      className='flex-row gap-2'
    >
      <StatCard
        accessibilityHint='Opens streak details'
        animationKey={animationKey}
        color='text-orange-500'
        delay={0}
        emoji='🔥'
        label='streak'
        reduceMotion={reduceMotion}
        targetValue={currentStreak}
        onPress={() => onStatPress?.('streak')}
      />
      <StatCard
        accessibilityHint='Opens habit strength details'
        animationKey={animationKey}
        color='text-violet-500'
        delay={STAGGER_DELAY}
        emoji='💪'
        label='strength'
        reduceMotion={reduceMotion}
        suffix='%'
        targetValue={Math.round(habitStrength * 100)}
        onPress={() => onStatPress?.('strength')}
      />
      <StatCard
        accessibilityHint='Opens success rate details'
        animationKey={animationKey}
        color='text-emerald-500'
        delay={STAGGER_DELAY * 2}
        emoji='✓'
        label='success'
        reduceMotion={reduceMotion}
        suffix='%'
        targetValue={Math.round(successRate)}
        onPress={() => onStatPress?.('success')}
      />
    </View>
  );
}

export default QuickStatsStrip;
