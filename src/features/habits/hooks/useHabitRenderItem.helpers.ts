import type { Habit, HabitStatus } from '../types';
import { getNextWeekConnection } from './getNextWeekConnection';
import { getPreviousWeekConnection } from './getPreviousWeekConnection';
import type { UseHabitRenderItemArgs } from './useHabitRenderItem.types';

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
  const weekStatus = getWeekStatusForHabit(
    item._id,
    weekDateStrings,
    getHabitStatus
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
    args.compactView,
    args.completionIcon,
    args.dayShape,
    args.entranceStaggerDelay,
    args.entranceVariant,
    args.getHabitStatus,
    args.getStreak,
    args.handleArchive,
    args.handleDelete,
    args.handleHabitPress,
    args.highlightHabitId,
    args.isReorderingEnabled,
    args.notifyWeekCompletion,
    args.onHabitEntranceComplete,
    args.reduceMotionPreference,
    args.seenHabitIds,
    args.shouldTriggerEntrance,
    args.showConnectors,
    args.showGradientFill,
    args.showHabitStrengthPercentage,
    args.toggleHabit,
    args.userProgressEmojis,
    args.weekDateStrings,
  ];
}

// Keyed per habit and compared by content so the returned array keeps a
// stable identity across renders — even when getHabitStatus itself is
// recreated (it is on every toggle). A stable identity is what lets the
// memo() boundary on HabitRenderContent hold for untouched habits.
const weekStatusCache = new Map<
  string,
  { key: string; statuses: HabitStatus[] }
>();

function getWeekStatusForHabit(
  habitId: string,
  weekDateStrings: string[],
  getHabitStatus: UseHabitRenderItemArgs['getHabitStatus']
): HabitStatus[] {
  const key = weekDateStrings.join(',');
  const computed = weekDateStrings.map((dateString) =>
    getHabitStatus(habitId, dateString)
  );

  const cached = weekStatusCache.get(habitId);
  if (
    cached &&
    cached.key === key &&
    cached.statuses.length === computed.length &&
    cached.statuses.every((status, i) => status === computed[i])
  ) {
    return cached.statuses;
  }

  weekStatusCache.set(habitId, { key, statuses: computed });
  return computed;
}
