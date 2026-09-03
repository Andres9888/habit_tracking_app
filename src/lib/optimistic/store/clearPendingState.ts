import type {
  OptimisticOperation,
  OptimisticStore,
  ToggleOperationPayload,
  ArchiveOperationPayload,
  PauseOperationPayload,
} from '../types';
import { getToggleKey } from './helpers';

export function clearPendingState(
  state: OptimisticStore,
  operation: OptimisticOperation,
  latestToggleOperationIds: Map<string, string>
): void {
  switch (operation.type) {
    case 'toggle': {
      const payload = operation.payload as ToggleOperationPayload;
      const key = getToggleKey(payload.habitId, payload.date);
      if (latestToggleOperationIds.get(key) !== operation.id) break;
      state.pendingToggles.delete(key);
      latestToggleOperationIds.delete(key);
      break;
    }
    case 'archive': {
      const payload = operation.payload as ArchiveOperationPayload;
      state.pendingArchives.delete(payload.habitId);
      break;
    }
    case 'reorder': {
      state.pendingReorder = null;
      break;
    }
    case 'pause': {
      const payload = operation.payload as PauseOperationPayload;
      state.pendingPauses.delete(payload.habitId);
      break;
    }
  }
}
