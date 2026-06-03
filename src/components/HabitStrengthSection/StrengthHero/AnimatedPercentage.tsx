/**
 * AnimatedPercentage Component
 *
 * Displays a counting percentage animation using Reanimated.
 */

import React, { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { runOnJS, useDerivedValue } from 'react-native-reanimated';

import { RING_CENTER_TEXT_WIDTH } from '../constants';
import type { AnimatedPercentageProps } from './types';
import { getPercentageFontSize } from './percentageFontSize';

/**
 * Animated text component that displays a counting percentage.
 */
export function AnimatedPercentage({ animatedValue }: AnimatedPercentageProps) {
  const { colors: themeColors } = useThemeColors();
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

  const fontSize = useMemo(
    () => getPercentageFontSize(displayValue),
    [displayValue]
  );

  return (
    <Text
      adjustsFontSizeToFit
      className='font-extrabold'
      numberOfLines={1}
      style={{
        color: themeColors.text.primary,
        fontSize,
        includeFontPadding: false,
        letterSpacing: -0.5,
        lineHeight: fontSize + 2,
        minimumFontScale: 0.65,
        textAlign: 'center',
        width: RING_CENTER_TEXT_WIDTH,
      }}
    >{`${displayValue}%`}</Text>
  );
}
