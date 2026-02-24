import {
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { fontFamilies } from '@/theme/typography';
import { KEYBOARD_LAYOUT } from './animations';

interface UseKeyboardLayoutAnimationsParams {
  isKeyboardVisible: boolean;
  bottomInset: number;
}

export function useKeyboardLayoutAnimations({
  isKeyboardVisible,
  bottomInset,
}: UseKeyboardLayoutAnimationsParams) {
  const shouldReduceMotion = useReducedMotion();

  const timingConfig = {
    duration: shouldReduceMotion ? 0 : KEYBOARD_LAYOUT.transitionDuration,
    easing: Easing.out(Easing.ease),
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
    paddingBottom: withTiming(
      isKeyboardVisible ? 0 : bottomInset + 8,
      timingConfig
    ),
    paddingTop: withTiming(
      isKeyboardVisible ? KEYBOARD_LAYOUT.topPadding : 0,
      timingConfig
    ),
  }));

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(
          isKeyboardVisible ? KEYBOARD_LAYOUT.compactHeroSize / 80 : 1,
          timingConfig
        ),
      },
    ],
  }));

  const headlineAnimatedStyle = useAnimatedStyle(() => ({
    fontFamily: fontFamilies.primary.display,
    fontSize: withTiming(
      isKeyboardVisible ? KEYBOARD_LAYOUT.compactHeadlineFontSize : 24,
      timingConfig
    ),
    marginBottom: withTiming(isKeyboardVisible ? 16 : 20, timingConfig),
    marginTop: withTiming(isKeyboardVisible ? 16 : 20, timingConfig),
  }));

  const chipsAnimatedStyle = useAnimatedStyle(() => ({
    marginBottom: withTiming(isKeyboardVisible ? 0 : 16, timingConfig),
    maxHeight: withTiming(isKeyboardVisible ? 0 : 200, timingConfig),
    opacity: withTiming(isKeyboardVisible ? 0 : 1, timingConfig),
    overflow: 'hidden' as const,
  }));

  // NOTE: secondaryLinksAnimatedStyle avoids maxHeight because nested
  // Animated.Views (AnimatedEntrance + press animations inside InlineHint)
  // don't properly report intrinsic height to a maxHeight-constrained
  // parent. Uses opacity-only fade + display toggle in ActionSection.
  const secondaryLinksAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isKeyboardVisible ? 0 : 1, timingConfig),
  }));

  return {
    chipsAnimatedStyle,
    containerAnimatedStyle,
    headlineAnimatedStyle,
    heroAnimatedStyle,
    secondaryLinksAnimatedStyle,
  };
}
