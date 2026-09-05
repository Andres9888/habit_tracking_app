/**
 * Habit Strength Module - Barrel Export
 * Strength calculation system based on momentum formula (v2.0)
 *
 * This module has been decomposed into focused files:
 *
 * Core Logic (≤100 lines each):
 * - habitStrength/constants.ts: Configuration values
 * - habitStrength/types.ts: Type definitions
 * - habitStrength/dateUtils.ts: Date manipulation helpers
 * - habitStrength/momentum.ts: Momentum-based strength calculation
 * - habitStrength/strengthLevel.ts: Level determination
 * - habitStrength/logistic.ts: Logistic baseline curve
 * - habitStrength/compliance.ts: 30-day compliance calculation
 * - habitStrength/snapshot.ts: Strength snapshot generation
 * - habitStrength/legacyFormula.ts: Klein model (backwards compat)
 *
 * Convex Mutations:
 * - habitStrength/updateStrength.ts: Update strength (deprecated)
 * - habitStrength/recalculate.ts: Recalculate from history
 * - habitStrength/updateParams.ts: Update parameters
 *
 * Convex Queries:
 * - habitStrength/getStrengthInfo.ts: Get detailed strength info
 * - habitStrength/allHabitsStats.ts: Stats across all habits
 *
 * @see docs/DECOMPOSITION_PATTERNS.md for decomposition guidelines
 */

// ─────────────────────────────────────────────────────────────────────────────
// Algorithm Config
// ─────────────────────────────────────────────────────────────────────────────
export type {
  AlgorithmParams,
  StrengthAlgorithmMode,
} from './habitStrength/algorithmConfig';
export {
  ALGORITHM_CONFIGS,
  getAlgorithmConfig,
  resolveAlgorithmMode,
} from './habitStrength/algorithmConfig';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
export {
  BASE_DECAY,
  CONTEXT_CONSISTENCY,
  DEFAULT_HABIT_DECAY_PARAM,
  DEFAULT_HABIT_GAIN_PARAM,
  GROWTH_RATE,
} from './habitStrength/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type {
  HabitStrengthSnapshot,
  HabitTrackingRecord,
  StrengthLevel,
  StrengthLevelInfo,
} from './habitStrength/types';
export { STRENGTH_LEVELS } from './habitStrength/types';

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────
export {
  calculateMomentumStrengthSnapshot,
  calculateNewStrength,
} from './habitStrength/momentum';
export { getStrengthLevel } from './habitStrength/strengthLevel';
export { generateHabitStrengthSnapshot } from './habitStrength/snapshot';
export {
  calculateHabitStrength,
  calculateMemoryAccessibility,
  predictCompletionProbability,
} from './habitStrength/legacyFormula';

// ─────────────────────────────────────────────────────────────────────────────
// Mutation exports (internal: no client caller, keep off the public API)
// ─────────────────────────────────────────────────────────────────────────────
export { updateHabitStrength } from './habitStrength/updateStrength';
export { recalculateHabitStrength } from './habitStrength/recalculate';
export { updateHabitParameters } from './habitStrength/updateParams';

// ─────────────────────────────────────────────────────────────────────────────
// Query exports
// ─────────────────────────────────────────────────────────────────────────────
export { getHabitStrengthInfo } from './habitStrength/getStrengthInfo';
export { getAllHabitsStrengthStats } from './habitStrength/allHabitsStats';
