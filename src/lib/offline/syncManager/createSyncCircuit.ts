import {
  createCircuitBreaker,
  DEFAULT_CIRCUIT_CONFIG,
  type CircuitBreaker,
} from '../circuitBreaker';
import type { RetryStrategy, SyncEventType } from '../types';
import { DEFAULT_RETRY_STRATEGY } from '../retryStrategy';
import type { OfflineSyncManagerConfig } from './types';

export function createSyncCircuit(
  config: OfflineSyncManagerConfig,
  emit: (type: SyncEventType, data?: Record<string, unknown>) => void
): {
  circuitBreaker: CircuitBreaker;
  retryStrategy: RetryStrategy;
  cleanup: () => void;
} {
  const retryStrategy: RetryStrategy = {
    ...DEFAULT_RETRY_STRATEGY,
    ...config.retryStrategy,
  };
  const circuitBreaker = createCircuitBreaker({
    ...DEFAULT_CIRCUIT_CONFIG,
    ...config.circuitBreaker,
  });
  const unsubscribe = circuitBreaker.subscribe(({ state }) => {
    switch (state) {
      case 'open': {
        emit('circuit:open');
        break;
      }
      case 'closed': {
        emit('circuit:close');
        break;
      }
      case 'half-open': {
        emit('circuit:half-open');
        break;
      }
    }
  });
  return { circuitBreaker, retryStrategy, cleanup: unsubscribe };
}
