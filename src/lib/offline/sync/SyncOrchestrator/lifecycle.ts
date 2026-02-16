import type {
  SyncOrchestratorEvent,
  SyncOrchestratorEventListener,
} from '../types';

export function createEmitter(listeners: Set<SyncOrchestratorEventListener>) {
  return function emit(
    type: SyncOrchestratorEvent['type'],
    data?: SyncOrchestratorEvent['data']
  ): void {
    const event: SyncOrchestratorEvent = { data, timestamp: Date.now(), type };
    for (const l of listeners) {
      try {
        l(event);
      } catch {
        /* */
      }
    }
  };
}
