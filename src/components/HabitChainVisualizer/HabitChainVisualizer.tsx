import React from 'react';
import { View } from 'react-native';
import { DayConnector } from './DayConnector';
import { ChainDayItem } from './ChainDayItem';
import { useChainVisualizerState } from './useChainVisualizerState';
import type { HabitChainVisualizerProps } from './types';

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  accentColor,
  celebrationsEnabled = true,
  completionIcon = 'chain',
  currentStreak = 0,
  habitId,
  highContrastMode = false,
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

  const getAccessibilityLabel = (dateLabel: string, completed: boolean) =>
    dateLabel === todayLabel
      ? `Today, ${completed ? 'Completed' : 'Not completed'}`
      : `${dateLabel}: ${completed ? 'Completed' : 'Not completed'}`;

  return (
    <View className='flex-row items-center justify-between'>
      {showConnectors && isConnectedToPreviousWeek && isCompleted(0) && (
        <View
          style={{
            left: -10,
            marginTop: -1,
            position: 'absolute',
            top: '50%',
            zIndex: -1,
          }}
        >
          <DayConnector
            visible
            accentColor={accentColor}
            baseColor={connectorColor}
            currentStreak={currentStreak}
          />
        </View>
      )}

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
            onBurstComplete={() => setActiveBurst(null)}
            onPress={() =>
              handleToggleDay(dateString, completed, disabled, index)
            }
          />
        );
      })}
    </View>
  );
};
