/**
 * Habit Strength Constants
 * Configuration values for strength calculations
 */

// Legacy Klein-model constants kept for compatibility with older tooling/tests.
export const DEFAULT_HABIT_DECAY_PARAM = 0.02;
export const DEFAULT_HABIT_GAIN_PARAM = 0.15;
export const CONTEXT_CONSISTENCY = 1;

// Memory Accessibility Parameters (Tobias, 2009; Zhang et al., 2021)
export const DEFAULT_ACCESSIBILITY_DECAY_PARAM = 0.3;
export const DEFAULT_ACCESSIBILITY_GAIN_BEHAVIOR = 0.5;
export const DEFAULT_ACCESSIBILITY_GAIN_REMINDER = 0.7;

// Momentum-based formula constants (balanced mode defaults)
export const GROWTH_RATE = 0.03;
export const BASE_DECAY = 0.02;

// Time constants
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Logistic curve parameters (calibrated for ~22% at day 7)
export const LOGISTIC_SLOPE = 0.070_611_882_210_432_05;
export const LOGISTIC_MIDPOINT = 24.924_269_028_255_548;
export const LOGISTIC_TARGET_DAY = 90;

// Compliance window settings
export const COMPLIANCE_WINDOW_DAYS = 30;
export const COMPLIANCE_PRIOR_ALPHA = 1;
export const COMPLIANCE_PRIOR_BETA = 1;
