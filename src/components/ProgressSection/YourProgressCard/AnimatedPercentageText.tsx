import React from 'react';
import { Text } from 'react-native';
import { useDerivedValue, runOnJS, SharedValue } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

interface AnimatedPercentageTextProps {
  animatedValue: SharedValue<number>;
}

/**
 * AnimatedPercentageText - Displays the strength percentage with counting animation
 */
export function AnimatedPercentageText({
  animatedValue,
}: AnimatedPercentageTextProps) {
  const { colors: themeColors } = useThemeColors();
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
      className='text-lg font-bold'
      style={{ color: themeColors.text.primary }}
    >
      {displayText}
    </Text>
  );
}
