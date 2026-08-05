/**
 * AnimatedPercentageText Component
 *
 * Displays a strength percentage with counting animation.
 * Used in HeroStrengthSection to show the current strength value.
 */

import React from 'react';
import { Text } from 'react-native';
import { useDerivedValue, runOnJS, SharedValue } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

interface AnimatedPercentageTextProps {
  animatedValue: SharedValue<number>;
}

/**
 * AnimatedPercentageText - Displays the strength percentage with counting animation
 * Memoized since animatedValue is a stable SharedValue reference
 */
export const AnimatedPercentageText = React.memo(
  function AnimatedPercentageText({
    animatedValue,
  }: AnimatedPercentageTextProps) {
    const { colors } = useThemeColors();
    const [displayText, setDisplayText] = React.useState('0%');

    useDerivedValue(() => {
      'worklet';
      const rawValue = animatedValue.value;
      const safeValue = typeof rawValue === 'number' && !Number.isNaN(rawValue) ? rawValue : 0;
      const formatted = `${Math.round(safeValue)}%`;
      runOnJS(setDisplayText)(formatted);
      return formatted;
    }, [animatedValue]);

    return (
      <Text
        accessibilityElementsHidden
        className='text-xl font-bold'
        style={{ color: colors.text.primary }}
      >
        {displayText}
      </Text>
    );
  }
);

export default AnimatedPercentageText;
