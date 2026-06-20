/**
 * Constants Module
 *
 * Central export point for all app constants.
 *
 * Uses explicit named exports for better tree-shaking support.
 * - App: Application-wide magic numbers and configuration
 * - Auth: Authentication configuration
 * - HubermanPhases: Daily energy optimization phases
 * - Motion: Animation timing and springs
 * - STRINGS: UI text strings
 * - UIValues: UI-related magic numbers (opacity, scale, animation durations)
 */

// App constants
export {
  NEW_HABIT_HIGHLIGHT_MS,
  ENTRANCE_ANIMATION_DELAY_MS,
  ENTRANCE_STAGGER_DELAY,
  CELEBRATION_DELAY_MS,
  AUTO_DISMISS_DELAY_MS,
  TOAST_DURATION_MS,
  FAB,
  LIST_HEADER_ANIMATION_DURATION_MS,
  SORT_SHEET_CLOSE_DURATION_MS,
  DISMISS_THRESHOLD,
  VELOCITY_THRESHOLD,
  MAX_SUGGESTIONS,
  MAX_RECENT_EMOJIS,
  DEFAULT_RECONNECT_DELAY_MS,
  MAX_EMAIL_LENGTH,
  MIN_HABIT_NAME_LENGTH,
  MAX_HABIT_NAME_LENGTH,
  MAX_HABITS_RENDER_LIMIT,
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
  MIN_PASSWORD_LENGTH,
  RATING_COOLDOWN_DAYS,
  MIN_COMPLETIONS_FOR_RATING,
  STREAK_MAX_LOOKBACK_DAYS,
  INPUT_WARNING_LENGTH,
  INPUT_ERROR_LENGTH,
} from './app';

// Auth constants
export {
  AUTH_COLORS,
  AUTH_SPACING,
  AUTH_BORDER_RADIUS,
  AUTH_ANIMATION,
  AUTH_TOUCH_TARGET,
  OAUTH_BRAND_COLORS,
} from './auth';

// Error messages
export {
  ERROR_MESSAGES,
  getAuthError,
  getNetworkError,
  getDataOpsError,
  getValidationError,
  getPermissionsError,
  getConvexError,
  getSyncError,
  getUIError,
} from './errorMessages';

export type {
  AuthErrorKey,
  NetworkErrorKey,
  DataOpsErrorKey,
  ValidationErrorKey,
  PermissionsErrorKey,
  ConvexErrorKey,
  SyncErrorKey,
  UIErrorKey,
} from './errorMessages';

// Huberman phases
export {
  HUBERMAN_PHASES,
  PHASE_ORDER,
  getPhaseInfo,
  getPhaseFromPreferredTime,
} from './hubermanPhases';

export type { HubermanPhase, PhaseInfo } from './hubermanPhases';

// External URLs
export { EXTERNAL_URLS } from './urls';

// Motion and strings (default exports)
export { default as Motion } from './motion';
export { default as STRINGS } from './strings';
export * from './ui-values';
