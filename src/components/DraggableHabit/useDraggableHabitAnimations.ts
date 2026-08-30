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
  holdHighlight?: boolean;
  isJustCreated: boolean;
  /** No entrance will play: mount at full opacity, no animated update. */
  mountVisible?: boolean;
  reduceMotionPreference: boolean;
  isWeekComplete: boolean;
  isNewPersonalRecord: boolean;
  triggerSuccess: () => void;
}

export function useDraggableHabitAnimations({
  holdHighlight = false,
  isJustCreated,
  mountVisible = false,
  reduceMotionPreference,
  isWeekComplete,
  isNewPersonalRecord,
  triggerSuccess,
}: AnimationParams) {
  const startVisible = mountVisible || reduceMotionPreference;
  const fade = useSharedValue(startVisible ? 1 : 0);
  const translateY = useSharedValue(startVisible ? 0 : 12);
  const cardScale = useSharedValue(1);
  const newRecordScale = useSharedValue(0);
  const newRecordOpacity = useSharedValue(0);
  const iconPulse = useSharedValue(1);
  const highlightGlow = useSharedValue(0);
  const [showNewRecord, setShowNewRecord] = useState(false);

  useEntranceAnimation(fade, translateY, reduceMotionPreference, mountVisible);
  useHighlightAnimation(
    isJustCreated,
    holdHighlight,
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
