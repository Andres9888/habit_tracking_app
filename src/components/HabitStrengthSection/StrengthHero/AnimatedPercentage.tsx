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
    // Use Math.trunc to ensure integer (avoids Reanimated precision errors)
    const rounded = Math.trunc(animatedValue.value + 0.5);
    runOnJS(setDisplayValue)(rounded);
    return rounded;
  });

  return (
    <Text className='text-2xl font-bold text-stone-900'>{displayValue}%</Text>
  );
}
