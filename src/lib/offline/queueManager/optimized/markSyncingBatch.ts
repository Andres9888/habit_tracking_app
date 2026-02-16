import type { OfflineQueueState, QueueEvent } from '../../queue';
import { calculateStats } from '../helpers';
import type { BatchStatusResult } from './types';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;
type EmitFn = (event: QueueEvent) => void;

export function createMarkSyncingBatch(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return function markSyncingBatch(operationIds: string[]): BatchStatusResult {
    if (operationIds.length === 0)
      return { failed: [], notFound: [], succeeded: [] };
    const state = getState();
    const idsToUpdate = new Set(operationIds);
    const result: BatchStatusResult = {
      failed: [],
      notFound: [],
      succeeded: [],
    };
    const now = Date.now();
    const newOperations = state.operations.map((op) => {
      if (idsToUpdate.has(op.id)) {
        result.succeeded.push(op.id);
        idsToUpdate.delete(op.id);
        return { ...op, lastAttemptAt: now, status: 'syncing' as const };
      }
      return op;
    });
    result.notFound = [...idsToUpdate];
    if (result.succeeded.length > 0) {
      setState({ ...state, operations: newOperations });
      notify();
      emit({
        count: result.succeeded.length,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'queue:batch_syncing',
      });
    }
    return result;
  };
}
