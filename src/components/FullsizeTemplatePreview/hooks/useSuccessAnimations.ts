/**
 * Success state animation logic for FullsizeTemplatePreview
 *
 * Calm checkmark morph: the "Add" button crossfades to the "Added!" pill with
 * a single subtle spring on the pill and a gentle bounce on the checkmark.
 * No full-screen glow, no confetti — see plan file.
 */

import { useEffect, useCallback } from 'react';
import { useSharedValue, withSpring } from 'react-native-reanimated';
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
  const checkmarkScale = useSharedValue(0);
  const successPillScale = useSharedValue(0.95);

  const triggerSuccessHaptic = useCallback(() => {
    triggerHaptic('success');
  }, []);

  useEffect(() => {
    if (isImported) {
      if (reducedMotion) {
        checkmarkScale.value = 1;
        successPillScale.value = 1;
      } else {
        triggerSuccessHaptic();
        successPillScale.value = withSpring(1, springs.standard);
        checkmarkScale.value = withSpring(1, springs.bouncy);
      }
    } else {
      checkmarkScale.value = 0;
      successPillScale.value = 0.95;
    }
  }, [isImported, reducedMotion, triggerSuccessHaptic]);

  return {
    checkmarkScale,
    successPillScale,
  };
};
