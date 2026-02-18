/**
 * Comprehensive error handling utilities for async operations
 * Provides consistent error messaging and logging across the app
 */

import { Alert } from 'react-native';

export interface ErrorHandlingOptions {
  showAlert?: boolean;
  alertTitle?: string;
  fallbackMessage?: string;
  logError?: boolean;
  onError?: (error: Error) => void;
  isCritical?: boolean;
}

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const NETWORK_ERROR_MESSAGE = 'Network connection failed. Please check your internet.';
const TIMEOUT_ERROR_MESSAGE = 'Request timed out. Please try again.';

/**
 * Check if an error is a network-related error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('offline') ||
      message.includes('connect') ||
      message.includes('timeout')
    );
  }
  return false;
}

/**
 * Extract user-friendly error message from any error type
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (isNetworkError(error)) {
      return NETWORK_ERROR_MESSAGE;
    }

    const message = error.message;
    if (message.includes('Invalid email')) {
      return 'Invalid email address. Please check and try again.';
    }
    if (message.includes('Invalid password')) {
      return 'Invalid password. Please try again.';
    }
    if (message.includes('Password too short')) {
      return 'Password must be at least 8 characters.';
    }
    if (message.includes('sign up')) {
      return 'Sign up failed. Please try again.';
    }
    if (message.includes('sign in')) {
      return 'Sign in failed. Please check your credentials.';
    }

    if (message.includes('ConvexError')) {
      try {
        const cleanMessage = message.replace(/ConvexError:\s*/, '').trim();
        return cleanMessage || DEFAULT_ERROR_MESSAGE;
      } catch {
        return DEFAULT_ERROR_MESSAGE;
      }
    }

    if (message.length > 0 && message.length < 200) {
      return message;
    }

    return DEFAULT_ERROR_MESSAGE;
  }

  if (typeof error === 'string') {
    return error;
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Show error to user via Alert dialog
 */
export function showErrorAlert(
  message: string,
  title: string = 'Error',
  onDismiss?: () => void
): void {
  Alert.alert(title, message, [
    {
      onPress: onDismiss,
      text: 'OK',
    },
  ]);
}

/**
 * Show retry-able error alert
 */
export function showRetryableError(
  message: string,
  onRetry: () => void,
  title: string = 'Error'
): void {
  Alert.alert(title, message, [
    { onPress: onRetry, text: 'Retry' },
    { style: 'cancel', text: 'Cancel' },
  ]);
}

/**
 * Comprehensive error handler for async operations
 */
export function handleAsyncError(
  error: unknown,
  context: string = 'Unknown operation',
  options: ErrorHandlingOptions = {}
): string {
  const {
    showAlert = true,
    alertTitle = 'Error',
    fallbackMessage = DEFAULT_ERROR_MESSAGE,
    logError = true,
    onError,
    isCritical = false,
  } = options;

  const message = extractErrorMessage(error) || fallbackMessage;
  const finalMessage = isCritical ? `Critical: ${message}` : message;

  if (logError) {
    if (__DEV__) {
      console.error(`[${context}]`, error);
    } else {
      console.error(`[${context}]`, finalMessage);
    }
  }

  if (onError && error instanceof Error) {
    onError(error);
  }

  if (showAlert) {
    showErrorAlert(finalMessage, alertTitle);
  }

  return finalMessage;
}

/**
 * Safe wrapper for async functions
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  context: string = 'Unknown operation',
  options: ErrorHandlingOptions = {}
): Promise<T | null> {
  try {
    return await asyncFn();
  } catch (error) {
    handleAsyncError(error, context, options);
    return null;
  }
}

/**
 * Type-safe error handler
 */
export function tryCatch<T>(
  fn: () => T,
  onError?: (error: Error) => void
): T | null {
  try {
    return fn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);
    if (__DEV__) console.error(err);
    return null;
  }
}

/**
 * Wrap promise with timeout protection
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(TIMEOUT_ERROR_MESSAGE)), timeoutMs)
    ),
  ]);
}

/**
 * Retry logic with exponential backoff
 */
export async function withRetry<T>(
  asyncFn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        await new Promise(resolve =>
          setTimeout(resolve, delayMs * Math.pow(2, attempt - 1))
        );
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

/**
 * Handle mutation errors with user feedback
 */
export function handleMutationError(
  error: unknown,
  operationName: string,
  options: Omit<ErrorHandlingOptions, 'isCritical'> & { isCritical?: boolean } = {}
): void {
  const message = extractErrorMessage(error);

  if (__DEV__) {
    console.error(`[Mutation:${operationName}]`, error);
  }

  if (options.showAlert !== false) {
    showErrorAlert(
      message,
      options.alertTitle || 'Operation Failed'
    );
  }

  options.onError?.((error as Error) || new Error(message));
}
