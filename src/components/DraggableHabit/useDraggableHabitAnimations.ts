/**
 * useDraggableHabitAnimations — Main orchestrator for card-level animated values.
 *
 * Creates animated refs and delegates to sub-hooks:
 * - {@link useEntranceAnimation} — fade + slide on mount (legacy Animated)
 * - {@link useHighlightAnimation} — glow border for just-created cards (reanimated glow + legacy cardScale)
 * - {@link useIconPulse} — breathing icon for perfect weeks (reanimated)
 * - {@link useNewRecordAnimation} — badge + haptics for new streak records (legacy Animated)
 *
 * Returns the animated values and `showNewRecord` state for the card renderer.
 */

import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useEntranceAnimation } from './useEntranceAnimation';
import { useHighlightAnimation } from './useHighlightAnimation';
import { useIconPulse } from './useIconPulse';
import { useNewRecordAnimation } from './useNewRecordAnimation';

interface AnimationParams {
  isJustCreated: boolean;
  reduceMotionPreference: boolean;
  isWeekComplete: boolean;
  isNewPersonalRecord: boolean;
  triggerSuccess: () => void;
}

export function useDraggableHabitAnimations({
  isJustCreated,
  reduceMotionPreference,
  isWeekComplete,
  isNewPersonalRecord,
  triggerSuccess,
}: AnimationParams) {
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const archiveFlash = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const newRecordScale = useRef(new Animated.Value(0)).current;

  // Reanimated shared values (migrated from legacy Animated)
  const iconPulse = useSharedValue(1);
  const highlightGlow = useSharedValue(0);

  const newRecordOpacity = useRef(new Animated.Value(0)).current;
  const [showNewRecord, setShowNewRecord] = useState(false);

  useEntranceAnimation(fade, translateY);
  useHighlightAnimation(
    isJustCreated,
    reduceMotionPreference,
    cardScale,
    highlightGlow
  );
  useIconPulse(isWeekComplete, reduceMotionPreference, iconPulse);
  useNewRecordAnimation(
    isNewPersonalRecord,
    reduceMotionPreference,
    triggerSuccess,
    newRecordScale,
    newRecordOpacity,
    cardScale,
    setShowNewRecord
  );

  return {
    archiveFlash,
    cardScale,
    fade,
    highlightGlow,
    iconPulse,
    newRecordOpacity,
    newRecordScale,
    showNewRecord,
    translateY,
  };
}
