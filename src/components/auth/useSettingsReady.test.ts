import { renderHook } from '@testing-library/react-native';

jest.mock('../../lib/queryCache', () => ({
  useCachedQuery: jest.fn(),
}));

import { useCachedQuery } from '../../lib/queryCache';
import { canQuerySettings, useSettingsGate } from './useSettingsReady';

const mockCachedQuery = jest.mocked(useCachedQuery);

describe('canQuerySettings', () => {
  it('waits for Clerk, confirmed Convex auth, and cache hydration', () => {
    expect(
      canQuerySettings({
        isCacheHydrated: true,
        isConvexAuthenticated: false,
        isSignedIn: true,
      })
    ).toBe(false);
    expect(
      canQuerySettings({
        isCacheHydrated: false,
        isConvexAuthenticated: true,
        isSignedIn: true,
      })
    ).toBe(false);
    expect(
      canQuerySettings({
        isCacheHydrated: true,
        isConvexAuthenticated: true,
        isSignedIn: true,
      })
    ).toBe(true);
  });

  it('does not query for a signed-out user', () => {
    expect(
      canQuerySettings({
        isCacheHydrated: true,
        isConvexAuthenticated: true,
        isSignedIn: false,
      })
    ).toBe(false);
  });
});

describe('useSettingsGate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the server-controlled premium flag with readiness', () => {
    mockCachedQuery.mockReturnValue({
      hasPremium: true,
    } as ReturnType<typeof useCachedQuery>);

    const { result } = renderHook(() => useSettingsGate(true, true, true));

    expect(result.current).toEqual({ hasPremium: true, isReady: true });
  });

  it('stays unready until authenticated settings are available', () => {
    mockCachedQuery.mockReturnValue(undefined);

    const { result } = renderHook(() => useSettingsGate(true, true, true));

    expect(result.current).toEqual({ hasPremium: false, isReady: false });
  });
});
