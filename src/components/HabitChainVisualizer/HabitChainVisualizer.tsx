/* eslint-disable max-lines */
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { ChainConnector } from './ChainConnector';
import { ChainDayList } from './ChainDayList';
import { useChainVisualizerState } from './useChainVisualizerState';
import type { HabitChainVisualizerProps } from './types';

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  accentColor,
  celebrationsEnabled = true,
  completionIcon = 'chain',
  currentStreak = 0,
  habitId,
  highContrastMode = false,
  isConnectedToNextWeek = false,
  isConnectedToPreviousWeek = false,
  onToggle,
  onWeekComplete,
  reduceMotionPreference = false,
  shape = 'square',
  showConnectors = true,
  weekDateStrings,
  weekStatus,
}) => {
  const connectorColor = highContrastMode ? '#facc15' : '#e0e0e0';
  const state = useChainVisualizerState({
    celebrationsEnabled,
    habitId,
    onToggle,
    onWeekComplete,
    reduceMotionPreference,
    weekDateStrings,
    weekStatus,
  });

  const handleBurstComplete = useCallback(() => {
    state.setActiveBurst(null);
  }, [state.setActiveBurst]);

  return (
    <View className='flex-row items-center justify-between'>
      <ChainConnector
        accentColor={accentColor}
        connectorColor={connectorColor}
        currentStreak={currentStreak}
        visible={Boolean(
          showConnectors &&
            isConnectedToPreviousWeek &&
            state.isCompleted(0)
        )}
      />
      <ChainDayList
        accentColor={accentColor}
        activeBurst={state.activeBurst}
        celebrationsEnabled={celebrationsEnabled}
        completionIcon={completionIcon}
        connectorColor={connectorColor}
        currentStreak={currentStreak}
        dateLabels={state.dateLabels}
        handleToggleDay={state.handleToggleDay}
        highContrastMode={highContrastMode}
        isCompleted={state.isCompleted}
        isFutureDate={state.isFutureDate}
        isToday={state.isToday}
        shape={shape}
        shouldReduceMotion={state.shouldReduceMotion}
        showConnectors={showConnectors}
        todayLabel={state.todayLabel}
        weekDateStrings={weekDateStrings}
        onBurstComplete={handleBurstComplete}
      />
      {showConnectors &&
        isConnectedToNextWeek &&
        state.isCompleted(weekDateStrings.length - 1) ? <ChainConnector
            visible
            accentColor={accentColor}
            connectorColor={connectorColor}
            currentStreak={currentStreak}
            position='end'
          /> : null}
    </View>
  );
};
