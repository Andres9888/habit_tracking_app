import React, { useCallback } from 'react';
import { View } from 'react-native';
import { ChainDayItem } from './ChainDayItem';
import { ChainConnector } from './ChainConnector';
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

  const {
    isCompleted,
    isFutureDate,
    isToday,
    activeBurst,
    setActiveBurst,
    shouldReduceMotion,
    todayLabel,
    dateLabels,
    handleToggleDay,
  } = useChainVisualizerState({
    celebrationsEnabled,
    habitId,
    onToggle,
    onWeekComplete,
    reduceMotionPreference,
    weekDateStrings,
    weekStatus,
  });

  // Memoize callback to prevent infinite re-render loop in SparkleBurst
  const handleBurstComplete = useCallback(() => {
    setActiveBurst(null);
  }, [setActiveBurst]);

  const getAccessibilityLabel = (dateLabel: string, completed: boolean) =>
    dateLabel === todayLabel
      ? `Today, ${completed ? 'Completed' : 'Not completed'}`
      : `${dateLabel}: ${completed ? 'Completed' : 'Not completed'}`;

  return (
    <View className='flex-row items-center justify-between'>
      <ChainConnector
        accentColor={accentColor}
        connectorColor={connectorColor}
        currentStreak={currentStreak}
        visible={showConnectors && isConnectedToPreviousWeek && isCompleted(0)}
      />

      {weekDateStrings.map((dateString, index) => {
        const completed = isCompleted(index);
        const disabled = isFutureDate(index);
        const isLastItem = index === weekDateStrings.length - 1;

        return (
          <ChainDayItem
            key={dateString}
            accentColor={accentColor}
            accessibilityHint={
              disabled
                ? 'Future dates are unavailable'
                : `Tap to toggle completion for ${dateLabels[index]}`
            }
            accessibilityLabel={getAccessibilityLabel(
              dateLabels[index],
              completed
            )}
            activeBurst={activeBurst}
            celebrationsEnabled={celebrationsEnabled}
            completed={completed}
            completionIcon={completionIcon}
            connectorColor={connectorColor}
            currentStreak={currentStreak}
            dateString={dateString}
            disabled={disabled}
            highContrastMode={highContrastMode}
            isToday={isToday(index)}
            shape={shape}
            shouldReduceMotion={shouldReduceMotion}
            showConnector={
              showConnectors &&
              !isLastItem &&
              completed &&
              isCompleted(index + 1)
            }
            onBurstComplete={handleBurstComplete}
            onPress={() =>
              handleToggleDay(dateString, completed, disabled, index)
            }
          />
        );
      })}

      {/* Visual link to next week - extends from last button to card edge */}
      {/* Shows the streak continues into the next week */}
      {showConnectors &&
        isConnectedToNextWeek &&
        isCompleted(weekDateStrings.length - 1) && (
          <ChainConnector
            visible
            accentColor={accentColor}
            connectorColor={connectorColor}
            currentStreak={currentStreak}
            position="end"
          />
        )}
    </View>
  );
};
