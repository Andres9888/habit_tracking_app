/**
 * Animation state hook for MilestoneCelebration
 */

import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { runAnimationSequence, resetAnimations } from './animationSequences';
import { triggerHaptic } from '@/utils/haptics';

interface UseAnimationsProps {
  visible: boolean;
  strength: number;
  reduceMotion: boolean;
}

export function useMilestoneAnimations({
  visible,
  strength,
  reduceMotion,
}: UseAnimationsProps) {
  const badgeScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const labelOpacity = useSharedValue(0);
  const percentageValue = useSharedValue(0);
  const shareButtonTranslateY = useSharedValue(50);
  const shareButtonOpacity = useSharedValue(0);
  const continueButtonOpacity = useSharedValue(0);

  const animations = {
    badgeScale,
    continueButtonOpacity,
    glowOpacity,
    labelOpacity,
    percentageValue,
    shareButtonOpacity,
    shareButtonTranslateY,
  };

  useEffect(() => {
    if (visible) {
      triggerHaptic('heavy');

      if (reduceMotion) {
        badgeScale.value = 1;
        glowOpacity.value = 0.5;
        labelOpacity.value = 1;
        percentageValue.value = strength;
        shareButtonTranslateY.value = 0;
        shareButtonOpacity.value = 1;
        continueButtonOpacity.value = 1;
      } else {
        runAnimationSequence(animations, strength);
      }
    } else {
      resetAnimations(animations);
    }
  }, [visible, strength, reduceMotion]);

  return animations;
}
