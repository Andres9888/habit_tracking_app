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
