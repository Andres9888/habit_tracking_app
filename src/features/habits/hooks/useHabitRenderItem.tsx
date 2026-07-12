import { useCallback } from 'react';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import { DEFAULT_SETTINGS } from '../../../../convex/settings/types';
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
    compactView,
    completionIcon,
    dayShape = DEFAULT_SETTINGS.dayShape,
    entranceVariant = 'none',
    handleArchive,
    handleDelete,
    handleHabitPress,
    highlightHabitId,
    isReorderingEnabled,
    notifyWeekCompletion,
    onHabitEntranceComplete,
    reduceMotionPreference,
    isSelectionMode,
    selectedIds,
    onToggleSelection,
    showConnectors = true,
    showGradientFill = DEFAULT_SETTINGS.showGradientFill,
    showHabitStrengthPercentage,
    toggleHabit,
    userProgressEmojis,
    weekDateStrings,
  } = args;

  return useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<Habit>) => {
      const index = getIndex?.() ?? 0;
      const renderData = getHabitRenderData(item, index, args);

      return (
        <HabitRenderContent
          celebrationsEnabled={celebrationsEnabled}
          compactView={compactView}
          completionIcon={completionIcon}
          dayShape={dayShape}
          drag={drag}
          entranceDelay={renderData.entranceDelay}
          entranceVariant={entranceVariant}
          handleArchive={handleArchive}
          handleDelete={handleDelete}
          handleHabitPress={handleHabitPress}
          highlightHabitId={highlightHabitId}
          isActive={Boolean(isActive)}
          isConnectedToNextWeek={renderData.isConnectedToNextWeek}
          isConnectedToPreviousWeek={renderData.isConnectedToPreviousWeek}
          isReorderingEnabled={isReorderingEnabled}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleSelection={onToggleSelection}
          item={item}
          notifyWeekCompletion={notifyWeekCompletion}
          reduceMotionPreference={reduceMotionPreference}
          showConnectors={showConnectors}
          showGradientFill={showGradientFill}
          showHabitStrengthPercentage={Boolean(showHabitStrengthPercentage)}
          streak={renderData.streak}
          toggleHabit={toggleHabit}
          triggerEntrance={Boolean(renderData.triggerEntrance)}
          userProgressEmojis={userProgressEmojis}
          weekDateStrings={weekDateStrings}
          weekStatus={renderData.weekStatus}
          onHabitEntranceComplete={onHabitEntranceComplete}
        />
      );
    },
    getRenderItemDependencies(args)
  );
}
