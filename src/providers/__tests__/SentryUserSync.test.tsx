/**
 * SentryUserSync Provider Tests
 *
 * Verifies that only the opaque user ID is forwarded to Sentry,
 * and that PII (email, username) is never included.
 */

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SentryUserSync } from '../SentryUserSync';

const mockUseSentryUser = jest.fn();

jest.mock('../../lib/sentry', () => ({
  useSentryUser: (...args: unknown[]) => mockUseSentryUser(...args),
}));

const mockUseUser = jest.fn();
jest.mock('@clerk/clerk-expo', () => ({
  useUser: () => mockUseUser(),
}));

describe('SentryUserSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes only id when user is signed in', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: {
        id: 'user_123',
        primaryEmailAddress: { emailAddress: 'secret@example.com' },
        username: 'secretname',
      },
    });

    render(
      <SentryUserSync>
        <Text>child</Text>
      </SentryUserSync>
    );

    expect(mockUseSentryUser).toHaveBeenCalledWith({ id: 'user_123' });
  });

  it('does not include email in Sentry user context', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: {
        id: 'user_456',
        primaryEmailAddress: { emailAddress: 'pii@test.com' },
        username: 'myname',
      },
    });

    render(
      <SentryUserSync>
        <Text>child</Text>
      </SentryUserSync>
    );

    const sentryPayload = mockUseSentryUser.mock.calls[0][0];
    expect(sentryPayload).not.toHaveProperty('email');
    expect(sentryPayload).not.toHaveProperty('username');
  });

  it('passes null when user is not signed in', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: false,
      user: null,
    });

    render(
      <SentryUserSync>
        <Text>child</Text>
      </SentryUserSync>
    );

    expect(mockUseSentryUser).toHaveBeenCalledWith(null);
  });

  it('renders children unchanged', () => {
    mockUseUser.mockReturnValue({ isSignedIn: false, user: null });

    const { getByText } = render(
      <SentryUserSync>
        <Text>Hello World</Text>
      </SentryUserSync>
    );

    expect(getByText('Hello World')).toBeTruthy();
  });
});
