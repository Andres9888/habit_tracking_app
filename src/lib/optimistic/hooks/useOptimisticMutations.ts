/**
 * Optimistic mutation wrapper hooks - barrel export
 *
 * Re-exports from decomposed modules to maintain backward compatibility.
 */

export {
  useOptimisticToggleMutation,
  type OptimisticToggleOptions,
  type ToggleMutationResult,
} from './useOptimisticToggleMutation';

export {
  useOptimisticArchiveMutation,
  useOptimisticUnarchiveMutation,
} from './useOptimisticArchiveMutation';
