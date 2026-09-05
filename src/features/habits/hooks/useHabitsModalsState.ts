/* eslint-disable max-lines */
/**
 * HabitsModalsState Hook
 *
 * State hook for habits modals with offline support.
 * Integrates optimistic updates and offline queue for habit toggling.
 *
 * @see docs/offline-habit-sync.md T011
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { useHabitMutations } from './useHabitMutations';
import { useHabitMilestones } from './useHabitMilestones';
import { useHabitsTracking } from './useHabitsTracking';
import { useHabitsModalsHandlers } from './useHabitsModalsHandlers';
import { useModalVisibilityState } from './useModalVisibilityState';
import { useHabitSelectionState } from './useHabitSelectionState';
import { useHabitsSettings } from './useHabitsSettings';
import { buildModalsStateReturnValue } from './buildModalsStateReturnValue';
import { useModalsStableHandlers } from './useModalsStableHandlers';
import { buildModalsSettersArg } from './buildModalsSettersArg';
import {
  generateDateStrings,
  getTodayMidnight,
  useSyncAllHabitStates,
} from './modalsStateHelpers';
import { getLocalDateString } from '@/utils/getLocalDateString';
import { scheduleWhenIdle } from '../../../lib/timing/scheduleWhenIdle';
import { useOptimisticToggleMutation } from '../../../lib/optimistic';
import { sanitizeSettingsPayload } from '../../../lib/settings/sanitizeSettingsPayload';
import { updateSettingsWithFallback } from '../../../lib/settings/updateSettingsWithFallback';
import type { HabitsModalsState } from './types';

interface UseHabitsModalsStateProps {
  habits: Habit[];
  showHabitStrengthPercentage: boolean;
}

export function useHabitsModalsState({
  habits,
  showHabitStrengthPercentage,
}: UseHabitsModalsStateProps): HabitsModalsState {
  const visibility = useModalVisibilityState();
  const selection = useHabitSelectionState();
  const {
    archivedHabitsCount,
    settings,
    celebrationsEnabled,
    reduceMotionPreference,
  } = useHabitsSettings(visibility.isSettingsOpen);

  const {
    pauseHabit,
    removeHabit,
    updateSettings,
    toggleHabit,
    archiveHabit,
    isOnline,
  } = useHabitMutations();
  const { milestone, clearMilestone } = useHabitMilestones(habits, false);
  const [stickyCalendarHeaderOverride, setStickyCalendarHeaderOverride] =
    useState<boolean>();

  const todayKey = getLocalDateString();
  const trackingDates = useMemo(() => generateDateStrings(365), [todayKey]);
  const todayMidnight = useMemo(() => getTodayMidnight(), [todayKey]);

  // The modals' tracking subscription is a ~455-day live query. It never
  // rides the first-paint path: it stays off until either the home screen has
  // settled (scheduleWhenIdle fires, or its fallback timer does) or one of
  // its consumers — the calendar modal, the detail screen, quick actions —
  // opens first, whichever happens first. The latch (a render-cache ref,
  // monotonic and idempotent) keeps it warm afterwards so reopening a modal
  // never re-subscribes.
  //
  // Both tracking instances share the `habits.getTracking:latest` slot —
  // last writer wins, exactly as before this branch. That sharing is
  // deliberate: persistence is what makes the long window survive an offline
  // restart. usePersistCachedQuery only writes to storage on the writeLatest
  // path, so suppressing it here would leave the ~455-day result in memory
  // only, and a cold offline launch would fall back to the list's ~90-day
  // window — older completions would read as missed in the calendar modal
  // and on the detail screen.
  const trackingConsumerOpen =
    visibility.isHabitCalendarOpen ||
    visibility.isHabitDetailOpen ||
    visibility.showQuickActions;
  const trackingWarmedRef = useRef(false);
  if (trackingConsumerOpen) trackingWarmedRef.current = true;

  const [idleWarmed, setIdleWarmed] = useState(false);
  useEffect(() => {
    const cancel = scheduleWhenIdle(() => setIdleWarmed(true), {
      fallbackDelayMs: 1500,
      timeoutMs: 4000,
    });
    return cancel;
  }, []);

  const { tracking, getStreak, isCompleted } = useHabitsTracking(
    trackingDates,
    todayMidnight,
    { enabled: trackingWarmedRef.current || idleWarmed }
  );

  // Wrap toggle mutation as plain async function
  const wrappedToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await toggleHabit(args);
    },
    [toggleHabit]
  );

  // Wrap toggle mutation with optimistic update + offline queue support (T011)
  const optimisticToggleHabit = useOptimisticToggleMutation(
    wrappedToggleHabit,
    isCompleted,
    { isOnline }
  );

  useSyncAllHabitStates(habits, selection);

  // Wrap mutations as plain async functions to match handler type signatures
  const wrappedPauseHabit = useCallback(
    async (args: { habitId: Id<'habits'> }) => {
      await pauseHabit(args);
    },
    [pauseHabit]
  );
  const wrappedRemoveHabit = useCallback(
    async (args: { habitId: Id<'habits'> }) => {
      await removeHabit(args);
    },
    [removeHabit]
  );
  const wrappedUpdateSettings = useCallback(
    async (s: Parameters<typeof updateSettings>[0]) => {
      const updates = sanitizeSettingsPayload(
        s as Record<string, unknown>
      ) as Record<string, unknown>;

      if (
        Object.prototype.hasOwnProperty.call(updates, 'stickyCalendarHeader')
      ) {
        setStickyCalendarHeaderOverride(
          Boolean(updates.stickyCalendarHeader as boolean)
        );
      }

      await updateSettingsWithFallback(updateSettings, updates);
    },
    [updateSettings]
  );

  useEffect(() => {
    if (
      settings?.stickyCalendarHeader !== undefined &&
      stickyCalendarHeaderOverride !== undefined &&
      settings.stickyCalendarHeader === stickyCalendarHeaderOverride
    ) {
      setStickyCalendarHeaderOverride(undefined);
    }
  }, [settings?.stickyCalendarHeader, stickyCalendarHeaderOverride]);

  const settingsWithOverrides = useMemo(() => {
    if (settings === undefined) return settings;
    if (stickyCalendarHeaderOverride === undefined) return settings;
    return {
      ...settings,
      stickyCalendarHeader: stickyCalendarHeaderOverride,
    };
  }, [settings, stickyCalendarHeaderOverride]);
  const handlers = useHabitsModalsHandlers(
    buildModalsSettersArg(visibility, selection),
    {
      clearMilestone,
      habits,
      habitToPause: selection.habitToPause,
      pauseHabit: wrappedPauseHabit,
      removeHabit: wrappedRemoveHabit,
      settings: settingsWithOverrides,
      updateSettings: wrappedUpdateSettings,
    }
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const onChangeCelebrationsEnabled = useCallback(
    async (value: boolean) =>
      handlers.onSettingsChange({ showMotivationalMessages: value }),
    [handlers]
  );

  const handleToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      // Use optimistic toggle with offline queue support
      await optimisticToggleHabit(args);
    },
    [optimisticToggleHabit]
  );

  const stableHandlers = useModalsStableHandlers(visibility, selection);

  // Memoised: `modals` is spread into BottomActionBar and every HabitsModals
  // section, all of which are memo()'d. A fresh object here re-rendered all of
  // them on every Home render. Every input below is itself memoised.
  return useMemo(
    () =>
      buildModalsStateReturnValue(
        visibility,
        selection,
        handlers,
        stableHandlers,
        {
          archivedHabitsCount,
          celebrationsEnabled,
          clearMilestone,
          getStreak,
          habits,
          handleArchive,
          handleToggleHabit,
          milestone,
          onChangeCelebrationsEnabled,
          reduceMotionPreference,
          settings,
          showHabitStrengthPercentage,
          tracking,
        }
      ),
    [
      archivedHabitsCount,
      celebrationsEnabled,
      clearMilestone,
      getStreak,
      habits,
      handleArchive,
      handleToggleHabit,
      handlers,
      milestone,
      onChangeCelebrationsEnabled,
      reduceMotionPreference,
      selection,
      settings,
      showHabitStrengthPercentage,
      stableHandlers,
      tracking,
      visibility,
    ]
  );
}
