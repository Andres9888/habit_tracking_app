/**
 * Animation Sequences
 *
 * Pre-built animation sequences for the success modal
 */

import { Animated } from 'react-native';

import { ANIMATION_DURATIONS } from './constants';

export interface AnimatedValues {
  backdropOpacity: Animated.Value;
  buttonOpacity: Animated.Value;
  buttonTranslateY: Animated.Value;
  cardOpacity: Animated.Value;
  cardScale: Animated.Value;
  iconScale: Animated.Value;
  textOpacity: Animated.Value;
}

export function createEntranceSequence(values: AnimatedValues) {
  const {
    backdropOpacity,
    cardScale,
    cardOpacity,
    iconScale,
    textOpacity,
    buttonOpacity,
    buttonTranslateY,
  } = values;

  return Animated.sequence([
    Animated.timing(backdropOpacity, {
      duration: ANIMATION_DURATIONS.backdropFadeIn,
      toValue: 1,
      useNativeDriver: true,
    }),
    Animated.parallel([
      Animated.spring(cardScale, {
        damping: 10,
        stiffness: 200,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        duration: ANIMATION_DURATIONS.cardBounce,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]),
    Animated.spring(iconScale, {
      damping: 8,
      stiffness: 300,
      toValue: 1,
      useNativeDriver: true,
    }),
    Animated.timing(textOpacity, {
      duration: ANIMATION_DURATIONS.textFadeIn,
      toValue: 1,
      useNativeDriver: true,
    }),
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        duration: ANIMATION_DURATIONS.buttonSlideUp,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(buttonTranslateY, {
        damping: 15,
        stiffness: 200,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]),
  ]);
}

export function createExitSequence(
  values: Pick<AnimatedValues, 'backdropOpacity' | 'cardOpacity' | 'cardScale'>
) {
  const { backdropOpacity, cardOpacity, cardScale } = values;
  const duration = ANIMATION_DURATIONS.exitAnimation;

  return Animated.parallel([
    Animated.timing(cardScale, {
      duration,
      toValue: 0.9,
      useNativeDriver: true,
    }),
    Animated.timing(cardOpacity, {
      duration,
      toValue: 0,
      useNativeDriver: true,
    }),
    Animated.timing(backdropOpacity, {
      duration,
      toValue: 0,
      useNativeDriver: true,
    }),
  ]);
}
