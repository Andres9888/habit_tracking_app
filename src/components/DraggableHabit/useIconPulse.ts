/**
 * useIconPulse Hook
 * Handles pulsing animation when week is complete
 */

import { useEffect } from 'react';
import { Animated } from 'react-native';
import { runIconPulseLoop } from './animationSequences';

export function useIconPulse(
  isWeekComplete: boolean,
  reduceMotionPreference: boolean,
  iconPulse: Animated.Value
) {
  useEffect(() => {
    if (isWeekComplete && !reduceMotionPreference) {
      runIconPulseLoop(iconPulse);
    } else {
      iconPulse.setValue(1);
    }
  }, [isWeekComplete, iconPulse, reduceMotionPreference]);
}
