/**
 * useHabitRenderItem Hook
 *
 * Provides the render function for habit items in the draggable list.
 */

import { useCallback } from 'react';
import { View } from 'react-native';
import {
  ScaleDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import DraggableHabit from '../../../components/DraggableHabit';
import type { Habit } from '../types';
import type { UseHabitRenderItemArgs } from './useHabitRenderItem.types';
import { getPreviousWeekConnection } from './getPreviousWeekConnection';

export function useHabitRenderItem({
  celebrationsEnabled,
  completionIcon,
  dayShape = 'square',
  getHabitStatus,
  getStreak,
  handleArchive,
  handleHabitPress,
  highlightHabitId,
  isReorderingEnabled,
  notifyWeekCompletion,
  reduceMotionPreference,
  showConnectors = true,
  showHabitStrengthPercentage,
  toggleHabit,
  weekDateStrings,
  entranceVariant = 'widthExpansion',
  entranceStaggerDelay = 50,
  shouldTriggerEntrance = false,
  seenHabitIds,
  onHabitEntranceComplete,
}: UseHabitRenderItemArgs) {
  return useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<Habit>) => {
      const index = getIndex?.() ?? 0;
      const entranceDelay = index * entranceStaggerDelay;
      const hasBeenSeen = seenHabitIds?.has(item._id) ?? false;
      const triggerEntrance = shouldTriggerEntrance && !hasBeenSeen;

      const weekStatus = weekDateStrings.map((dateString) =>
        getHabitStatus(item._id, dateString)
      );
      const streak = getStreak(item._id);
      const isConnectedToPreviousWeek = getPreviousWeekConnection(
        weekDateStrings[0],
        item._id,
        getHabitStatus
      );

      return (
        <ScaleDecorator>
          <View className='mb-5' style={{ opacity: isActive ? 0.7 : 1 }}>
            <DraggableHabit
              celebrationsEnabled={celebrationsEnabled}
              completionIcon={completionIcon}
              dayShape={dayShape}
              entranceDelay={entranceDelay}
              entranceVariant={entranceVariant}
              habit={item}
              isConnectedToPreviousWeek={isConnectedToPreviousWeek}
              isJustCreated={highlightHabitId === item._id}
              reduceMotionPreference={reduceMotionPreference}
              showConnectors={showConnectors}
              showHabitStrengthPercentage={showHabitStrengthPercentage}
              streak={streak}
              toggleHabit={toggleHabit}
              triggerEntrance={triggerEntrance}
              weekDateStrings={weekDateStrings}
              weekStatus={weekStatus}
              onArchive={handleArchive}
              onEntranceComplete={() => onHabitEntranceComplete?.(item._id)}
              onLongPress={isReorderingEnabled ? drag : undefined}
              onPress={handleHabitPress}
              onWeekComplete={({ completedDate }) =>
                notifyWeekCompletion({ completedDate, habit: item })
              }
            />
          </View>
        </ScaleDecorator>
      );
    },
    [
      celebrationsEnabled,
      completionIcon,
      dayShape,
      entranceStaggerDelay,
      entranceVariant,
      getHabitStatus,
      getStreak,
      handleArchive,
      handleHabitPress,
      highlightHabitId,
      isReorderingEnabled,
      notifyWeekCompletion,
      onHabitEntranceComplete,
      reduceMotionPreference,
      seenHabitIds,
      shouldTriggerEntrance,
      showConnectors,
      showHabitStrengthPercentage,
      toggleHabit,
      weekDateStrings,
    ]
  );
}
