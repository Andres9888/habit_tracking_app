/**
 * The font gate must not block the providers.
 *
 * AppProviders owns Clerk session restore, the Convex auth/socket handshake
 * and query-cache hydration; gating it on the Literata load (up to 2.5s)
 * serialized all of that behind a font. Only the content is gated now.
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';

import App from '../../App';
import { useStartupReady } from '../useStartupReady';

jest.mock('../initializeAppMonitoring', () => ({
  initializeAppMonitoring: jest.fn(),
}));

jest.mock('../useStartupReady', () => ({ useStartupReady: jest.fn() }));

jest.mock('../AppProviders', () => {
  const { View: MockView } = require('react-native');
  return {
    AppProviders: ({ children }: { children: React.ReactNode }) => (
      <MockView testID="app-providers">{children}</MockView>
    ),
  };
});

jest.mock('../../components/auth/AuthGate', () => {
  const { Text: MockText } = require('react-native');
  return { AuthGate: () => <MockText>auth-gate</MockText> };
});

const mockUseStartupReady = useStartupReady as jest.Mock;

describe('App', () => {
  afterEach(() => jest.clearAllMocks());

  it('mounts the providers while the fonts are still loading', () => {
    mockUseStartupReady.mockReturnValue(false);

    render(<App />);

    expect(screen.getByTestId('app-providers')).toBeTruthy();
    expect(screen.queryByText('auth-gate')).toBeNull();
  });

  it('renders the content once startup is ready', () => {
    mockUseStartupReady.mockReturnValue(true);

    render(<App />);

    expect(screen.getByTestId('app-providers')).toBeTruthy();
    expect(screen.getByText('auth-gate')).toBeTruthy();
  });
});
