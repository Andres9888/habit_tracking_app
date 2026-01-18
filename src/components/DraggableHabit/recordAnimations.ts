/**
 * Record Animation Sequences
 * Animations for new personal record celebrations
 */

import { Animated } from 'react-native';

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
