/**
 * AnimatedPercentage Component
 *
 * Displays a counting percentage animation using Reanimated.
 */

import React, { useState } from 'react';
import { Text } from 'react-native';

import { runOnJS, useDerivedValue } from 'react-native-reanimated';

import type { AnimatedPercentageProps } from './types';

/**
 * Animated text component that displays a counting percentage.
 */
export function AnimatedPercentage({ animatedValue }: AnimatedPercentageProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useDerivedValue(() => {
    'worklet';
    // Use Math.trunc to ensure integer (avoids Reanimated precision errors)
    // Guard against NaN/undefined - default to 0
    const rawValue = animatedValue.value;
    const value = typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue : 0;
    const rounded = Math.trunc(value + 0.5);
    runOnJS(setDisplayValue)(rounded);
    return rounded;
  }, [animatedValue]);

  return (
    <Text className='text-2xl font-bold text-stone-900'>{displayValue}%</Text>
  );
}
