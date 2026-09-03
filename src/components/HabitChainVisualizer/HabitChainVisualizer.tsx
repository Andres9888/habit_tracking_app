import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { ChainConnector } from './ChainConnector';
import { ChainDayList } from './ChainDayList';
import { useChainVisualizerState } from './useChainVisualizerState';
import type { HabitChainVisualizerProps } from './types';

const HabitChainVisualizerComponent: React.FC<HabitChainVisualizerProps> = ({
  accentColor,
  celebrationsEnabled = true,
  completionIcon = 'chain',
  strengthPercent = 0,
  habitId,
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
        visible={
          showConnectors && isConnectedToPreviousWeek
            ? state.isCompleted(0)
            : false
        }
      />
      <ChainDayList
        accentColor={accentColor}
        activeBurst={state.activeBurst}
        celebrationsEnabled={celebrationsEnabled}
        completionIcon={completionIcon}
        strengthPercent={strengthPercent}
        dateLabels={state.dateLabels}
        handleToggleDay={state.handleToggleDay}
        isCompleted={state.isCompleted}
        isFutureDate={state.isFutureDate}
        isStreakBreak={state.isStreakBreak}
        isToday={state.isToday}
        reduceMotionPreference={reduceMotionPreference}
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

// Without this, memo(ChainDayList) below never bails out: an unmemoized parent
// re-renders on every CardContent render and hands down fresh child props.
export const HabitChainVisualizer = memo(HabitChainVisualizerComponent);
