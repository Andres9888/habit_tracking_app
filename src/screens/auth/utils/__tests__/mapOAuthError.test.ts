import { mapOAuthError, MappedError } from '../mapOAuthError';

describe('mapOAuthError', () => {
  describe('cancellation errors', () => {
    it('maps oauth_access_denied as cancellation', () => {
      const error = { errors: [{ code: 'oauth_access_denied' }] };
      const result = mapOAuthError(error);

      expect(result.isCancellation).toBe(true);
      expect(result.shouldRedirect).toBe(false);
      expect(result.code).toBe('oauth_access_denied');
      expect(result.message).toBe('Sign in was cancelled.');
    });

    it('maps user_cancelled as cancellation', () => {
      const error = { errors: [{ code: 'user_cancelled' }] };
      const result = mapOAuthError(error);

      expect(result.isCancellation).toBe(true);
      expect(result.code).toBe('user_cancelled');
    });
  });

  describe('redirect errors', () => {
    it('maps identifier_already_signed_in for redirect', () => {
      const error = { errors: [{ code: 'identifier_already_signed_in' }] };
      const result = mapOAuthError(error);

      expect(result.shouldRedirect).toBe(true);
      expect(result.isCancellation).toBe(false);
      expect(result.message).toBe('You are already signed in.');
    });

    it('maps session_exists for redirect', () => {
      const error = { errors: [{ code: 'session_exists' }] };
      const result = mapOAuthError(error);

      expect(result.shouldRedirect).toBe(true);
      expect(result.message).toBe('You already have an active session.');
    });
  });

  describe('provider errors', () => {
    it('maps external_account_not_found to user-friendly message', () => {
      const error = { errors: [{ code: 'external_account_not_found' }] };
      const result = mapOAuthError(error);

      expect(result.message).toBe(
        'Unable to verify your account. Please try again.'
      );
      expect(result.isCancellation).toBe(false);
      expect(result.shouldRedirect).toBe(false);
    });

    it('maps external_account_exists with account linking message', () => {
      const error = { errors: [{ code: 'external_account_exists' }] };
      const result = mapOAuthError(error);

      expect(result.message).toContain('already linked to another user');
    });

    it('maps email_address_not_found with alternative suggestion', () => {
      const error = { errors: [{ code: 'email_address_not_found' }] };
      const result = mapOAuthError(error);

      expect(result.message).toContain("couldn't retrieve your email");
      expect(result.message).toContain('different sign-in method');
    });
  });

  describe('network errors', () => {
    it('detects network error from TypeError', () => {
      const error = new TypeError('network request failed');
      const result = mapOAuthError(error);

      expect(result.code).toBe('network_error');
      expect(result.message).toBe(
        'Please check your internet connection and try again.'
      );
    });

    it('detects network error from message containing "fetch"', () => {
      const error = { message: 'Failed to fetch' };
      const result = mapOAuthError(error);

      expect(result.code).toBe('network_error');
    });

    it('detects network error from connection message', () => {
      const error = { message: 'Connection refused' };
      const result = mapOAuthError(error);

      expect(result.code).toBe('network_error');
    });
  });

  describe('unknown errors', () => {
    it('handles unknown error codes with fallback message', () => {
      const error = { errors: [{ code: 'some_unknown_code' }] };
      const result = mapOAuthError(error);

      expect(result.code).toBe('some_unknown_code');
      expect(result.message).toBe('Failed to sign in. Please try again.');
    });

    it('handles error without code using Clerk message', () => {
      const error = { errors: [{ message: 'Custom Clerk message' }] };
      const result = mapOAuthError(error);

      expect(result.message).toBe('Custom Clerk message');
    });

    it('handles completely unknown error shape', () => {
      const error = 'just a string';
      const result = mapOAuthError(error);

      expect(result.code).toBe('unknown');
      expect(result.message).toBe('Failed to sign in. Please try again.');
      expect(result.isCancellation).toBe(false);
      expect(result.shouldRedirect).toBe(false);
    });

    it('handles null/undefined errors', () => {
      expect(mapOAuthError(null).code).toBe('unknown');
      expect(mapOAuthError(undefined).code).toBe('unknown');
    });
  });

  describe('error object extraction', () => {
    it('extracts error from Clerk errors array', () => {
      const error = {
        errors: [
          { code: 'oauth_access_denied', message: 'Access denied' },
          { code: 'another_error' },
        ],
      };
      const result = mapOAuthError(error);

      // Should use first error in array
      expect(result.code).toBe('oauth_access_denied');
    });

    it('extracts error from direct code property', () => {
      const error = { code: 'oauth_access_denied', message: 'Direct error' };
      const result = mapOAuthError(error);

      expect(result.code).toBe('oauth_access_denied');
    });

    it('handles empty errors array', () => {
      const error = { errors: [] };
      const result = mapOAuthError(error);

      expect(result.code).toBe('unknown');
    });
  });

  describe('return type shape', () => {
    it('always returns all required fields', () => {
      const result = mapOAuthError({});

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('isCancellation');
      expect(result).toHaveProperty('shouldRedirect');
      expect(result).toHaveProperty('code');
      expect(typeof result.message).toBe('string');
      expect(typeof result.isCancellation).toBe('boolean');
      expect(typeof result.shouldRedirect).toBe('boolean');
      expect(typeof result.code).toBe('string');
    });
  });
});
