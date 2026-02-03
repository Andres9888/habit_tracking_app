/* eslint-disable max-lines */
import React, { useCallback, memo } from 'react';
import { View } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import DraggableHabit from '../../../components/DraggableHabit';
import type { Habit } from '../types';
import type { UseHabitRenderItemArgs } from './useHabitRenderItem.types';

type HabitRenderContentProps = {
  item: Habit;
  isActive: boolean;
  entranceDelay: number;
  triggerEntrance: boolean;
  weekStatus: string[];
  streak: number;
  isConnectedToNextWeek: boolean;
  isConnectedToPreviousWeek: boolean;
  drag?: () => void;
} & Pick<
  UseHabitRenderItemArgs,
  | 'celebrationsEnabled'
  | 'completionIcon'
  | 'dayShape'
  | 'entranceVariant'
  | 'handleArchive'
  | 'handleHabitPress'
  | 'highlightHabitId'
  | 'isReorderingEnabled'
  | 'notifyWeekCompletion'
  | 'onHabitEntranceComplete'
  | 'reduceMotionPreference'
  | 'showConnectors'
  | 'showHabitStrengthPercentage'
  | 'toggleHabit'
  | 'weekDateStrings'
>;

function HabitRenderContentComponent({
  item,
  isActive,
  entranceDelay,
  triggerEntrance,
  weekStatus,
  streak,
  isConnectedToNextWeek,
  isConnectedToPreviousWeek,
  drag,
  celebrationsEnabled,
  completionIcon,
  dayShape,
  entranceVariant,
  handleArchive,
  handleHabitPress,
  highlightHabitId,
  isReorderingEnabled,
  notifyWeekCompletion,
  onHabitEntranceComplete,
  reduceMotionPreference,
  showConnectors,
  showHabitStrengthPercentage,
  toggleHabit,
  weekDateStrings,
}: HabitRenderContentProps) {
  // Memoize callbacks to prevent recreating on every render
  const handleEntranceComplete = useCallback(() => {
    onHabitEntranceComplete?.(item._id);
  }, [onHabitEntranceComplete, item._id]);

  const handleWeekComplete = useCallback(
    ({ completedDate }: { completedDate: string }) => {
      notifyWeekCompletion({ completedDate, habit: item });
    },
    [notifyWeekCompletion, item]
  );

  const handleLongPress = isReorderingEnabled ? drag : undefined;

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
          isConnectedToNextWeek={isConnectedToNextWeek}
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
          onEntranceComplete={handleEntranceComplete}
          onLongPress={handleLongPress}
          onPress={handleHabitPress}
          onWeekComplete={handleWeekComplete}
        />
      </View>
    </ScaleDecorator>
  );
}

export const HabitRenderContent = memo(HabitRenderContentComponent);
