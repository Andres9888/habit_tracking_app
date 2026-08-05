import { useEffect, useRef } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { createHabitMotion } from '../createHabitMotion';

interface HabitNamePlaceholderOverlayProps {
  text: string;
  hintColor: string;
  visible: boolean;
}

/** Fades placeholder out when typing — paced with modal enter + app motion tokens. */
export function HabitNamePlaceholderOverlay({
  text,
  hintColor,
  visible,
}: HabitNamePlaceholderOverlayProps) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(0);
  const hasRevealedText = useRef(false);

  useEffect(() => {
    if (!text) {
      hasRevealedText.current = false;
      progress.value = 0;
      return;
    }

    const target = visible ? 1 : 0;
    if (reduceMotion) {
      progress.value = target;
      return;
    }

    const config = visible
      ? createHabitMotion.placeholderFadeIn
      : createHabitMotion.placeholderFadeOut;
    const isFirstReveal = visible && !hasRevealedText.current;

    if (isFirstReveal) {
      hasRevealedText.current = true;
      progress.value = withDelay(
        createHabitMotion.placeholderRevealDelayMs,
        withTiming(1, createHabitMotion.placeholderFadeIn)
      );
      return;
    }

    progress.value = withTiming(target, config);
  }, [progress, reduceMotion, text, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -4 }],
  }));

  if (!text) return null;

  return (
    <Animated.Text
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      ellipsizeMode='tail'
      numberOfLines={1}
      pointerEvents='none'
      className='absolute inset-0 px-5 py-4 text-center text-2xl font-semibold'
      style={[animatedStyle, { color: hintColor, lineHeight: 28 }]}
    >
      {text}
    </Animated.Text>
  );
}
