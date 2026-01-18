/**
 * AnimatedPercentageText Component
 *
 * Displays a strength percentage with counting animation.
 * Used in HeroStrengthSection to show the current strength value.
 */

import React from 'react';
import { Text } from 'react-native';
import { useDerivedValue, runOnJS, SharedValue } from 'react-native-reanimated';

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
    const [displayText, setDisplayText] = React.useState('0%');

    useDerivedValue(() => {
      const formatted = `${Math.round(animatedValue.value)}%`;
      runOnJS(setDisplayText)(formatted);
      return formatted;
    });

    return (
      <Text
        accessibilityElementsHidden
        className='text-xl font-bold text-stone-900'
      >
        {displayText}
      </Text>
    );
  }
);

export default AnimatedPercentageText;
