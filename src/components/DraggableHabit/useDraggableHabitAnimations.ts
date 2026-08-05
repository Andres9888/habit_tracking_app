/**
 * useDraggableHabitAnimations — Main orchestrator for card-level animated values.
 *
 * Creates shared values and delegates to sub-hooks:
 * - {@link useEntranceAnimation} — fade + slide on mount (reanimated)
 * - {@link useHighlightAnimation} — glow border for just-created cards (reanimated)
 * - {@link useIconPulse} — breathing icon for perfect weeks (reanimated)
 * - {@link useNewRecordAnimation} — badge + haptics for new streak records (reanimated)
 *
 * Returns the shared values and `showNewRecord` state for the card renderer.
 */

import { useState } from 'react';
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
  const fade = useSharedValue(0);
  const translateY = useSharedValue(12);
  const cardScale = useSharedValue(1);
  const newRecordScale = useSharedValue(0);
  const newRecordOpacity = useSharedValue(0);
  const iconPulse = useSharedValue(1);
  const highlightGlow = useSharedValue(0);
  const [showNewRecord, setShowNewRecord] = useState(false);

  useEntranceAnimation(fade, translateY, reduceMotionPreference);
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
