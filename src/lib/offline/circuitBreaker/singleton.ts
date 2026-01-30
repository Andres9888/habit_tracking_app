/**
 * Circuit Breaker Singleton and Factory
 */

import type { CircuitBreakerConfig } from '../types';
import { CircuitBreaker } from './CircuitBreaker';

/**
 * Create a circuit breaker with custom config
 */
export function createCircuitBreaker(
  config?: Partial<CircuitBreakerConfig>
): CircuitBreaker {
  return new CircuitBreaker(config);
}

/** Default singleton circuit breaker for offline sync */
let defaultCircuitBreaker: CircuitBreaker | null = null;

export function getDefaultCircuitBreaker(): CircuitBreaker {
  if (!defaultCircuitBreaker) {
    defaultCircuitBreaker = new CircuitBreaker();
  }
  return defaultCircuitBreaker;
}

/**
 * Reset the default circuit breaker (useful for testing)
 */
export function resetDefaultCircuitBreaker(): void {
  defaultCircuitBreaker?.reset();
}
