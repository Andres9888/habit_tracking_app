/**
 * useDraggableHabitAnimations — Main orchestrator for card-level RN Animated values.
 *
 * Creates all `Animated.Value` refs and delegates to sub-hooks:
 * - {@link useEntranceAnimation} — fade + slide on mount
 * - {@link useHighlightAnimation} — glow border for just-created cards
 * - {@link useIconPulse} — breathing icon for perfect weeks
 * - {@link useNewRecordAnimation} — badge + haptics for new streak records
 *
 * Returns the animated values and `showNewRecord` state for the card renderer.
 */

import { useRef, useState } from 'react';
import { Animated } from 'react-native';
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
  const iconPulse = useRef(new Animated.Value(1)).current;
  const highlightGlow = useRef(new Animated.Value(0)).current;
  const newRecordScale = useRef(new Animated.Value(0)).current;
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
