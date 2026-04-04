/**
 * Optimistic update hooks
 */

export { useOptimisticStore } from './useOptimisticStore';

export {
  useHasPendingOperations,
  useOptimisticToggle,
  useOptimisticArchive,
  useOptimisticDelete,
  useOptimisticPause,
  useOptimisticReorder,
} from './useOptimisticState';

export {
  useOptimisticToggleMutation,
  useOptimisticArchiveMutation,
  useOptimisticUnarchiveMutation,
  useOptimisticDeleteMutation,
} from './useOptimisticMutations';

export type {
  OptimisticToggleOptions,
  ToggleMutationResult,
  DeleteMutationResult,
} from './useOptimisticMutations';

export {
  useOptimisticReorderMutation,
  useOptimisticPauseMutation,
} from './useOptimisticReorderMutation';
