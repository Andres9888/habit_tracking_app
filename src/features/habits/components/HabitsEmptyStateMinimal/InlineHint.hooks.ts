/**
 * InlineHint Press Animation Hook
 *
 * Provides 0.97x spring-animated press scale for both CTAs,
 * reusing the design system's cardPressAnimation utilities.
 */

import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';

import {
  animateCardPress,
  CARD_PRESS_SCALE,
  CARD_REST_SCALE,
} from '../../../../utils/animations/cardPressAnimation';

export function usePressAnimations() {
  const reduceMotion = useReducedMotion();
  const templatesScale = useSharedValue(CARD_REST_SCALE);
  const buildMyOwnScale = useSharedValue(CARD_REST_SCALE);

  const handlePressIn = (scale: { value: number }) => {
    if (reduceMotion) {
      scale.value = CARD_PRESS_SCALE;
    } else {
      animateCardPress(scale, true);
    }
  };

  const handlePressOut = (scale: { value: number }) => {
    if (reduceMotion) {
      scale.value = CARD_REST_SCALE;
    } else {
      animateCardPress(scale, false);
    }
  };

  const templatesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templatesScale.value }],
  }));

  const buildMyOwnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buildMyOwnScale.value }],
  }));

  return {
    buildMyOwnAnimatedStyle,
    buildMyOwnPressIn: () => handlePressIn(buildMyOwnScale),
    buildMyOwnPressOut: () => handlePressOut(buildMyOwnScale),
    templatesAnimatedStyle,
    templatesPressIn: () => handlePressIn(templatesScale),
    templatesPressOut: () => handlePressOut(templatesScale),
  };
}
