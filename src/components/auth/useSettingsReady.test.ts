import { canQuerySettings, isStartupSettingsReady } from './useSettingsReady';

describe('isStartupSettingsReady', () => {
  it('is ready on cached settings even when Convex auth never confirms', () => {
    expect(
      isStartupSettingsReady({ isSignedIn: true, settings: { hasPremium: true } })
    ).toBe(true);
  });

  it('keeps waiting while signed in with no settings from any source', () => {
    expect(isStartupSettingsReady({ isSignedIn: true, settings: undefined })).toBe(
      false
    );
  });

  it('never blocks a signed-out user', () => {
    expect(
      isStartupSettingsReady({ isSignedIn: false, settings: undefined })
    ).toBe(true);
  });
});

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
