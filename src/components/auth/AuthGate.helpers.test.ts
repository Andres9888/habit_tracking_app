import { shouldShowLoadingScreen } from './AuthGate.helpers';

const readyState = {
  isCacheHydrated: true,
  isLoaded: true,
  isSettingsReady: true,
  isSignedIn: true,
  onboardingComplete: true,
};

describe('shouldShowLoadingScreen', () => {
  it('does not keep startup waiting after settings are ready', () => {
    expect(shouldShowLoadingScreen(readyState)).toBe(false);
  });

  it('continues to protect Clerk, cache, onboarding, and settings readiness', () => {
    expect(
      shouldShowLoadingScreen({ ...readyState, isSettingsReady: false })
    ).toBe(true);
    expect(
      shouldShowLoadingScreen({ ...readyState, isCacheHydrated: false })
    ).toBe(true);
    expect(
      shouldShowLoadingScreen({ ...readyState, onboardingComplete: null })
    ).toBe(true);
  });
});
