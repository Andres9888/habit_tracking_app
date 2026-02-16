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
    SIGN_IN_INVALID_EMAIL: 'That email address doesn\'t look right',
    SIGN_IN_NETWORK: 'No internet connection. Check your connection and try again.',
    SIGN_IN_CANCELLED: 'Sign in was cancelled.',
    SIGN_IN_ALREADY_SIGNED_IN: 'You\'re already signed in.',
    SIGN_IN_EXTERNAL_ACCOUNT_EXISTS:
      'That account is linked to another user. Try signing in with your original account.',
    SIGN_IN_EXTERNAL_ACCOUNT_NOT_FOUND:
      'Couldn\'t verify your account. Try again in a moment.',
    SIGN_IN_EMAIL_NOT_FOUND:
      "Couldn't find your email. Try a different sign-in method.",

    // Sign up errors
    SIGN_UP_FAILED: 'Couldn\'t create your account. Try again in a moment.',
    SIGN_UP_EMAIL_EXISTS: 'An account with that email already exists.',
    SIGN_UP_VERIFICATION_INCOMPLETE:
      'Couldn\'t verify your account. Try again in a moment.',
    SIGN_UP_WEAK_PASSWORD: 'That password is too weak. Try something stronger.',

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
    CONNECTION_ISSUE: 'No internet connection. Check your connection and try again.',
    CONNECTION_TIMEOUT: 'Taking too long to connect. Check your connection and try again.',
    SERVER_ERROR: 'Our servers are taking a quick break. Try again in a moment.',
    FETCH_FAILED: 'Couldn\'t reach the server. Check your connection and try again.',
  },

  // ============================================
  // DATA OPERATION ERRORS
  // ============================================
  DATA_OPS: {
    // Generic operations
    SAVE_FAILED:
      "Couldn't save your changes. Check your connection and try again.",
    CREATE_FAILED:
      'Something went wrong while creating. Check your connection and try again.',
    DELETE_FAILED: "Couldn't complete that. Try again in a moment.",
    UPDATE_FAILED: 'Couldn\'t update. Try again in a moment.',
    LOAD_FAILED: 'Couldn\'t load that. Check your connection and try again.',

    // Habit-specific
    CREATE_HABIT_FAILED: 'Couldn\'t create your habit. Check your connection and try again.',
    SAVE_HABIT_FAILED:
      "Couldn't save your habit. Check your connection and try again.",
    DELETE_HABIT_FAILED:
      'Couldn\'t delete that habit. Try again in a moment.',
    ARCHIVE_HABIT_FAILED:
      'Couldn\'t archive that habit. Try again in a moment.',
    TOGGLE_HABIT_FAILED:
      'Couldn\'t update that habit. Try again in a moment.',
    REORDER_HABITS_FAILED: 'Couldn\'t reorder your habits. Try again in a moment.',

    // Note-specific
    SAVE_NOTE_FAILED: 'Couldn\'t save your note. Try again in a moment.',
    DELETE_NOTE_FAILED: 'Couldn\'t delete that note. Try again in a moment.',

    // Template-specific
    IMPORT_TEMPLATE_FAILED:
      'Couldn\'t import that template. Try again in a moment.',
    LOAD_TEMPLATES_FAILED: 'Couldn\'t load templates. Check your connection and try again.',

    // Image/media-specific
    UPLOAD_IMAGE_FAILED: 'Couldn\'t upload that image. Try again in a moment.',
    DELETE_IMAGE_FAILED: "Couldn't remove that image. Try again in a moment.",
    IMAGE_NOT_FOUND: 'That image couldn\'t be found.',
    SHARE_CARD_FAILED: 'Couldn\'t share that card. Try again in a moment.',
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
    FAILED: 'Couldn\'t sync right now. Your data is safe and will sync when you\'re back online.',
    OFFLINE_SAVE: 'Saved locally. Will sync when you\'re back online.',
  },

  // ============================================
  // UI/GENERIC ERRORS
  // ============================================
  UI: {
    GENERIC_ERROR: 'Something unexpected happened. Try again in a moment.',
    SOMETHING_WENT_WRONG: 'Something went wrong. Try again in a moment.',
    TRY_AGAIN: 'Try again',
    RETRY_FAILED: 'Still having trouble. Try again in a moment.',
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
