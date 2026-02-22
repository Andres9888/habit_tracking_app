/**
 * InlineHint Animation Hook
 *
 * Provides:
 * - 0.97x spring-animated press scale for both CTAs
 * - Staggered entrance animation (~100ms gap between CTAs)
 * - Haptic feedback on press (tap for templates, selection for build)
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import {
  animateCardPress,
  CARD_PRESS_SCALE,
  CARD_REST_SCALE,
} from '../../../../utils/animations/cardPressAnimation';
import { useHaptics } from '../../../../utils/haptics';
import { INLINE_HINT_STAGGER_MS, SPRING_CONFIGS } from './animations';

const ENTRANCE_TRANSLATE_Y = 12;

export function usePressAnimations() {
  const reduceMotion = useReducedMotion();
  const { trigger } = useHaptics();
  const templatesScale = useSharedValue(CARD_REST_SCALE);
  const buildMyOwnScale = useSharedValue(CARD_REST_SCALE);

  const templatesEntranceY = useSharedValue(
    reduceMotion ? 0 : ENTRANCE_TRANSLATE_Y
  );
  const buildMyOwnEntranceY = useSharedValue(
    reduceMotion ? 0 : ENTRANCE_TRANSLATE_Y
  );

  useEffect(() => {
    if (reduceMotion) return;

    templatesEntranceY.value = withSpring(0, SPRING_CONFIGS.entrance);
    buildMyOwnEntranceY.value = withDelay(
      INLINE_HINT_STAGGER_MS,
      withSpring(0, SPRING_CONFIGS.entrance)
    );
  }, [buildMyOwnEntranceY, reduceMotion, templatesEntranceY]);

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
    transform: [
      { translateY: templatesEntranceY.value },
      { scale: templatesScale.value },
    ],
  }));

  const buildMyOwnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: buildMyOwnEntranceY.value },
      { scale: buildMyOwnScale.value },
    ],
  }));

  return {
    buildMyOwnAnimatedStyle,
    buildMyOwnPressIn: () => {
      handlePressIn(buildMyOwnScale);
      trigger('selection');
    },
    buildMyOwnPressOut: () => handlePressOut(buildMyOwnScale),
    templatesAnimatedStyle,
    templatesPressIn: () => {
      handlePressIn(templatesScale);
      trigger('tap');
    },
    templatesPressOut: () => handlePressOut(templatesScale),
  };
}
