import type { OfflineOperation, OfflineOperationType } from '../../offline';

export type OfflineMutationPayload<T extends OfflineOperationType> =
  OfflineOperation<T>['payload'];

export interface OfflineMutationOptions<T extends OfflineOperationType> {
  applyOptimistic?: (
    operationId: string,
    payload: OfflineMutationPayload<T>
  ) => void;
  confirmOptimistic?: (operationId: string) => void;
  failOptimistic?: (operationId: string, error: Error) => void;
  isOnline: boolean;
}

export type OfflineMutationResult<TResult> =
  | { kind: 'queued'; operationId: string }
  | { kind: 'synced'; operationId: string; value: TResult };
