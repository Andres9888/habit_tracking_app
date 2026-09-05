/**
 * HabitsModalsState Types
 * State interface for the habits modal management
 *
 * @see docs/offline-habit-sync.md T011
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { ToggleMutationResult } from '../../../lib/optimistic';
import type { FocusRekey } from './usePendingFocusHabit';
import type {
  Habit,
  HabitSettings,
  HabitSettingsUpdate,
  HabitTrackingEntry,
  ShareCardData,
} from '../types';

export interface HabitsModalsState {
  celebrationsEnabled: boolean;
  habits: Habit[];
  settings: HabitSettings | undefined;
  showCreateHabit: boolean;
  showEditScreen: boolean;
  showHabitCalendar: boolean;
  showHabitDetail: boolean;
  habitDetailInitialTab: 'progress' | 'motivation' | 'manage';
  showHapticTest: boolean;
  showShareCard: boolean;
  showPauseModal: boolean;
  showTemplatesScreen: boolean;
  showQuickActions: boolean;
  showVisualizationExercise: boolean;
  habitToEdit: Habit | null;
  habitToPause: Habit | null;
  selectedHabit: Habit | null;
  quickActionsHabit: Habit | null;
  shareCardData: ShareCardData | null;
  milestone: unknown;
  tracking: HabitTrackingEntry[];
  showHabitStrengthPercentage: boolean;
  /**
   * Habit the Habit Library asked home to scroll to and highlight, if any.
   * Consumed by HabitsList; expires on its own after FOCUS_GIVE_UP_MS.
   */
  pendingFocusHabitId: Id<'habits'> | null;
  /** True once hidden scroll probes and native neighborhood layout converge. */
  focusReady: boolean;
  /** True after the user commits to leaving the library for Home. */
  focusRequestAutoClose: boolean;
  /** Stable across an optimistic→server id swap; the list remounts on this. */
  focusRequestKey: string | null;
  /** Last id swap, so the list can move its ring to the server row. */
  focusRekey: FocusRekey | null;
  /** Add-habit form: prepare + auto-commit once the row is placed. */
  prepareCreatedHabitFocus: (habitId: Id<'habits'>) => void;
  /** True while the form's request is still converging; the form holds its exit. */
  createdFocusPending: boolean;
  /** Optimistic create synced: point the focus request at the server id. */
  rekeyPendingFocusHabit: (fromId: Id<'habits'>, toId: Id<'habits'>) => void;
  /** Pre-positions Home while the post-import toast remains visible. */
  prepareFocusHabitOnHome: (habitId: Id<'habits'>) => void;
  /** Reveals a prepared target, or runs the cold converge-then-close path. */
  commitFocusHabitOnHome: (habitId: Id<'habits'>) => void;
  /** Marks the current id ready; mismatched stale ids are ignored. */
  markFocusHabitReady: (habitId: Id<'habits'>) => void;
  clearPendingFocusHabit: () => void;
  closeSettings: () => void;
  openSettings: () => void;
  openCreateHabitScreen: () => void;
  onChangeCelebrationsEnabled: (value: boolean) => Promise<void>;
  setShowHabitStrengthPercentage: (value: boolean) => void;
  closeCreateHabit: () => void;
  closeEditScreen: () => void;
  closeHabitCalendar: () => void;
  closeHabitDetail: () => void;
  closeShareCard: () => void;
  closePauseModal: () => void;
  openHapticTest: () => void;
  closeHapticTest: () => void;
  openTemplatesScreen: () => void;
  closeTemplatesScreen: () => void;
  openHabitDetail: (
    habit: Habit,
    initialTab?: 'progress' | 'motivation' | 'manage'
  ) => void;
  openHabitCalendar: (habit: Habit) => void;
  openPauseModal: (habitId: Id<'habits'>) => void;
  openEditHabit: (habit: Habit | null) => void;
  openQuickActions: (habit: Habit) => void;
  closeQuickActions: () => void;
  openVisualizationExercise: (habit: Habit) => void;
  closeVisualizationExercise: () => void;
  onSettingsChange: (updates: Partial<HabitSettingsUpdate>) => Promise<void>;
  onDeleteHabit: (habitId: Id<'habits'>) => Promise<void>;
  onShareMilestone: (data: ShareCardData) => void;
  clearMilestone: () => void;
  confirmPause: () => Promise<void>;
  /** Toggle habit completion with offline queue support (T011) */
  toggleHabit: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<ToggleMutationResult>;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
  reduceMotionPreference: boolean;
}
