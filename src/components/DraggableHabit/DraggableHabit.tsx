/* eslint-disable max-lines */
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

import React, { memo } from 'react';
import { DEFAULT_SETTINGS } from '../../../convex/settings/types';
import { useHabitCardEntrance } from '../HabitCard/useHabitCardEntrance';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useDraggableHabitAnimations } from './useDraggableHabitAnimations';
import { useStrengthAnimation } from './useStrengthAnimation';
import { usePressHandlers } from './usePressHandlers';
import { useDraggableHabitState } from './useDraggableHabitState';
import { useCardStrengthFill } from './useCardStrengthFill';
import { DraggableHabitCard } from './DraggableHabitCard';
import type { DraggableHabitProps } from './types';

function DraggableHabit(props: DraggableHabitProps) {
  const {
    celebrationsEnabled,
    completionIcon = DEFAULT_SETTINGS.habitCompletionIcon,
    dayShape = DEFAULT_SETTINGS.dayShape,
    entranceDelay = 0,
    entranceVariant = 'widthExpansion',
    habit,
    isCompactMode = false,
    isConnectedToNextWeek = false,
    isConnectedToPreviousWeek = false,
    isJustCreated = false,
    isPaused = false,
    isSelected,
    onArchive,
    onDelete,
    onEntranceComplete,
    onLongPress,
    onPause,
    onPress,
    onResume,
    onToggleSelection,
    onWeekComplete,
    previousStreak,
    showSelectionOverlay,
    reduceMotionPreference,
    showConnectors = true,
    showGradientFill = true,
    showHabitStrengthPercentage = false,
    streak,
    toggleHabit,
    triggerEntrance = true,
    userProgressEmojis,
    weekDateStrings,
    weekStatus,
  } = props;

  // 1. Derive visual state (colors, emoji, record detection)
  const state = useDraggableHabitState({
    habit,
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
  const { isDark, strengthFillStyle } = useCardStrengthFill(
    state.strengthPercent,
    reduceMotionPreference
  );

  // 7. Press / long-press handlers
  const pressHandlers = usePressHandlers({
    cardScale: animations.cardScale,
    habit,
    onLongPress,
    triggerSelection,
    triggerHeavyImpact,
  });

  return (
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
      isCompactMode={isCompactMode}
      isConnectedToNextWeek={isConnectedToNextWeek}
      isConnectedToPreviousWeek={isConnectedToPreviousWeek}
      isSelected={isSelected}
      onToggleSelection={onToggleSelection}
      showSelectionOverlay={showSelectionOverlay}
      isDark={isDark}
      isPaused={isPaused}
      progressAnimatedStyle={progressAnimatedStyle}
      reduceMotionPreference={reduceMotionPreference}
      showConnectors={showConnectors}
      showGradientFill={showGradientFill}
      showHabitStrengthPercentage={showHabitStrengthPercentage}
      streak={streak}
      strengthEmojiAnimatedStyle={strengthEmojiAnimatedStyle}
      strengthFillStyle={strengthFillStyle}
      toggleHabit={toggleHabit}
      userProgressEmojis={userProgressEmojis}
      weekDateStrings={weekDateStrings}
      weekStatus={weekStatus}
      onArchive={onArchive}
      onDelete={onDelete}
      onPause={onPause}
      onPress={onPress}
      onResume={onResume}
      onWeekComplete={onWeekComplete}
    />
  );
}

export default memo(DraggableHabit);
