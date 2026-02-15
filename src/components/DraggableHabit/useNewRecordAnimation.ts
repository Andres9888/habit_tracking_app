/**
 * useNewRecordAnimation Hook
 * Handles animation and badge display for new personal records
 */

import { Animated } from 'react-native';
import { useEffect } from 'react';

import {
  runNewRecordAnimation,
  hideNewRecordBadge,
} from './animationSequences';

export function useNewRecordAnimation(
  isNewPersonalRecord: boolean,
  reduceMotionPreference: boolean,
  triggerSuccess: () => void,
  newRecordScale: Animated.Value,
  newRecordOpacity: Animated.Value,
  cardScale: Animated.Value,
  setShowNewRecord: (show: boolean) => void
) {
  useEffect(() => {
    if (!isNewPersonalRecord || reduceMotionPreference) return;
    setShowNewRecord(true);
    triggerSuccess();
    runNewRecordAnimation(newRecordScale, newRecordOpacity, cardScale);
    const timeout = setTimeout(() => {
      hideNewRecordBadge(newRecordScale, newRecordOpacity, setShowNewRecord);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isNewPersonalRecord, reduceMotionPreference, triggerSuccess]);
}
