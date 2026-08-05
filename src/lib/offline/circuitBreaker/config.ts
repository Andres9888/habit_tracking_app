/**
 * Circuit Breaker Configuration
 */

import type { CircuitBreakerConfig } from '../types';

/** Default circuit breaker configuration */
export const DEFAULT_CIRCUIT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeoutMs: 30_000, // 30 seconds
  successThreshold: 2,
  triggerCategories: ['network', 'timeout', 'server'],
};
