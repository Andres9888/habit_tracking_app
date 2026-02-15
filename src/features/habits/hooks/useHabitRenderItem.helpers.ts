
import type { Habit } from '../types';
import type { UseHabitRenderItemArgs } from './useHabitRenderItem.types';
import { getNextWeekConnection } from './getNextWeekConnection';
import { getPreviousWeekConnection } from './getPreviousWeekConnection';

export function getHabitRenderData(
  item: Habit,
  index: number,
  args: UseHabitRenderItemArgs
) {
  const {
    entranceStaggerDelay,
    getHabitStatus,
    getStreak,
    seenHabitIds,
    shouldTriggerEntrance,
    weekDateStrings,
  } = args;

  const entranceDelay = index * (entranceStaggerDelay ?? 0);
  const hasBeenSeen = seenHabitIds?.has(item._id) ?? false;
  const triggerEntrance = Boolean(shouldTriggerEntrance) && !hasBeenSeen;
  const weekStatus = weekDateStrings.map((dateString) =>
    getHabitStatus(item._id, dateString)
  );
  const streak = getStreak(item._id);
  const isConnectedToPreviousWeek = getPreviousWeekConnection(
    weekDateStrings?.[0],
    item._id,
    getHabitStatus
  );
  const isConnectedToNextWeek = getNextWeekConnection(
    weekDateStrings.at(-1),
    item._id,
    getHabitStatus
  );

  return {
    entranceDelay,
    isConnectedToNextWeek,
    isConnectedToPreviousWeek,
    streak,
    triggerEntrance,
    weekStatus,
  };
}

export function getRenderItemDependencies(args: UseHabitRenderItemArgs) {
  return [
    args.celebrationsEnabled,
    args.completionIcon,
    args.dayShape,
    args.entranceStaggerDelay,
    args.entranceVariant,
    args.getHabitStatus,
    args.getStreak,
    args.handleArchive,
    args.handleHabitPress,
    args.highlightHabitId,
    args.isReorderingEnabled,
    args.notifyWeekCompletion,
    args.onHabitEntranceComplete,
    args.reduceMotionPreference,
    args.seenHabitIds,
    args.shouldTriggerEntrance,
    args.showConnectors,
    args.showHabitStrengthPercentage,
    args.toggleHabit,
    args.weekDateStrings,
  ];
}
