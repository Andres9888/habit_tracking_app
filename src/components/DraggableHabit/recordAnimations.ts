/**
 * @module recordAnimations
 *
 * Reanimated sequences for new personal record celebrations.
 *
 * - {@link runNewRecordAnimation} — shows the "New Personal Record! 🎉" badge
 *   with a spring scale-in + card bounce.
 * - {@link hideNewRecordBadge} — fades/shrinks the badge and cleans up state.
 *
 * Triggered by {@link useNewRecordAnimation} when `streak > bestStreak`.
 */

import type { SharedValue } from 'react-native-reanimated';
import {
  runOnJS,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';

/**
 * Spring the record badge into view (scale 0→1, opacity 0→1)
 * while giving the card a subtle bounce (scale 1→1.03→1).
 */
export function runNewRecordAnimation(
  newRecordScale: SharedValue<number>,
  newRecordOpacity: SharedValue<number>,
  cardScale: SharedValue<number>
) {
  // Badge springs in with a celebratory bounce
  newRecordScale.value = withSpring(1, springs.celebration);

  // Quick opacity fade-in
  newRecordOpacity.value = withTiming(1, { duration: durations.standard });

  // Card does a subtle bounce: 1 → 1.03 → 1
  cardScale.value = withSequence(
    withSpring(1.03, springs.standard),
    withSpring(1, springs.standard)
  );
}

/** Fade and shrink the record badge, then call setShowNewRecord(false) to unmount it. */
export function hideNewRecordBadge(
  newRecordScale: SharedValue<number>,
  newRecordOpacity: SharedValue<number>,
  setShowNewRecord: (show: boolean) => void
) {
  newRecordScale.value = withTiming(0, { duration: durations.standard });
  newRecordOpacity.value = withTiming(
    0,
    { duration: durations.standard },
    (finished) => {
      if (finished) {
        runOnJS(setShowNewRecord)(false);
      }
    }
  );
}
