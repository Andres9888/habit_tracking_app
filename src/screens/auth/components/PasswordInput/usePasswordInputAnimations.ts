import { useCallback, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function usePasswordInputAnimations() {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    borderColor.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    shadowOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [borderColor, shadowOpacity]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    borderColor.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    shadowOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [borderColor, shadowOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value === 1 ? '#1c1917' : '#e7e5e4',
    elevation: shadowOpacity.value * 2,
    shadowColor: '#1c1917',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: shadowOpacity.value * 0.1,
    shadowRadius: 4,
  }));

  return {
    animatedStyle,
    handleBlur,
    handleFocus,
    isFocused,
  };
}
