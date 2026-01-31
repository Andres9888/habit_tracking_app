/**
 * Resolve Single Operation
 *
 * Resolves a single offline operation against server state.
 * Implements US4 (Graceful Conflict Resolution) and FR-010 (completion wins).
 */

import type { OfflineOperation } from '../../queue';
import {
  buildResolutionResult,
  createConflictEvent,
  resolveConflict,
} from './helpers';
import type {
  CompletionStateChecker,
  ConflictEventListener,
  ConflictResolutionResult,
  ConflictResolverConfig,
  ServerCompletionState,
} from './types';

/** Default configuration for conflict resolver */
export const DEFAULT_CONFLICT_RESOLVER_CONFIG: Required<ConflictResolverConfig> =
  {
    checkServerStateBeforeSync: true,
    completionWins: true,
    serverCheckTimeoutMs: 5000,
  };

/** Resolve a single operation against server state */
export async function resolveOperation(
  operation: OfflineOperation<'toggleCompletion'>,
  checkServerState: CompletionStateChecker,
  config: ConflictResolverConfig = {},
  onEvent?: ConflictEventListener
): Promise<ConflictResolutionResult> {
  const mergedConfig = { ...DEFAULT_CONFLICT_RESOLVER_CONFIG, ...config };
  const { payload } = operation;
  const { habitId, date, toCompleted } = payload;

  if (!mergedConfig.checkServerStateBeforeSync) {
    return buildResolutionResult(
      operation.id,
      payload,
      undefined,
      'sync',
      'Server state check disabled - proceeding with sync'
    );
  }

  try {
    const serverCompleted = await checkWithTimeout(
      checkServerState,
      habitId,
      date,
      mergedConfig.serverCheckTimeoutMs
    );

    if (serverCompleted === null) {
      return buildResolutionResult(
        operation.id,
        payload,
        undefined,
        'sync',
        'Could not determine server state - proceeding with sync'
      );
    }

    const serverState: ServerCompletionState = {
      date,
      fetchedAt: Date.now(),
      habitId,
      isCompleted: serverCompleted,
    };
    const { resolution, reason } = resolveConflict(payload, serverState);

    if (toCompleted === serverCompleted && onEvent) {
      emitEvents(operation.id, habitId, date, resolution, reason, onEvent);
    }

    return buildResolutionResult(
      operation.id,
      payload,
      serverState,
      resolution,
      reason
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    if (onEvent) {
      onEvent(
        createConflictEvent('conflict:error', {
          date,
          error: error instanceof Error ? error : new Error(msg),
          habitId,
          operationId: operation.id,
        })
      );
    }
    return buildResolutionResult(
      operation.id,
      payload,
      undefined,
      'sync',
      `Server check failed: ${msg} - proceeding with sync`
    );
  }
}

async function checkWithTimeout(
  check: CompletionStateChecker,
  habitId: any,
  date: string,
  timeout: number
): Promise<boolean | null> {
  return Promise.race([
    check(habitId, date),
    new Promise<null>((_, reject) =>
      setTimeout(
        () => reject(new Error('Server state check timed out')),
        timeout
      )
    ),
  ]);
}

function emitEvents(
  opId: string,
  habitId: any,
  date: string,
  resolution: any,
  reason: string,
  onEvent: ConflictEventListener
): void {
  onEvent(
    createConflictEvent('conflict:detected', {
      date,
      habitId,
      operationId: opId,
      reason,
      resolution,
    })
  );
  if (resolution === 'skip')
    onEvent(
      createConflictEvent('conflict:skip_sync', {
        date,
        habitId,
        operationId: opId,
        reason,
        resolution,
      })
    );
}
