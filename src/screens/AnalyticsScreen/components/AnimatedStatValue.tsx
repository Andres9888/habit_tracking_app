/**
 * AnimatedStatValue - Animated counting number for stat cards
 * Counts up from 0 to the target value on mount for a premium feel.
 */
import React, { useEffect } from 'react';
import { Text, type TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(
  // We use TextInput trick for animated text on Android/iOS
  require('react-native').TextInput,
);

interface AnimatedStatValueProps {
  value: string | number;
  style: TextStyle;
  delay?: number;
}

/**
 * If value is a number or numeric string (with optional % suffix),
 * animate it counting up. Otherwise render static text.
 */
export const AnimatedStatValue: React.FC<AnimatedStatValueProps> = ({
  value,
  style,
  delay = 0,
}) => {
  const stringValue = String(value);

  // Check if it's a countable number (e.g. "42", "85%", "3")
  const match = stringValue.match(/^(\d+)(%?)$/);

  if (!match) {
    // Non-numeric value (e.g. habit name) — just render static
    return <Text style={style}>{stringValue}</Text>;
  }

  const targetNumber = parseInt(match[1], 10);
  const suffix = match[2] || '';

  return (
    <CountingValue
      delay={delay}
      style={style}
      suffix={suffix}
      target={targetNumber}
    />
  );
};

interface CountingValueProps {
  target: number;
  suffix: string;
  style: TextStyle;
  delay: number;
}

const CountingValue: React.FC<CountingValueProps> = ({
  target,
  suffix,
  style,
  delay,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      progress.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay, progress]);

  const animatedProps = useAnimatedProps(() => {
    const current = Math.round(progress.value * target);
    return {
      text: `${current}${suffix}`,
      defaultValue: `${current}${suffix}`,
    } as Record<string, string>;
  });

  return (
    <AnimatedTextInput
      animatedProps={animatedProps}
      editable={false}
      style={[style, { padding: 0, margin: 0 }]}
      underlineColorAndroid="transparent"
      value={`0${suffix}`}
    />
  );
};
