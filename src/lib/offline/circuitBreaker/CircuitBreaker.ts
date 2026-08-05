/**
 * Circuit Breaker Implementation
 */

import type {
  CircuitBreakerConfig,
  CircuitBreakerStatus,
  ClassifiedError,
  ErrorCategory,
} from '../types';
import { DEFAULT_CIRCUIT_CONFIG } from './config';
import {
  createInitialState,
  transitionState,
  shouldTransitionToHalfOpen,
  shouldTransitionToClosed,
  shouldTransitionToOpen,
  type CircuitStateData,
} from './state';

export class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private data: CircuitStateData;
  private listeners = new Set<(status: CircuitBreakerStatus) => void>();

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CIRCUIT_CONFIG, ...config };
    this.data = createInitialState();
  }

  getStatus(): CircuitBreakerStatus {
    return { ...this.data };
  }

  canExecute(): boolean {
    if (this.data.state === 'closed') return true;
    if (
      this.data.state === 'open' &&
      shouldTransitionToHalfOpen(this.data, this.config)
    ) {
      this.data = transitionState(this.data, 'half-open');
      return true;
    }
    return this.data.state === 'half-open';
  }

  recordSuccess(): void {
    if (this.data.state === 'half-open') {
      this.data.successCount++;
      if (shouldTransitionToClosed(this.data, this.config))
        this.data = transitionState(this.data, 'closed');
    } else if (this.data.state === 'closed') this.data.failureCount = 0;
    this.notifyListeners();
  }

  recordFailure(error: ClassifiedError): boolean {
    if (
      this.config.triggerCategories &&
      !this.config.triggerCategories.includes(error.category)
    )
      return false;
    this.data.lastFailureAt = Date.now();
    if (this.data.state === 'half-open') {
      this.data = transitionState(this.data, 'open');
      this.notifyListeners();
      return true;
    }
    if (this.data.state === 'closed') {
      this.data.failureCount++;
      if (shouldTransitionToOpen(this.data, this.config)) {
        this.data = transitionState(this.data, 'open');
        this.notifyListeners();
        return true;
      }
    }
    this.notifyListeners();
    return false;
  }

  reset(): void {
    this.data = transitionState(this.data, 'closed');
    this.notifyListeners();
  }

  subscribe(listener: (status: CircuitBreakerStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getTimeUntilReset(): number {
    if (this.data.state !== 'open' || !this.data.openedAt) return 0;
    return Math.max(
      0,
      this.config.resetTimeoutMs - (Date.now() - this.data.openedAt)
    );
  }

  shouldTrigger(category: ErrorCategory): boolean {
    return (
      !this.config.triggerCategories ||
      this.config.triggerCategories.includes(category)
    );
  }

  private notifyListeners(): void {
    const status = this.getStatus();
    for (const l of this.listeners) {
      try {
        l(status);
      } catch {
        /* ignore */
      }
    }
  }
}
