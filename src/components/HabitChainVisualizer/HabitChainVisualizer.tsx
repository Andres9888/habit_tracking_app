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
  enableTodayPulse = true,
  strengthPercent = 0,
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
  const state = useChainVisualizerState({
    celebrationsEnabled,
    habitId,
    isConnectedToPreviousWeek,
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
        strengthPercent={strengthPercent}
        visible={Boolean(
          showConnectors && isConnectedToPreviousWeek && state.isCompleted(0)
        )}
      />
      <ChainDayList
        accentColor={accentColor}
        activeBurst={state.activeBurst}
        celebrationsEnabled={celebrationsEnabled}
        completionIcon={completionIcon}
        enableTodayPulse={enableTodayPulse}
        strengthPercent={strengthPercent}
        dateLabels={state.dateLabels}
        handleToggleDay={state.handleToggleDay}
        highContrastMode={highContrastMode}
        isCompleted={state.isCompleted}
        isFutureDate={state.isFutureDate}
        isStreakBreak={state.isStreakBreak}
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
      state.isCompleted(weekDateStrings.length - 1) ? (
        <ChainConnector
          visible
          accentColor={accentColor}
          strengthPercent={strengthPercent}
          position='end'
        />
      ) : null}
    </View>
  );
};
