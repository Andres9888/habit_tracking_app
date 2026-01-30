/**
 * Circuit Breaker Module
 */

export { DEFAULT_CIRCUIT_CONFIG } from './config';
export { CircuitBreaker } from './CircuitBreaker';
export {
  createCircuitBreaker,
  getDefaultCircuitBreaker,
  resetDefaultCircuitBreaker,
} from './singleton';
