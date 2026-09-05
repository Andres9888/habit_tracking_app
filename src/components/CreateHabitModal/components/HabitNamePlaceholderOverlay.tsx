import { useEffect, useRef } from 'react';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { createHabitMotion } from '../createHabitMotion';
import { HABIT_NAME_FIELD_PADDING } from './HabitNameInputField';

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
  const reduceMotion = useReducedMotion();
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
      className='absolute inset-0'
      style={[
        animatedStyle,
        {
          color: hintColor,
          fontFamily: fontFamilies.primary.text,
          fontSize: 18,
          fontWeight: fontWeights.semibold,
          lineHeight: 24,
          // +2 keeps the hint clear of the native caret at the left padding.
          paddingLeft: HABIT_NAME_FIELD_PADDING.horizontal + 2,
          paddingRight: HABIT_NAME_FIELD_PADDING.horizontal,
          paddingVertical: HABIT_NAME_FIELD_PADDING.vertical,
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
}
