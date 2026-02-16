/**
 * Centralized Error Messages
 *
 * All user-facing error strings in one place for consistency,
 * maintainability, and future i18n support.
 *
 * Categories:
 * - AUTH: Authentication and sign-in errors
 * - NETWORK: Connection and network-related errors
 * - DATA_OPS: Data operations (save, create, delete, update)
 * - VALIDATION: Form validation errors
 * - PERMISSIONS: Authorization and permission errors
 * - CONVEX: Backend/server errors
 * - UI: User interface errors
 */

/* eslint-disable max-lines */

export const ERROR_MESSAGES = {
  // ============================================
  // AUTH ERRORS
  // ============================================
  AUTH: {
    // Sign in errors
    SIGN_IN_FAILED: 'Unable to sign in. Please check your connection and try again.',
    SIGN_IN_INVALID_EMAIL: 'Please enter a valid email address',
    SIGN_IN_NETWORK: 'Unable to connect. Please check your internet connection and try again.',
    SIGN_IN_CANCELLED: 'Sign in was cancelled.',
    SIGN_IN_ALREADY_SIGNED_IN: 'You are already signed in.',
    SIGN_IN_EXTERNAL_ACCOUNT_EXISTS:
      'This account is already linked to another sign-in method. Try signing in with that method instead.',
    SIGN_IN_EXTERNAL_ACCOUNT_NOT_FOUND:
      "We couldn't find an account linked to that method. Would you like to create one instead?",
    SIGN_IN_EMAIL_NOT_FOUND:
      "We couldn't access your email. Try signing in with a different method, or create a new account.",
    SIGN_IN_INVALID_CREDENTIALS: "That email or password doesn't look right. Please check and try again.",
    SIGN_IN_ACCOUNT_LOCKED: 'Your account is temporarily locked. Please wait a moment and try again.',
    SIGN_IN_RATE_LIMITED: 'Too many attempts. Please wait a moment before trying again.',

    // Sign up errors
    SIGN_UP_FAILED: 'Unable to create account. Please check your connection and try again.',
    SIGN_UP_EMAIL_EXISTS: 'An account with this email already exists. Would you like to sign in instead?',
    SIGN_UP_VERIFICATION_INCOMPLETE:
      'Verification incomplete. Please check your email for the verification link.',
    SIGN_UP_WEAK_PASSWORD: 'Password is too weak. Try mixing letters, numbers, and symbols.',

    // Sign out errors
    SIGN_OUT_FAILED: 'Unable to sign out right now. Please try again.',

    // Password reset
    PASSWORD_RESET_FAILED: 'Unable to send reset email. Please check your connection and try again.',
    PASSWORD_RESET_EMAIL_SENT:
      'Check your email for a link to reset your password.',

    // General auth
    SESSION_EXPIRED: 'Your session expired. Please sign in again to continue.',
    UNAUTHENTICATED: 'Please sign in to continue.',
  },

  // ============================================
  // NETWORK ERRORS
  // ============================================
  NETWORK: {
    CONNECTION_ISSUE: 'Unable to connect. Please check your internet connection and try again.',
    CONNECTION_TIMEOUT: 'This is taking longer than expected. Please check your connection and try again.',
    SERVER_ERROR: 'Our servers are temporarily busy. Please wait a moment and try again.',
    FETCH_FAILED: 'Unable to reach our servers. Please check your internet connection and try again.',
    OFFLINE: "You're currently offline. Your data will sync when you're back online.",
    SLOW_CONNECTION: "This is taking a while. You can continue using the app — we'll keep trying in the background.",
  },

  // ============================================
  // DATA OPERATION ERRORS
  // ============================================
  DATA_OPS: {
    // Generic operations
    SAVE_FAILED:
      "Your changes couldn't be saved. Please check your connection and try again.",
    CREATE_FAILED:
      'Something went wrong. Please check your connection and try again.',
    DELETE_FAILED: "We couldn't complete the action. Please try again.",
    UPDATE_FAILED: 'Failed to update. Please try again.',
    LOAD_FAILED: 'Failed to load data. Please try again.',

    // Habit-specific
    CREATE_HABIT_FAILED: 'Couldn\'t create habit. Please check your connection and try again.',
    SAVE_HABIT_FAILED:
      "Your changes couldn't be saved. Please check your connection and try again.",
    DELETE_HABIT_FAILED:
      'Failed to delete habit. Please try again.',
    ARCHIVE_HABIT_FAILED:
      'Failed to archive habit. Please try again.',
    TOGGLE_HABIT_FAILED:
      'Failed to update habit. Please try again.',
    REORDER_HABITS_FAILED: 'Failed to reorder habits. Please try again.',

    // Note-specific
    SAVE_NOTE_FAILED: 'Failed to save note. Please try again.',
    DELETE_NOTE_FAILED: 'Failed to delete note. Please try again.',

    // Template-specific
    IMPORT_TEMPLATE_FAILED:
      'Failed to import template. Please try again.',
    LOAD_TEMPLATES_FAILED: 'Failed to load templates.',

    // Image/media-specific
    UPLOAD_IMAGE_FAILED: 'Failed to upload image. Please try again.',
    DELETE_IMAGE_FAILED: "We couldn't remove the image. Please try again.",
    IMAGE_NOT_FOUND: 'Image not found.',
    SHARE_CARD_FAILED: 'Failed to share card. Please try again.',
  },

  // ============================================
  // VALIDATION ERRORS
  // ============================================
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PASSWORD: 'Please enter a valid password.',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
    NAME_TOO_LONG: 'Name is too long. Please shorten it.',
    INVALID_DATE_FORMAT: 'Invalid date format. Please use YYYY-MM-DD.',
    DURATION_MUST_BE_POSITIVE: 'Duration must be a positive number.',
    DURATION_TOO_LONG: 'Voice note cannot exceed 5 minutes.',
    INVALID_TIME_FORMAT: 'Invalid time format. Use HH:MM 24-hour format.',
    WEEKLY_FREQUENCY_REQUIRED: 'Weekly frequency requires at least one day.',
    INVALID_DAYS_OF_WEEK: 'Invalid days of week. Use numbers 0-6.',
    DECAY_PARAMETER_INVALID: 'Habit decay parameter must be between 0 and 1.',
    GAIN_PARAMETER_INVALID: 'Habit gain parameter must be between 0 and 1.',
  },

  // ============================================
  // PERMISSION/AUTHORIZATION ERRORS
  // ============================================
  PERMISSIONS: {
    NOT_AUTHORIZED: 'You do not have permission to perform this action.',
    NOT_AUTHORIZED_HABIT: 'Not authorized to view this habit.',
    NOT_AUTHORIZED_VOICE_NOTE: 'Not authorized to view this voice note.',
    NOT_AUTHORIZED_IMAGE: 'Not authorized to delete this image.',
    NOT_AUTHORIZED_AFFIRMATION: 'Not authorized to modify this affirmation.',
    NOT_AUTHORIZED_VISION_BOARD: 'Not authorized to add images to this habit.',

    // Resource limits
    VOICE_NOTE_LIMIT_REACHED: 'Voice note limit reached.',
    VISION_BOARD_LIMIT_REACHED: 'Vision board image limit reached.',
    UNAUTHORIZED: 'You must be signed in to perform this action.',
  },

  // ============================================
  // CONVEX/BACKEND ERRORS
  // ============================================
  CONVEX: {
    // Authentication (backend)
    MUST_BE_LOGGED_IN: 'Must be logged in to perform this action.',
    UNAUTHENTICATED: 'Unauthenticated: Must be logged in.',

    // Resource not found
    HABIT_NOT_FOUND: 'Habit not found.',
    AFFIRMATION_NOT_FOUND: 'Affirmation not found.',
    VOICE_NOTE_NOT_FOUND: 'Voice note not found.',
    IMAGE_NOT_FOUND: 'Image not found.',
    STORAGE_FILE_NOT_FOUND: 'Storage file not found.',

    // Invalid operations
    INVALID_DATE_FORMAT: 'Invalid date format; expected YYYY-MM-DD',
    INVALID_DATE_VALUE: 'Invalid date value; expected YYYY-MM-DD',
    AUDIO_URL_REQUIRED: 'Audio URL is required.',
  },

  // ============================================
  // SYNC ERRORS
  // ============================================
  SYNC: {
    FAILED: 'Sync failed. Your data will retry when you\'re back online.',
    OFFLINE_SAVE: 'Your habit will be saved when you\'re back online.',
  },

  // ============================================
  // UI/GENERIC ERRORS
  // ============================================
  UI: {
    GENERIC_ERROR: 'Something unexpected happened. Please try again.',
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
    TRY_AGAIN: 'Please try again.',
    RETRY_FAILED: 'Still having trouble. Please check your connection and try again.',
    LOADING_FAILED: 'Unable to load. Please check your connection and try again.',
    TAKING_A_WHILE: 'This is taking longer than usual. Hang on...',
    OPERATION_TOO_LONG: 'This is taking longer than expected. Would you like to keep waiting or try again?',
  },
} as const;

// ============================================
// TYPE EXPORTS FOR ERROR CATEGORIES
// ============================================

export type AuthErrorKey = keyof typeof ERROR_MESSAGES.AUTH;
export type NetworkErrorKey = keyof typeof ERROR_MESSAGES.NETWORK;
export type DataOpsErrorKey = keyof typeof ERROR_MESSAGES.DATA_OPS;
export type ValidationErrorKey = keyof typeof ERROR_MESSAGES.VALIDATION;
export type PermissionsErrorKey = keyof typeof ERROR_MESSAGES.PERMISSIONS;
export type ConvexErrorKey = keyof typeof ERROR_MESSAGES.CONVEX;
export type SyncErrorKey = keyof typeof ERROR_MESSAGES.SYNC;
export type UIErrorKey = keyof typeof ERROR_MESSAGES.UI;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get auth error message by key
 */
export function getAuthError(key: AuthErrorKey): string {
  return ERROR_MESSAGES.AUTH[key];
}

/**
 * Get network error message by key
 */
export function getNetworkError(key: NetworkErrorKey): string {
  return ERROR_MESSAGES.NETWORK[key];
}

/**
 * Get data operation error message by key
 */
export function getDataOpsError(key: DataOpsErrorKey): string {
  return ERROR_MESSAGES.DATA_OPS[key];
}

/**
 * Get validation error message by key
 */
export function getValidationError(key: ValidationErrorKey): string {
  return ERROR_MESSAGES.VALIDATION[key];
}

/**
 * Get permissions error message by key
 */
export function getPermissionsError(key: PermissionsErrorKey): string {
  return ERROR_MESSAGES.PERMISSIONS[key];
}

/**
 * Get convex error message by key
 */
export function getConvexError(key: ConvexErrorKey): string {
  return ERROR_MESSAGES.CONVEX[key];
}

/**
 * Get sync error message by key
 */
export function getSyncError(key: SyncErrorKey): string {
  return ERROR_MESSAGES.SYNC[key];
}

/**
 * Get UI error message by key
 */
export function getUIError(key: UIErrorKey): string {
  return ERROR_MESSAGES.UI[key];
}

export default ERROR_MESSAGES;
