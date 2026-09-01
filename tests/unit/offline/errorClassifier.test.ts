/**
 * Error Classifier Tests
 */

import {
  classifyError,
  getDisplayMessage,
  isNetworkError,
  shouldRetry,
} from '~/lib/offline/errorClassifier';

describe('errorClassifier', () => {
  describe('classifyError', () => {
    it('classifies network errors', () => {
      expect(classifyError(new Error('Network error')).category).toBe(
        'network'
      );
      expect(classifyError(new Error('ECONNREFUSED')).category).toBe('network');
      expect(classifyError(new Error('offline')).category).toBe('network');
    });

    it('classifies timeout errors', () => {
      expect(classifyError(new Error('Request timeout')).category).toBe(
        'timeout'
      );
    });

    it('classifies server errors by status', () => {
      const error = new Error('Server Error') as Error & { status: number };
      error.status = 500;
      expect(classifyError(error).category).toBe('server');
    });

    it('classifies rate limit errors', () => {
      expect(classifyError(new Error('Rate limit exceeded')).category).toBe(
        'rateLimit'
      );
    });

    it('classifies auth errors', () => {
      expect(classifyError(new Error('Unauthorized')).category).toBe('auth');
      expect(classifyError(new Error('Unauthorized')).isRetryable).toBe(false);
    });

    it('classifies validation errors', () => {
      expect(classifyError(new Error('Validation failed')).category).toBe(
        'validation'
      );
      expect(classifyError(new Error('Validation failed')).isRetryable).toBe(
        false
      );
    });

    it('classifies not found errors', () => {
      expect(classifyError(new Error('Resource not found')).category).toBe(
        'notFound'
      );
    });

    it('classifies conflict errors', () => {
      expect(classifyError(new Error('Conflict detected')).category).toBe(
        'conflict'
      );
    });

    it('classifies unknown errors as retryable', () => {
      const result = classifyError(new Error('Something strange'));
      expect(result.category).toBe('unknown');
      expect(result.isRetryable).toBe(true);
    });

    it('handles non-Error objects', () => {
      expect(classifyError('string error').category).toBe('unknown');
      expect(classifyError(null).category).toBe('unknown');
    });

    it('extracts status codes from various locations', () => {
      const withStatus = new Error('Error') as Error & { status: number };
      withStatus.status = 500;
      expect(classifyError(withStatus).statusCode).toBe(500);

      const withResponse = new Error('Error') as Error & {
        response: { status: number };
      };
      withResponse.response = { status: 401 };
      expect(classifyError(withResponse).statusCode).toBe(401);

      expect(classifyError(new Error('HTTP 500 Error')).statusCode).toBe(500);
    });
  });

  describe('isNetworkError', () => {
    it('returns true for network errors', () => {
      expect(isNetworkError(new Error('Network error'))).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(isNetworkError(new Error('Validation failed'))).toBe(false);
    });
  });

  describe('shouldRetry', () => {
    it('returns true for retryable errors', () => {
      expect(shouldRetry(new Error('Network error'))).toBe(true);
      expect(shouldRetry(new Error('Timeout'))).toBe(true);
    });

    it('returns false for non-retryable errors', () => {
      expect(shouldRetry(new Error('Unauthorized'))).toBe(false);
      expect(shouldRetry(new Error('Not found'))).toBe(false);
    });
  });

  describe('getDisplayMessage', () => {
    it('returns user-friendly messages', () => {
      expect(getDisplayMessage(new Error('Network error'))).toContain(
        'internet'
      );
      expect(getDisplayMessage(new Error('Timeout'))).toContain('retry');
      expect(getDisplayMessage(new Error('Unauthorized'))).toContain('sign in');
    });
  });
});
