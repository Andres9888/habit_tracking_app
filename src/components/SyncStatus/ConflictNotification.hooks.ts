/**
 * ConflictNotification - Hooks
 */

import { useEffect, useState, useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { SharedValue } from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '@/theme/animations';
import type { UseConflictNotificationResult } from './ConflictNotification.types';

// Enter and exit fades share the enter duration by design; the auto-dismiss
// delay is component-specific and not a shared motion token.
const ANIMATION_DURATION = durations.enter;
const AUTO_DISMISS_DURATION = 4000;

interface UseConflictAnimationProps {
  visible: boolean;
  onDismiss?: () => void;
}

function animateIn(
  opacity: SharedValue<number>,
  translateY: SharedValue<number>
) {
  // Fade in
  opacity.value = withTiming(1, {
    duration: ANIMATION_DURATION,
    easing: enterEasing,
  });
  translateY.value = withTiming(0, {
    duration: ANIMATION_DURATION,
    easing: enterEasing,
  });
}

function animateAutoDismiss(
  opacity: SharedValue<number>,
  translateY: SharedValue<number>,
  onDismiss: () => void
) {
  opacity.value = withDelay(
    AUTO_DISMISS_DURATION,
    withTiming(
      0,
      {
        duration: ANIMATION_DURATION,
        easing: exitEasing,
      },
      (finished) => {
        if (finished) {
          scheduleOnRN(onDismiss);
        }
      }
    )
  );
  translateY.value = withDelay(
    AUTO_DISMISS_DURATION,
    withTiming(-20, {
      duration: ANIMATION_DURATION,
      easing: exitEasing,
    })
  );
}

export function useConflictAnimation({
  visible,
  onDismiss,
}: UseConflictAnimationProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      animateIn(opacity, translateY);
      if (onDismiss) {
        animateAutoDismiss(opacity, translateY, onDismiss);
      }
    } else {
      opacity.value = 0;
      translateY.value = -20;
    }
  }, [visible, opacity, translateY, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}

/**
 * Hook to manage conflict notification state
 */
export function useConflictNotification(): UseConflictNotificationResult {
  const [visible, setVisible] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);

  const showConflict = useCallback((count: number) => {
    setConflictCount(count);
    setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    conflictCount,
    showConflict,
    dismiss,
  };
}
