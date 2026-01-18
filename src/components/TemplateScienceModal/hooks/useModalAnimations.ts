/**
 * Animation hook for TemplateScienceModal entrance animations
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import {
  HERO_ANIMATION,
  CARD_ANIMATION,
  GLOW_ANIMATION,
} from './animationConstants';

interface UseModalAnimationsProps {
  visible: boolean;
  template: Doc<'templates'> | null;
}

const createGlowAnimation = (min: number, max: number) =>
  withRepeat(
    withSequence(
      withTiming(max, {
        duration: GLOW_ANIMATION.duration,
        easing: Easing.inOut(Easing.ease),
      }),
      withTiming(min, {
        duration: GLOW_ANIMATION.duration,
        easing: Easing.inOut(Easing.ease),
      })
    ),
    -1,
    false
  );

export const useModalAnimations = ({
  visible,
  template,
}: UseModalAnimationsProps) => {
  const heroOpacity = useSharedValue(0);
  const heroScale = useSharedValue(0.9);
  const iconGlowScale = useSharedValue(1);
  const iconGlowOpacity = useSharedValue(0.25);
  const card1Progress = useSharedValue(0);
  const card2Progress = useSharedValue(0);
  const card3Progress = useSharedValue(0);
  const footerProgress = useSharedValue(0);

  useEffect(() => {
    if (visible && template) {
      // Reset values
      heroOpacity.value = 0;
      heroScale.value = 0.9;
      card1Progress.value = 0;
      card2Progress.value = 0;
      card3Progress.value = 0;
      footerProgress.value = 0;

      // Hero animations
      heroOpacity.value = withTiming(1, {
        duration: HERO_ANIMATION.opacity.duration,
        easing: Easing.out(Easing.cubic),
      });
      heroScale.value = withSpring(1, HERO_ANIMATION.scale);

      // Card stagger animations
      const { spring, delays } = CARD_ANIMATION;
      card1Progress.value = withDelay(delays.card1, withSpring(1, spring));
      card2Progress.value = withDelay(delays.card2, withSpring(1, spring));
      card3Progress.value = withDelay(delays.card3, withSpring(1, spring));
      footerProgress.value = withDelay(delays.footer, withSpring(1, spring));

      // Glow pulse animations
      iconGlowScale.value = createGlowAnimation(
        GLOW_ANIMATION.scale.min,
        GLOW_ANIMATION.scale.max
      );
      iconGlowOpacity.value = createGlowAnimation(
        GLOW_ANIMATION.opacity.min,
        GLOW_ANIMATION.opacity.max
      );
    }
  }, [
    visible,
    template,
    heroOpacity,
    heroScale,
    card1Progress,
    card2Progress,
    card3Progress,
    footerProgress,
    iconGlowScale,
    iconGlowOpacity,
  ]);

  return {
    card1Progress,
    card2Progress,
    card3Progress,
    footerProgress,
    heroOpacity,
    heroScale,
    iconGlowOpacity,
    iconGlowScale,
  };
};
