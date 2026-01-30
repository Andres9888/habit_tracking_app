import React from 'react';
import { Text } from 'react-native';
import { useDerivedValue, runOnJS, SharedValue } from 'react-native-reanimated';

interface AnimatedPercentageTextProps {
  animatedValue: SharedValue<number>;
}

/**
 * AnimatedPercentageText - Displays the strength percentage with counting animation
 */
export function AnimatedPercentageText({
  animatedValue,
}: AnimatedPercentageTextProps) {
  const [displayText, setDisplayText] = React.useState('0%');

  useDerivedValue(() => {
    'worklet';
    const rawValue = animatedValue.value;
    const safeValue = typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue : 0;
    const formatted = `${Math.round(safeValue)}%`;
    runOnJS(setDisplayText)(formatted);
    return formatted;
  }, [animatedValue]);

  return (
    <Text
      accessibilityElementsHidden
      className='text-lg font-bold text-stone-900'
    >
      {displayText}
    </Text>
  );
}
