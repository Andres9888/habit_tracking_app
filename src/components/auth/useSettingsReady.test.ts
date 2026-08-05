import { canQuerySettings } from './useSettingsReady';

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
