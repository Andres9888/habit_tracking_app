/**
 * API Error Types (SEC-002: Error Handling & Information Disclosure Prevention)
 */

export interface ApiError {
  code: string;
  message: string;
  statusCode?: number;
  originalError?: Error;
  isUserError: boolean; // true = validation/expected, false = system/server error
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
