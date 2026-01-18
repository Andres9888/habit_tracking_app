import React from 'react';
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

export function HabitRenderContent({
  item,
  isActive,
  entranceDelay,
  triggerEntrance,
  weekStatus,
  streak,
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
}
