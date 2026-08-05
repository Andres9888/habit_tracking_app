/**
 * Regression guard for the instant library open.
 *
 * useWarmTemplatesCache warms templates.list after the habits screen settles,
 * so the normal modal open resolves from cache. The catalog must render on the
 * FIRST commit when that cache is warm — no extra deferred-mount frame.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import { queryCacheStore } from '../../../lib/queryCache/store/state';
import TemplatesScreen from '../TemplatesScreen';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: () => jest.fn(),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

const mockUseQuery = useQuery as jest.Mock;

const template = {
  _id: 'template-1',
  _creationTime: 0,
  category: 'health',
  description: 'Walk after lunch.',
  name: 'Daily walk',
};

describe('TemplatesScreen instant open', () => {
  afterEach(() => {
    jest.clearAllMocks();
    // The in-memory cache is module-level; without this the warm test's data
    // leaks into the cold test via the latest-value fallback.
    queryCacheStore.reset();
  });

  it('renders the catalog on the first commit when the cache is warm', () => {
    // Every cached query resolves synchronously, as it does after warming.
    mockUseQuery.mockImplementation(() => [template]);

    render(<TemplatesScreen />);

    // No intermediate frame: the catalog is present in the initial render.
    expect(screen.getByTestId('templates-catalog-view')).toBeTruthy();
    expect(screen.queryByTestId('templates-search-bar')).toBeTruthy();
  });

  it('falls back to the placeholder only when the cache is cold', () => {
    mockUseQuery.mockImplementation(() => undefined);

    render(<TemplatesScreen />);

    expect(screen.queryByTestId('templates-catalog-view')).toBeNull();
    // The placeholder keeps the real chrome so nothing pops in on data arrival.
    expect(screen.getByText('Habit library')).toBeTruthy();
  });

  it('does not paint cards before imported ids can determine their placement', () => {
    mockUseQuery
      .mockReturnValueOnce([template])
      .mockReturnValueOnce([])
      .mockReturnValueOnce({ hasPremium: false })
      .mockReturnValueOnce(undefined);

    render(<TemplatesScreen />);

    expect(screen.queryByTestId('templates-catalog-view')).toBeNull();
    expect(screen.getByText('Habit library')).toBeTruthy();
  });
});
