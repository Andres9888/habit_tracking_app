/**
 * @module recordAnimations
 *
 * RN Animated sequences for new personal record celebrations.
 *
 * - {@link runNewRecordAnimation} — shows the "New Personal Record! 🎉" badge
 *   with a spring scale-in + card bounce.
 * - {@link hideNewRecordBadge} — fades/shrinks the badge and cleans up state.
 *
 * Triggered by {@link useNewRecordAnimation} when `streak > bestStreak`.
 */

import { Animated } from 'react-native';

/**
 * Spring the record badge into view (scale 0→1, opacity 0→1)
 * while giving the card a subtle bounce (scale 1→1.03→1).
 */
export function runNewRecordAnimation(
  newRecordScale: Animated.Value,
  newRecordOpacity: Animated.Value,
  cardScale: Animated.Value
) {
  Animated.parallel([
    Animated.spring(newRecordScale, {
      friction: 5,
      tension: 200,
      toValue: 1,
      useNativeDriver: true,
    }),
    Animated.timing(newRecordOpacity, {
      duration: 200,
      toValue: 1,
      useNativeDriver: true,
    }),
    Animated.sequence([
      Animated.spring(cardScale, {
        friction: 8,
        tension: 200,
        toValue: 1.03,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        friction: 10,
        tension: 200,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
}

/** Fade and shrink the record badge, then call setShowNewRecord(false) to unmount it. */
export function hideNewRecordBadge(
  newRecordScale: Animated.Value,
  newRecordOpacity: Animated.Value,
  setShowNewRecord: (show: boolean) => void
) {
  Animated.parallel([
    Animated.timing(newRecordScale, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }),
    Animated.timing(newRecordOpacity, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }),
  ]).start(() => setShowNewRecord(false));
}
