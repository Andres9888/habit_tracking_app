/* eslint-disable max-lines */
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

  const state = useDraggableHabitState({
    habit,
    highContrastMode,
    previousStreak,
    streak,
    weekStatus,
  });

  const entrance = useHabitCardEntrance({
    autoTrigger: triggerEntrance,
    delay: entranceDelay,
    onAnimationComplete: onEntranceComplete,
    variant: entranceVariant,
  });

  const { triggerSelection, triggerSuccess, triggerHeavyImpact } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  const animations = useDraggableHabitAnimations({
    isJustCreated,
    isNewPersonalRecord: state.isNewPersonalRecord,
    isWeekComplete: state.isWeekComplete,
    reduceMotionPreference,
    triggerSuccess,
  });

  const { progressAnimatedStyle, strengthEmojiAnimatedStyle } =
    useStrengthAnimation(state.strengthPercent, reduceMotionPreference);

  const { isDark, showGradientFill, strengthFillStyle } = useCardStrengthFill(
    state.strengthPercent,
    reduceMotionPreference
  );

  const pressHandlers = usePressHandlers({
    archiveFlash: animations.archiveFlash,
    cardScale: animations.cardScale,
    habit,
    onArchive,
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
  );
}

export default memo(DraggableHabit);
