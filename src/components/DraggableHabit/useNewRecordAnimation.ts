/**
 * useNewRecordAnimation Hook
 * Handles animation and badge display for new personal records
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import {
  runNewRecordAnimation,
  hideNewRecordBadge,
} from './animationSequences';

export function useNewRecordAnimation(
  isNewPersonalRecord: boolean,
  reduceMotionPreference: boolean,
  triggerSuccess: () => void,
  newRecordScale: SharedValue<number>,
  newRecordOpacity: SharedValue<number>,
  cardScale: SharedValue<number>,
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
