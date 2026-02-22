import {
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
  Easing,
} from 'react-native-reanimated';
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
      isKeyboardVisible ? 0 : bottomInset + 20,
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
    fontSize: withTiming(
      isKeyboardVisible ? KEYBOARD_LAYOUT.compactHeadlineFontSize : 24,
      timingConfig
    ),
    marginBottom: withTiming(isKeyboardVisible ? 16 : 32, timingConfig),
    marginTop: withTiming(isKeyboardVisible ? 16 : 32, timingConfig),
  }));

  const chipsAnimatedStyle = useAnimatedStyle(() => ({
    marginBottom: withTiming(isKeyboardVisible ? 0 : 32, timingConfig),
    maxHeight: withTiming(isKeyboardVisible ? 0 : 200, timingConfig),
    opacity: withTiming(isKeyboardVisible ? 0 : 1, timingConfig),
    overflow: 'hidden' as const,
  }));

  const secondaryLinksAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: withTiming(
      isKeyboardVisible ? 0 : KEYBOARD_LAYOUT.secondaryLinksMaxHeight,
      timingConfig
    ),
    opacity: withTiming(isKeyboardVisible ? 0 : 1, timingConfig),
    overflow: 'hidden' as const,
  }));

  return {
    chipsAnimatedStyle,
    containerAnimatedStyle,
    headlineAnimatedStyle,
    heroAnimatedStyle,
    secondaryLinksAnimatedStyle,
  };
}
