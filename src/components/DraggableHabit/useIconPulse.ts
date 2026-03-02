/**
 * useIconPulse Hook
 * Handles pulsing animation when week is complete (reanimated SharedValue).
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { cancelAnimation } from 'react-native-reanimated';
import { runIconPulseLoop } from './highlightAnimations';

export function useIconPulse(
  isWeekComplete: boolean,
  reduceMotionPreference: boolean,
  iconPulse: SharedValue<number>
) {
  useEffect(() => {
    if (isWeekComplete && !reduceMotionPreference) {
      runIconPulseLoop(iconPulse);
    } else {
      cancelAnimation(iconPulse);
      iconPulse.value = 1;
    }
  }, [isWeekComplete, iconPulse, reduceMotionPreference]);
}
