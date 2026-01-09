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

interface UseModalAnimationsProps {
  visible: boolean;
  template: Doc<'templates'> | null;
}

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
      heroOpacity.value = 0;
      heroScale.value = 0.9;
      card1Progress.value = 0;
      card2Progress.value = 0;
      card3Progress.value = 0;
      footerProgress.value = 0;

      heroOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      heroScale.value = withSpring(1, { damping: 18, stiffness: 100 });
      card1Progress.value = withDelay(
        150,
        withSpring(1, { damping: 20, stiffness: 90 })
      );
      card2Progress.value = withDelay(
        250,
        withSpring(1, { damping: 20, stiffness: 90 })
      );
      card3Progress.value = withDelay(
        350,
        withSpring(1, { damping: 20, stiffness: 90 })
      );
      footerProgress.value = withDelay(
        450,
        withSpring(1, { damping: 20, stiffness: 90 })
      );

      iconGlowScale.value = withRepeat(
        withSequence(
          withTiming(1.15, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      iconGlowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.35, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
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
