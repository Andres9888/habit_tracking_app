import { useCallback } from 'react';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import type { Habit } from '../types';
import type { UseHabitRenderItemArgs } from './useHabitRenderItem.types';
import {
  getHabitRenderData,
  getRenderItemDependencies,
} from './useHabitRenderItem.helpers';
import { HabitRenderContent } from './HabitRenderContent';

export function useHabitRenderItem(args: UseHabitRenderItemArgs) {
  const {
    celebrationsEnabled,
    completionIcon,
    dayShape = 'square',
    entranceVariant = 'widthExpansion',
    handleArchive,
    handleHabitPress,
    highlightHabitId,
    isReorderingEnabled,
    notifyWeekCompletion,
    onHabitEntranceComplete,
    reduceMotionPreference,
    showConnectors = true,
    showHabitStrengthPercentage,
    toggleHabit,
    weekDateStrings,
  } = args;

  return useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<Habit>) => {
      const index = getIndex?.() ?? 0;
      const renderData = getHabitRenderData(item, index, args);

      return (
        <HabitRenderContent
          celebrationsEnabled={celebrationsEnabled}
          completionIcon={completionIcon}
          dayShape={dayShape}
          drag={drag}
          entranceDelay={renderData.entranceDelay}
          entranceVariant={entranceVariant}
          handleArchive={handleArchive}
          handleHabitPress={handleHabitPress}
          highlightHabitId={highlightHabitId}
          isActive={isActive}
          isConnectedToNextWeek={renderData.isConnectedToNextWeek}
          isConnectedToPreviousWeek={renderData.isConnectedToPreviousWeek}
          isReorderingEnabled={isReorderingEnabled}
          item={item}
          notifyWeekCompletion={notifyWeekCompletion}
          reduceMotionPreference={reduceMotionPreference}
          showConnectors={showConnectors}
          showHabitStrengthPercentage={showHabitStrengthPercentage}
          streak={renderData.streak}
          toggleHabit={toggleHabit}
          triggerEntrance={renderData.triggerEntrance}
          weekDateStrings={weekDateStrings}
          weekStatus={renderData.weekStatus}
          onHabitEntranceComplete={onHabitEntranceComplete}
        />
      );
    },
    getRenderItemDependencies(args)
  );
}
