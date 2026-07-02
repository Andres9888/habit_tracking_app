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
  operation: OptimisticOperation
): void {
  switch (operation.type) {
    case 'toggle': {
      const payload = operation.payload as ToggleOperationPayload;
      state.pendingToggles.delete(getToggleKey(payload.habitId, payload.date));
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
