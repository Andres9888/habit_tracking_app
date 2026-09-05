import { useCallback, useMemo } from 'react';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { HabitSelectionState } from './useHabitSelectionState';
import type { ModalVisibilityState } from './useModalVisibilityState';

export interface ModalsStableHandlers {
  closeHabitCalendar: () => void;
  closeHabitDetail: () => void;
  closeHapticTest: () => void;
  closePauseModal: () => void;
  closeSettings: () => void;
  closeTemplatesScreen: () => void;
  commitFocusHabitOnHome: (habitId: Id<'habits'>) => void;
  markFocusHabitReady: (habitId: Id<'habits'>) => void;
  openHapticTest: () => void;
  openSettings: () => void;
  openTemplatesScreen: () => void;
  prepareFocusHabitOnHome: (habitId: Id<'habits'>) => void;
  setShowHabitStrengthPercentage: () => void;
}

const noop = () => {
  // Placeholder kept for API compatibility with HabitsModalsState.
};

/**
 * The open/close closures that used to be allocated inline inside
 * `buildModalsStateReturnValue`. Building them there gave the modals state
 * object ~12 fresh function identities every render, which defeated the
 * `memo()` boundary on BottomActionBar and on every HabitsModals section.
 */
export function useModalsStableHandlers(
  visibility: ModalVisibilityState,
  selection: HabitSelectionState
): ModalsStableHandlers {
  const {
    clearPendingFocusHabit,
    commitPendingFocusHabit,
    markPendingFocusReady,
    preparePendingFocusHabit,
    setIsHabitCalendarOpen,
    setIsHabitDetailOpen,
    setIsSettingsOpen,
    setShowHapticTest,
    setShowPauseModal,
    setShowTemplatesScreen,
  } = visibility;
  const { setHabitToPause } = selection;

  const closeSettings = useCallback(
    () => setIsSettingsOpen(false),
    [setIsSettingsOpen]
  );
  const openSettings = useCallback(
    () => setIsSettingsOpen(true),
    [setIsSettingsOpen]
  );
  const closeHabitCalendar = useCallback(
    () => setIsHabitCalendarOpen(false),
    [setIsHabitCalendarOpen]
  );
  const closeHabitDetail = useCallback(
    () => setIsHabitDetailOpen(false),
    [setIsHabitDetailOpen]
  );
  const closeHapticTest = useCallback(
    () => setShowHapticTest(false),
    [setShowHapticTest]
  );
  const openHapticTest = useCallback(() => {
    setIsSettingsOpen(false);
    setShowHapticTest(true);
  }, [setIsSettingsOpen, setShowHapticTest]);
  const closePauseModal = useCallback(() => {
    setShowPauseModal(false);
    setHabitToPause(null);
  }, [setHabitToPause, setShowPauseModal]);
  const closeTemplatesScreen = useCallback(
    () => setShowTemplatesScreen(false),
    [setShowTemplatesScreen]
  );
  // Reopening the library cancels any stale focus request.
  const openTemplatesScreen = useCallback(() => {
    clearPendingFocusHabit();
    setShowTemplatesScreen(true);
  }, [clearPendingFocusHabit, setShowTemplatesScreen]);

  // Prepare remounts and converges Home while the toast still covers it.
  const prepareFocusHabitOnHome = useCallback(
    (habitId: Id<'habits'>) => {
      preparePendingFocusHabit(habitId);
    },
    [preparePendingFocusHabit]
  );
  // Commit asks the list to reveal. A ready request skips probe polling;
  // a cold request keeps the baseline converge-then-close behavior.
  const commitFocusHabitOnHome = useCallback(
    (habitId: Id<'habits'>) => {
      commitPendingFocusHabit(habitId);
    },
    [commitPendingFocusHabit]
  );
  const markFocusHabitReady = useCallback(
    (habitId: Id<'habits'>) => {
      markPendingFocusReady(habitId);
    },
    [markPendingFocusReady]
  );

  return useMemo(
    () => ({
      closeHabitCalendar,
      closeHabitDetail,
      closeHapticTest,
      closePauseModal,
      closeSettings,
      closeTemplatesScreen,
      commitFocusHabitOnHome,
      markFocusHabitReady,
      openHapticTest,
      openSettings,
      openTemplatesScreen,
      prepareFocusHabitOnHome,
      setShowHabitStrengthPercentage: noop,
    }),
    [
      closeHabitCalendar,
      closeHabitDetail,
      closeHapticTest,
      closePauseModal,
      closeSettings,
      closeTemplatesScreen,
      commitFocusHabitOnHome,
      markFocusHabitReady,
      openHapticTest,
      openSettings,
      openTemplatesScreen,
      prepareFocusHabitOnHome,
    ]
  );
}
