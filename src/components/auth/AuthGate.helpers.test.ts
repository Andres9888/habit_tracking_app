import { getScreenKey, shouldShowLoadingScreen } from './AuthGate.helpers';

const readyState = {
  isCacheHydrated: true,
  isLoaded: true,
  isSettingsReady: true,
  isSignedIn: true,
  onboardingComplete: true,
} as const;

describe('AuthGate helpers', () => {
  it('waits for the cached settings entitlement, not a billing SDK request', () => {
    expect(shouldShowLoadingScreen(readyState)).toBe(false);
    expect(
      shouldShowLoadingScreen({ ...readyState, isSettingsReady: false })
    ).toBe(true);
  });

  it('does not wait for authenticated data when signed out', () => {
    expect(
      shouldShowLoadingScreen({
        ...readyState,
        isSignedIn: false,
        onboardingComplete: null,
      })
    ).toBe(false);
    expect(getScreenKey(false, false, false)).toBe('welcome');
  });
});
