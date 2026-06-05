/* eslint-disable max-lines */
/** Top-level memoized habit-card orchestrator for the main list. */

import React, { memo } from 'react';
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
    completionIcon = 'chain',
    dayShape = 'square',
    enableChevronNudge = false,
    enableTodayPulse = true,
    entranceDelay = 0,
    entranceVariant = 'widthExpansion',
    habit,
    highContrastMode = false,
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
      enableChevronNudge={enableChevronNudge}
      enableTodayPulse={enableTodayPulse}
      entranceAccentStyle={entrance.accentStyle}
      entranceCardStyle={entrance.cardStyle}
      entranceContentStyle={entrance.contentStyle}
      habit={habit}
      highContrastMode={highContrastMode}
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
      weekDateStrings={weekDateStrings}
      userProgressEmojis={userProgressEmojis}
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
