/**
 * Sentry PII Guard Tests
 *
 * Verifies that email and username are never sent to Sentry,
 * ensuring GDPR/CCPA compliance.
 */

import * as Sentry from '@sentry/react-native';
import { createSentryReporter } from '../reporter/sentryReporter';

// Mock Sentry initialized
jest.mock('../init', () => ({
  isSentryInitialized: jest.fn(() => true),
}));

jest.mock('@sentry/react-native', () => ({
  setUser: jest.fn(),
  setTag: jest.fn(),
}));

const mockSetUser = Sentry.setUser as jest.MockedFunction<typeof Sentry.setUser>;

describe('Sentry PII Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends only opaque id to Sentry.setUser', () => {
    const reporter = createSentryReporter();
    reporter.setUser({ id: 'user_abc123', isPremium: true });

    expect(mockSetUser).toHaveBeenCalledTimes(1);
    expect(mockSetUser).toHaveBeenCalledWith({ id: 'user_abc123' });
  });

  it('does not include email in Sentry.setUser payload', () => {
    const reporter = createSentryReporter();
    reporter.setUser({ id: 'user_abc123' });

    const payload = mockSetUser.mock.calls[0][0];
    expect(payload).not.toHaveProperty('email');
  });

  it('does not include username in Sentry.setUser payload', () => {
    const reporter = createSentryReporter();
    reporter.setUser({ id: 'user_abc123' });

    const payload = mockSetUser.mock.calls[0][0];
    expect(payload).not.toHaveProperty('username');
  });

  it('clears user with null on sign-out', () => {
    const reporter = createSentryReporter();
    reporter.setUser(null);

    expect(mockSetUser).toHaveBeenCalledWith(null);
  });

  it('sets user_premium tag for premium users', () => {
    const reporter = createSentryReporter();
    reporter.setUser({ id: 'user_abc123', isPremium: true });

    expect(Sentry.setTag).toHaveBeenCalledWith('user_premium', 'true');
  });

  it('sets user_premium tag to false for free users', () => {
    const reporter = createSentryReporter();
    reporter.setUser({ id: 'user_abc123', isPremium: false });

    expect(Sentry.setTag).toHaveBeenCalledWith('user_premium', 'false');
  });
});
