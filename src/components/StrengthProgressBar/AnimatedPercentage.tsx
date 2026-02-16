/**
 * AnimatedPercentage - Counting animation for the strength percentage text
 * Smoothly counts up/down in sync with the progress bar animation.
 */

import React, { useState } from 'react';
import { Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { runOnJS, useDerivedValue } from 'react-native-reanimated';

import { styles } from './StrengthProgressBar.styles';

interface AnimatedPercentageProps {
  animatedValue: SharedValue<number>;
  color: string;
  fontSize: number;
}

export function AnimatedPercentage({
  animatedValue,
  color,
  fontSize,
}: AnimatedPercentageProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useDerivedValue(() => {
    'worklet';
    const rawValue = animatedValue.value;
    const value =
      typeof rawValue === 'number' && !Number.isNaN(rawValue) ? rawValue : 0;
    const rounded = Math.trunc(value + 0.5);
    runOnJS(setDisplayValue)(rounded);
    return rounded;
  }, [animatedValue]);

  return (
    <Text style={[styles.percentage, { color, fontSize }]}>
      {displayValue}%
    </Text>
  );
}
