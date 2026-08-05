/**
 * Optimistic Update Infrastructure
 *
 * Provides immediate UI feedback before server confirmation,
 * improving perceived performance especially on slow networks.
 *
 * @example
 * ```typescript
 * // In a component
 * const optimisticToggle = useOptimisticToggleMutation(
 *   toggleHabitMutation,
 *   (habitId, date) => getHabitStatus(habitId, date) === 'done'
 * );
 *
 * // Toggle with optimistic update
 * await optimisticToggle({ habitId, date });
 *
 * // Check optimistic state in render
 * const pendingToggle = useOptimisticToggle(habitId, date);
 * const isCompleted = pendingToggle ?? serverCompleted;
 * ```
 */

export { optimisticStore } from './store';

export { runOfflineAwareMutation } from './runOfflineAwareMutation';
export type {
  OfflineAwareMutationOptions,
  OfflineAwareMutationResult,
} from './runOfflineAwareMutation';

export {
  useOptimisticStore,
  usePendingToggles,
  usePendingHiddenHabitIds,
  useHasPendingOperations,
  useOptimisticToggle,
  useOptimisticArchive,
  useOptimisticPause,
  useOptimisticReorder,
  useOptimisticToggleMutation,
  useOptimisticArchiveMutation,
  useOptimisticUnarchiveMutation,
  useOptimisticReorderMutation,
  useOptimisticPauseMutation,
} from './hooks';

export type {
  OptimisticState,
  OptimisticOperation,
  OptimisticStore,
  OptimisticCallbacks,
  OptimisticMutationOptions,
  OptimisticMutationResult,
  OperationType,
  OperationPayload,
  ToggleOperationPayload,
  ArchiveOperationPayload,
  ReorderOperationPayload,
  PauseOperationPayload,
} from './types';

// T010: Offline queue integration types
export type { OptimisticToggleOptions, ToggleMutationResult } from './hooks';
