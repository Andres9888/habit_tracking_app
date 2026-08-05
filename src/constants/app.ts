/**
 * App-wide Constants
 *
 * Centralized magic numbers and configuration values.
 * This helps maintain consistency and makes values easier to adjust.
 */

// ============================================================================
// ANIMATION DURATIONS (ms)
// ============================================================================

/** Duration for new habit highlight animation */
export const NEW_HABIT_HIGHLIGHT_MS = 3000;

/** Brief delay before triggering entrance animation to allow layout */
export const ENTRANCE_ANIMATION_DELAY_MS = 50;

/** Stagger delay between list items */
export const ENTRANCE_STAGGER_DELAY = 50;

/** Delay before celebration transition */
export const CELEBRATION_DELAY_MS = 1800;

/** Auto-dismiss delay for toasts/notifications */
export const AUTO_DISMISS_DELAY_MS = 5000;

/** Toast/snackbar default duration */
export const TOAST_DURATION_MS = 5000;

/** Delay before lazy providers are mounted (ms) */
export const LAZY_PROVIDER_MOUNT_DELAY_MS = 100;

// ============================================================================
// FAB (Floating Action Button) Animation Durations (ms)
// ============================================================================

export const FAB = {
  pressScaleDuration: 110,
  pressReleaseDuration: 160,
  rippleScaleDuration: 320,
  rippleOpacityDuration: 320,
  bounceInDuration: 260,
  bounceOutDuration: 520,
  initialBounceDelay: 1200,
} as const;

// ============================================================================
// LIST ANIMATIONS
// ============================================================================

/** Habit list header animation duration */
export const LIST_HEADER_ANIMATION_DURATION_MS = 350;

/** Sort bottom sheet close animation duration */
export const SORT_SHEET_CLOSE_DURATION_MS = 250;

// ============================================================================
// GESTURE THRESHOLDS
// ============================================================================

/** Gesture threshold for bottom sheet dismissal (pixels) */
export const DISMISS_THRESHOLD = 100;

/** Velocity threshold for swipe dismiss (px/s) */
export const VELOCITY_THRESHOLD = 800;

// ============================================================================
// LIMITS & COUNTS
// ============================================================================

/** Free tier habit limit */
export const FREE_HABIT_LIMIT = 3;

/** Maximum suggestions shown in empty state */
export const MAX_SUGGESTIONS = 4;

/** Maximum recent emojis to store */
export const MAX_RECENT_EMOJIS = 10;

// ============================================================================
// NETWORK & SYNC
// ============================================================================

/** Default reconnect delay when network is restored (ms) */
export const DEFAULT_RECONNECT_DELAY_MS = 1000;

// ============================================================================
// VALIDATION LIMITS
// ============================================================================

/** Maximum email length (RFC 5321) */
export const MAX_EMAIL_LENGTH = 254;

/** Maximum habit name length */
export const MAX_HABIT_NAME_LENGTH = 100;

/** Minimum habit name length after trimming */
export const MIN_HABIT_NAME_LENGTH = 1;

/** Maximum length for long text fields */
export const MAX_LONG_TEXT_LENGTH = 5000;

/** Maximum length for short text fields */
export const MAX_SHORT_TEXT_LENGTH = 500;

/** Minimum password length */
export const MIN_PASSWORD_LENGTH = 8;

// ============================================================================
// STORE REVIEW / RATINGS
// ============================================================================

/** Cooldown period between rating prompts (days) */
export const RATING_COOLDOWN_DAYS = 90;

/** Minimum completions before prompting for rating */
export const MIN_COMPLETIONS_FOR_RATING = 5;

// ============================================================================
// STREAK CALCULATION
// ============================================================================

/** Maximum days to look back for streak calculation (> 1 year) */
export const STREAK_MAX_LOOKBACK_DAYS = 400;

/** Guardrail for rendering very large habit lists in a single pass */
export const MAX_HABITS_RENDER_LIMIT = 500;

// ============================================================================
// INPUT CHARACTER LIMITS (UI Feedback Thresholds)
// ============================================================================

/** Warning threshold for input length (shows warning color) */
export const INPUT_WARNING_LENGTH = 35;

/** Error threshold for input length (shows error color) */
export const INPUT_ERROR_LENGTH = 45;
