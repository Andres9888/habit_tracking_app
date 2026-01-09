import { Animated, Easing } from 'react-native';

export function runHighlightAnimation(
  cardScale: Animated.Value,
  highlightGlow: Animated.Value
) {
  Animated.parallel([
    Animated.sequence([
      Animated.spring(cardScale, {
        damping: 12,
        stiffness: 200,
        toValue: 1.04,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        damping: 15,
        stiffness: 250,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]),
    Animated.sequence([
      Animated.timing(highlightGlow, {
        duration: 300,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(highlightGlow, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        toValue: 0.5,
        useNativeDriver: true,
      }),
      Animated.timing(highlightGlow, {
        duration: 300,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(highlightGlow, {
        duration: 500,
        easing: Easing.in(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
}

export function runIconPulseLoop(iconPulse: Animated.Value) {
  Animated.loop(
    Animated.sequence([
      Animated.timing(iconPulse, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        toValue: 1.05,
        useNativeDriver: true,
      }),
      Animated.timing(iconPulse, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
    ])
  ).start();
}

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
