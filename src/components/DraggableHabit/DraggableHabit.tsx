import React from 'react';
import { useHabitCardEntrance } from '../HabitCard/useHabitCardEntrance';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useDraggableHabitLogic } from './DraggableHabit.hooks';
import { getCardColors } from './colorUtils';
import { getStrengthPercent } from './strengthUtils';
import { useDraggableHabitAnimations } from './useDraggableHabitAnimations';
import { useStrengthAnimation } from './useStrengthAnimation';
import { usePressHandlers } from './usePressHandlers';
import { DraggableHabitCard } from './DraggableHabitCard';
import type { DraggableHabitProps } from './types';

export default function DraggableHabit({
  celebrationsEnabled,
  completionIcon = 'chain',
  dayShape = 'square',
  entranceDelay = 0,
  entranceVariant = 'widthExpansion',
  habit,
  highContrastMode = false,
  isCompactMode: _isCompactMode = false,
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
}: DraggableHabitProps) {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);

  const {
    cardStyle: entranceCardStyle,
    accentStyle: entranceAccentStyle,
    contentStyle: entranceContentStyle,
  } = useHabitCardEntrance({
    autoTrigger: triggerEntrance,
    delay: entranceDelay,
    onAnimationComplete: onEntranceComplete,
    variant: entranceVariant,
  });

  const { triggerSelection, triggerSuccess } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  const weekCompleteCount = weekStatus.filter((s) => s === 'done').length;
  const isWeekComplete = weekCompleteCount === 7;
  const bestStreak = habit.bestStreak || 0;
  const isNewPersonalRecord =
    previousStreak !== undefined &&
    streak > bestStreak &&
    streak > (previousStreak || 0);

  const animations = useDraggableHabitAnimations({
    isJustCreated,
    isNewPersonalRecord,
    isWeekComplete,
    reduceMotionPreference,
    triggerSuccess,
  });

  const strengthPercent = getStrengthPercent(habit.strength);
  const { strengthEmojiAnimatedStyle } = useStrengthAnimation(
    strengthPercent,
    reduceMotionPreference
  );

  const colors = getCardColors(highContrastMode);

  const pressHandlers = usePressHandlers({
    archiveFlash: animations.archiveFlash,
    cardScale: animations.cardScale,
    habit,
    onArchive,
    onLongPress,
    triggerSelection,
  });

  return (
    <DraggableHabitCard
      accentColor={accentColor}
      archiveFlash={animations.archiveFlash}
      bestStreak={bestStreak}
      cardScale={animations.cardScale}
      celebrationsEnabled={celebrationsEnabled}
      colors={colors}
      completionIcon={completionIcon}
      dayShape={dayShape}
      emoji={emoji}
      entranceAccentStyle={entranceAccentStyle}
      entranceCardStyle={entranceCardStyle}
      entranceContentStyle={entranceContentStyle}
      fade={animations.fade}
      habit={habit}
      handleLongPress={pressHandlers.handleLongPress}
      handlePressIn={pressHandlers.handlePressIn}
      handlePressOut={pressHandlers.handlePressOut}
      handleSwipeableOpen={pressHandlers.handleSwipeableOpen}
      highContrastMode={highContrastMode}
      highlightGlow={animations.highlightGlow}
      iconPulse={animations.iconPulse}
      isConnectedToPreviousWeek={isConnectedToPreviousWeek}
      isWeekComplete={isWeekComplete}
      name={name}
      newRecordOpacity={animations.newRecordOpacity}
      newRecordScale={animations.newRecordScale}
      reduceMotionPreference={reduceMotionPreference}
      showConnectors={showConnectors}
      showHabitStrengthPercentage={showHabitStrengthPercentage}
      showNewRecord={animations.showNewRecord}
      streak={streak}
      strengthEmojiAnimatedStyle={strengthEmojiAnimatedStyle}
      strengthPercent={strengthPercent}
      toggleHabit={toggleHabit}
      translateY={animations.translateY}
      weekDateStrings={weekDateStrings}
      weekStatus={weekStatus}
      onArchive={onArchive}
      onPress={onPress}
      onWeekComplete={onWeekComplete}
    />
  );
}
