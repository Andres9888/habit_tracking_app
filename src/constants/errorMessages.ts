/* eslint-disable max-lines */
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

export const ERROR_MESSAGES = {
  // ============================================
  // AUTH ERRORS
  // ============================================
  AUTH: {
    // Sign in errors
    SIGN_IN_FAILED: 'Couldn\'t sign you in. Try again in a moment.',
    SIGN_IN_INVALID_EMAIL: 'That email address doesn\'t look right. Try again?',
    SIGN_IN_NETWORK: 'No internet connection. Check your connection and try again.',
    SIGN_IN_CANCELLED: 'Sign in was cancelled.',
    SIGN_IN_ALREADY_SIGNED_IN: 'You\'re already signed in.',
    SIGN_IN_EXTERNAL_ACCOUNT_EXISTS:
      'That account is linked to another user. Try signing in with your original account.',
    SIGN_IN_EXTERNAL_ACCOUNT_NOT_FOUND:
      'Couldn\'t verify your account. Try again in a moment.',
    SIGN_IN_EMAIL_NOT_FOUND:
      "Couldn't find that email. Try a different sign-in method?",

    // Sign up errors
    SIGN_UP_FAILED: 'Couldn\'t create your account. Try again in a moment.',
    SIGN_UP_EMAIL_EXISTS: 'An account with that email already exists. Try signing in?',
    SIGN_UP_VERIFICATION_INCOMPLETE:
      'Couldn\'t verify your account. Try again in a moment.',
    SIGN_UP_WEAK_PASSWORD: 'That password is a bit weak. Try something stronger!',

    // Sign out errors
    SIGN_OUT_FAILED: 'Couldn\'t sign you out. Try again in a moment.',

    // Password reset
    PASSWORD_RESET_FAILED: 'Couldn\'t send reset email. Try again in a moment.',
    PASSWORD_RESET_EMAIL_SENT:
      'If an account exists with that email, you\'ll receive a reset link.',

    // General auth
    SESSION_EXPIRED: 'Your session expired. Sign in again to continue.',
    UNAUTHENTICATED: 'Sign in to continue.',
  },

  // ============================================
  // NETWORK ERRORS
  // ============================================
  NETWORK: {
    CONNECTION_ISSUE: 'Unable to connect. Check your internet and try again.',
    CONNECTION_TIMEOUT: 'Connection timed out. Try again in a moment.',
    SERVER_ERROR: 'Our servers are taking a quick break. Try again in a few minutes.',
    FETCH_FAILED: 'Can't reach the server right now. Check your connection and try again.',
  },

  // ============================================
  // DATA OPERATION ERRORS
  // ============================================
  DATA_OPS: {
    // Generic operations
    SAVE_FAILED:
      "Couldn't save your changes. Check your connection and try again.",
    CREATE_FAILED:
      'Something went wrong. Check your connection and try again.',
    DELETE_FAILED: "Unable to complete this action. Please try again.",
    UPDATE_FAILED: 'Update failed. Please try again.',
    LOAD_FAILED: 'Unable to load. Please try again.',

    // Habit-specific
    CREATE_HABIT_FAILED: 'Couldn\'t create your habit. Check your connection and try again.',
    SAVE_HABIT_FAILED:
      "Couldn't save your changes. Check your connection and try again.",
    DELETE_HABIT_FAILED:
      'Unable to delete this habit. Try again in a moment.',
    ARCHIVE_HABIT_FAILED:
      'Unable to archive this habit. Try again in a moment.',
    TOGGLE_HABIT_FAILED:
      'Couldn't update your habit. Please try again.',
    REORDER_HABITS_FAILED: 'Unable to reorder. Try again in a moment.',

    // Note-specific
    SAVE_NOTE_FAILED: 'Couldn't save your note. Try again.',
    DELETE_NOTE_FAILED: 'Unable to delete this note. Try again.',

    // Template-specific
    IMPORT_TEMPLATE_FAILED:
      'Couldn't import this template. Try again.',
    LOAD_TEMPLATES_FAILED: 'Unable to load templates. Check your connection.',

    // Image/media-specific
    UPLOAD_IMAGE_FAILED: 'Image upload failed. Try again.',
    DELETE_IMAGE_FAILED: "Couldn't remove the image. Try again.",
    IMAGE_NOT_FOUND: 'This image no longer exists.',
    SHARE_CARD_FAILED: 'Unable to share. Try again.',
  },

  // ============================================
  // VALIDATION ERRORS
  // ============================================
  VALIDATION: {
    REQUIRED_FIELD: 'This field can\'t be empty.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PASSWORD: 'Please enter a valid password.',
    PASSWORD_TOO_SHORT: 'Password should be at least 8 characters.',
    NAME_TOO_LONG: 'That name is a bit long — can you shorten it?',
    INVALID_DATE_FORMAT: 'Invalid date format. Please use YYYY-MM-DD.',
    DURATION_MUST_BE_POSITIVE: 'Duration must be a positive number.',
    DURATION_TOO_LONG: 'Voice note cannot exceed 5 minutes.',
    INVALID_TIME_FORMAT: 'Invalid time format. Use HH:MM 24-hour format.',
    WEEKLY_FREQUENCY_REQUIRED: 'Please select at least one day.',
    INVALID_DAYS_OF_WEEK: 'Invalid days of week. Use numbers 0-6.',
    DECAY_PARAMETER_INVALID: 'Habit decay parameter must be between 0 and 1.',
    GAIN_PARAMETER_INVALID: 'Habit gain parameter must be between 0 and 1.',
  },

  // ============================================
  // PERMISSION/AUTHORIZATION ERRORS
  // ============================================
  PERMISSIONS: {
    NOT_AUTHORIZED: 'You don't have permission to do this.',
    NOT_AUTHORIZED_HABIT: 'You can't view this habit.',
    NOT_AUTHORIZED_VOICE_NOTE: 'You can't view this voice note.',
    NOT_AUTHORIZED_IMAGE: 'You can't delete this image.',
    NOT_AUTHORIZED_AFFIRMATION: 'You can't modify this affirmation.',
    NOT_AUTHORIZED_VISION_BOARD: 'You can't add images to this habit.',

    // Resource limits
    VOICE_NOTE_LIMIT_REACHED: 'You've reached your voice note limit.',
    VISION_BOARD_LIMIT_REACHED: 'You've reached your vision board image limit.',
    UNAUTHORIZED: 'Sign in to continue.',
  },

  // ============================================
  // CONVEX/BACKEND ERRORS
  // ============================================
  CONVEX: {
    // Authentication (backend)
    MUST_BE_LOGGED_IN: 'Must be logged in to perform this action.',
    UNAUTHENTICATED: 'Unauthenticated: Must be logged in.',

    // Resource not found
    HABIT_NOT_FOUND: 'Couldn\'t find that habit.',
    AFFIRMATION_NOT_FOUND: 'Couldn\'t find that affirmation.',
    VOICE_NOTE_NOT_FOUND: 'Couldn\'t find that voice note.',
    IMAGE_NOT_FOUND: 'Couldn\'t find that image.',
    STORAGE_FILE_NOT_FOUND: 'Couldn\'t find that file.',

    // Invalid operations
    INVALID_DATE_FORMAT: 'Invalid date format. Please use YYYY-MM-DD.',
    INVALID_DATE_VALUE: 'Invalid date value. Please use YYYY-MM-DD.',
    AUDIO_URL_REQUIRED: 'Audio URL is required.',
  },

  // ============================================
  // SYNC ERRORS
  // ============================================
  SYNC: {
    FAILED: 'Couldn\'t sync right now. Don\'t worry — your data is safe and will sync when you\'re back online.',
    OFFLINE_SAVE: 'Saved locally. Will sync when you\'re back online.',
  },

  // ============================================
  // UI/GENERIC ERRORS
  // ============================================
  UI: {
    GENERIC_ERROR: 'Something unexpected happened. Try again in a moment.',
    SOMETHING_WENT_WRONG: 'Something went wrong. Try again in a moment.',
    TRY_AGAIN: 'Try Again',
    RETRY_FAILED: 'Still having trouble? Try again in a moment.',
    LOADING_FAILED: 'Couldn\'t load that. Check your connection and try again.',
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
