/**
 * Success state animation logic for FullsizeTemplatePreview
 */

import { useEffect, useCallback, useRef } from 'react';
import {
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { triggerHaptic } from '@/utils/haptics';
import { springs } from '@/theme/animations';

interface UseSuccessAnimationsProps {
  isImported: boolean;
  reducedMotion: boolean;
}

export const useSuccessAnimations = ({
  isImported,
  reducedMotion,
}: UseSuccessAnimationsProps) => {
  const confettiRef = useRef<ConfettiCannon>(null);
  const successGlow = useSharedValue(0);
  const successGlowScale = useSharedValue(1);
  const checkmarkScale = useSharedValue(0);
  const checkmarkRotation = useSharedValue(-30);
  const successButtonGlow = useSharedValue(0);
  const successIconBounce = useSharedValue(0);

  const triggerSuccessHaptic = useCallback(() => {
    triggerHaptic('success');
  }, []);

  const triggerConfetti = useCallback(() => {
    if (confettiRef.current && !reducedMotion) confettiRef.current.start();
  }, [reducedMotion]);

  useEffect(() => {
    if (isImported) {
      if (reducedMotion) {
        checkmarkScale.value = 1;
        checkmarkRotation.value = 0;
        successGlow.value = 0.4;
        successGlowScale.value = 1;
        successButtonGlow.value = 0;
        successIconBounce.value = 0;
      } else {
        triggerSuccessHaptic();
        triggerConfetti();
        successGlow.value = withSequence(
          withTiming(0.5, { duration: 150, easing: Easing.out(Easing.ease) }),
          withTiming(0.2, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) })
        );
        successGlowScale.value = withSequence(
          withTiming(1.3, { duration: 200, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
        );
        checkmarkScale.value = withDelay(
          100,
          withSpring(1, springs.bouncy)
        );
        checkmarkRotation.value = withDelay(
          100,
          withSpring(0, springs.standard)
        );
        successButtonGlow.value = withDelay(
          200,
          withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0.3, { duration: 300 }),
            withTiming(0.8, { duration: 200 }),
            withTiming(0.4, { duration: 400 })
          )
        );
        successIconBounce.value = withDelay(
          300,
          withSequence(
            withSpring(-3, springs.pop),
            withSpring(0, springs.celebration)
          )
        );
      }
    } else {
      checkmarkScale.value = 0;
      checkmarkRotation.value = -30;
      successGlow.value = 0;
      successGlowScale.value = 1;
      successButtonGlow.value = 0;
      successIconBounce.value = 0;
    }
  }, [isImported, reducedMotion, triggerSuccessHaptic, triggerConfetti]);

  return {
    checkmarkRotation,
    checkmarkScale,
    confettiRef,
    successButtonGlow,
    successGlow,
    successGlowScale,
    successIconBounce,
  };
};
