/**
 * renderHabitsListFooter — FlatList `ListFooterComponent` factory.
 *
 * Renders a {@link HabitsListFooter} which conditionally shows a
 * {@link LockedHabitCard} when the free-tier user has reached the habit limit.
 * For premium users or users below the limit, the footer is `null`.
 */

import type { HabitsListProps } from './HabitsList.types';
import { HabitsListFooter } from './HabitsListFooter';

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
