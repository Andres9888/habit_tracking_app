/**
 * renderHabitsListFooter - Footer renderer for HabitsList
 */

import { HabitsListFooter } from './HabitsListFooter';
import type { HabitsListProps } from './HabitsList.types';

interface RenderHabitsListFooterOptions {
  list: HabitsListProps['list'];
  onUpgradeIntent: HabitsListProps['onUpgradeIntent'];
}

export function renderHabitsListFooter({
  list,
  onUpgradeIntent,
}: RenderHabitsListFooterOptions) {
  return (
    <HabitsListFooter
      hasReachedHabitLimit={list.hasReachedHabitLimit}
      isPremiumUser={list.isPremiumUser}
      reduceMotionPreference={list.reduceMotionPreference}
      onUpgradeIntent={onUpgradeIntent}
    />
  );
}
