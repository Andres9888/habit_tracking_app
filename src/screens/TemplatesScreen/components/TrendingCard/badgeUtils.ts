/**
 * Pure derivation functions for trending card badge values.
 * Deterministic: same score → same output. No side effects.
 */

/** Derive a momentum percentage (10-39%) from a popularity score */
export function deriveMomentum(score: number): number {
  return Math.round((score % 30) + 10);
}

/** Derive a stick rate percentage (74-92%) from a popularity score */
export function deriveStickRate(score: number): number {
  return Math.round((score % 19) + 74);
}
