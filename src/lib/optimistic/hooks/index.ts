/**
 * Optimistic update hooks
 */

export { useOptimisticStore, usePendingToggles } from './useOptimisticStore';

export {
  useHasPendingOperations,
  useOptimisticToggle,
  useOptimisticArchive,
  useOptimisticPause,
  useOptimisticReorder,
} from './useOptimisticState';

export {
  useOptimisticToggleMutation,
  useOptimisticArchiveMutation,
  useOptimisticUnarchiveMutation,
} from './useOptimisticMutations';

export type {
  OptimisticToggleOptions,
  ToggleMutationResult,
} from './useOptimisticMutations';

export {
  useOptimisticReorderMutation,
  useOptimisticPauseMutation,
} from './useOptimisticReorderMutation';

export { useOfflineMutation } from './useOfflineMutation';
export { useOfflineArchiveHabit } from './useOfflineArchiveHabit';
export { useOfflinePauseHabit } from './useOfflinePauseHabit';
export { useOfflineRemoveHabit } from './useOfflineRemoveHabit';
export type {
  OfflineMutationOptions,
  OfflineMutationPayload,
  OfflineMutationResult,
} from './useOfflineMutation';
