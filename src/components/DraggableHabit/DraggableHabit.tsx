/**
 * @module DraggableHabit
 *
 * Top-level habit card component used in the main habits list.
 *
 * ## Architecture
 *
 * ```
 * DraggableHabit (this file)       — orchestrator, no UI of its own
 *   ├─ useDraggableHabitState      — derives colors, emoji, streak records
 *   ├─ useHabitCardEntrance        — width-expansion entrance animation
 *   ├─ useDraggableHabitAnimations — fade, scale, glow, record badge
 *   ├─ useStrengthAnimation        — progress bar + emoji Reanimated styles
 *   ├─ useCardStrengthFill         — watercolor fill width animation
 *   └─ usePressHandlers            — pressIn/Out scale, long-press, swipe-archive
 *       ↓ all results spread into ↓
 *   DraggableHabitCard             — pure renderer (Pressable → Animated views)
 *     ├─ CardHeader                — icon, title, phase tag, best-streak label
 *     ├─ StrengthProgressBar       — animated bar + counting percentage
 *     ├─ HabitChainVisualizer      — 7-day dot chain (external component)
 *     └─ WeekCompleteIndicator     — "✨ Perfect Week ✨" badge
 * ```
 *
 * ## Drag-to-reorder
 *
 * Reordering is NOT handled here — the parent FlatList (via react-native-draggable-flatlist)
 * wraps each DraggableHabit and manages drag gestures. This component's role is limited to:
 * - Triggering haptic feedback on `onLongPress` (drag initiation)
 * - Applying `cardScale` spring animation on press-in / press-out
 *
 * ## Memo boundary
 *
 * The export is wrapped in `React.memo` so the FlatList can skip re-renders
 * when a sibling card's props change but this card's haven't.
 */

import React, { memo, useState } from 'react';
import { useHabitCardEntrance } from '../HabitCard/useHabitCardEntrance';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useDraggableHabitAnimations } from './useDraggableHabitAnimations';
import { useStrengthAnimation } from './useStrengthAnimation';
import { usePressHandlers } from './usePressHandlers';
import { useDraggableHabitState } from './useDraggableHabitState';
import { useCardStrengthFill } from './useCardStrengthFill';
import { DraggableHabitCard } from './DraggableHabitCard';
import { ConfirmActionModal } from '../ConfirmActionModal';
import type { DraggableHabitProps } from './types';

function DraggableHabit(props: DraggableHabitProps) {
  const {
    celebrationsEnabled,
    completionIcon = 'chain',
    dayShape = 'square',
    entranceDelay = 0,
    entranceVariant = 'widthExpansion',
    habit,
    highContrastMode = false,
    isConnectedToNextWeek = false,
    isConnectedToPreviousWeek = false,
    isJustCreated = false,
    onArchive,
    onEntranceComplete,
    onLongPress,
    onPress,
    onWeekComplete,
    previousStreak,
    reduceMotionPreference,
    showConnectors = true,
    showHabitStrengthPercentage = false,
    streak,
    toggleHabit,
    triggerEntrance = true,
    weekDateStrings,
    weekStatus,
  } = props;

  // 1. Derive visual state (colors, emoji, record detection)
  const state = useDraggableHabitState({
    habit,
    highContrastMode,
    previousStreak,
    streak,
    weekStatus,
  });

  // 2. Entrance animation (width expansion / fade)
  const entrance = useHabitCardEntrance({
    autoTrigger: triggerEntrance,
    delay: entranceDelay,
    onAnimationComplete: onEntranceComplete,
    variant: entranceVariant,
  });

  // 3. Haptics (selection tick, success burst, heavy impact for drag)
  const { triggerSelection, triggerSuccess, triggerHeavyImpact } =
    useHapticFeedback({
      isEnabled: celebrationsEnabled,
      preference: reduceMotionPreference,
    });

  // 4. Card animations (fade, scale, glow, new-record badge)
  const animations = useDraggableHabitAnimations({
    isJustCreated,
    isNewPersonalRecord: state.isNewPersonalRecord,
    isWeekComplete: state.isWeekComplete,
    reduceMotionPreference,
    triggerSuccess,
  });

  // 5. Strength progress bar + emoji Reanimated styles
  const { progressAnimatedStyle, strengthEmojiAnimatedStyle } =
    useStrengthAnimation(state.strengthPercent, reduceMotionPreference);

  // 6. Watercolor fill background width
  const { isDark, showGradientFill, strengthFillStyle } = useCardStrengthFill(
    state.strengthPercent,
    reduceMotionPreference
  );

  // 7. Confirmation modal state
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  // 8. Press / long-press / swipe handlers
  const pressHandlers = usePressHandlers({
    archiveFlash: animations.archiveFlash,
    cardScale: animations.cardScale,
    habit,
    onArchive: onArchive
      ? () => setShowArchiveConfirm(true)
      : undefined,
    onLongPress,
    triggerSelection,
    triggerHeavyImpact,
  });

  const handleConfirmArchive = () => {
    setShowArchiveConfirm(false);
    onArchive?.(habit._id);
  };

  return (
    <>
      <DraggableHabitCard
      {...state}
      {...animations}
      {...pressHandlers}
      celebrationsEnabled={celebrationsEnabled}
      completionIcon={completionIcon}
      dayShape={dayShape}
      entranceAccentStyle={entrance.accentStyle}
      entranceCardStyle={entrance.cardStyle}
      entranceContentStyle={entrance.contentStyle}
      habit={habit}
      highContrastMode={highContrastMode}
      isConnectedToNextWeek={isConnectedToNextWeek}
      isConnectedToPreviousWeek={isConnectedToPreviousWeek}
      isDark={isDark}
      progressAnimatedStyle={progressAnimatedStyle}
      reduceMotionPreference={reduceMotionPreference}
      showConnectors={showConnectors}
      showGradientFill={showGradientFill}
      showHabitStrengthPercentage={showHabitStrengthPercentage}
      streak={streak}
      strengthEmojiAnimatedStyle={strengthEmojiAnimatedStyle}
      strengthFillStyle={strengthFillStyle}
      toggleHabit={toggleHabit}
      weekDateStrings={weekDateStrings}
      weekStatus={weekStatus}
      onArchive={onArchive}
      onPress={onPress}
      onWeekComplete={onWeekComplete}
    />
      {onArchive && (
        <ConfirmActionModal
          actionType="archive"
          habitName={habit.name}
          visible={showArchiveConfirm}
          onCancel={() => setShowArchiveConfirm(false)}
          onConfirm={handleConfirmArchive}
        />
      )}
    </>
  );
}

export default memo(DraggableHabit);
