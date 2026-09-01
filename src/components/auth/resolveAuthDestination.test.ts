import {
  resolveAuthDestination,
  type AuthRoutingFeatures,
  type AuthRoutingState,
} from './resolveAuthDestination';

const allFeatures: AuthRoutingFeatures = {
  onboardingEnabled: true,
  paywallEnabled: true,
};

const readyState: AuthRoutingState = {
  hasEntitlement: true,
  isAuthLoaded: true,
  isCacheHydrated: true,
  isPaywallDismissed: false,
  isSettingsReady: true,
  isSignedIn: true,
  onboardingComplete: true,
};

describe('resolveAuthDestination', () => {
  it('waits for the auth provider and local cache', () => {
    expect(
      resolveAuthDestination(
        { ...readyState, isAuthLoaded: false },
        allFeatures
      )
    ).toBe('loading');
    expect(
      resolveAuthDestination(
        { ...readyState, isCacheHydrated: false },
        allFeatures
      )
    ).toBe('loading');
  });

  it('routes signed-out users without waiting for authenticated data', () => {
    expect(
      resolveAuthDestination(
        {
          ...readyState,
          isSettingsReady: false,
          isSignedIn: false,
          onboardingComplete: null,
        },
        allFeatures
      )
    ).toBe('welcome');
  });

  it('resolves onboarding before startup settings', () => {
    expect(
      resolveAuthDestination(
        {
          ...readyState,
          isSettingsReady: false,
          onboardingComplete: false,
        },
        allFeatures
      )
    ).toBe('onboarding');
  });

  it('waits for onboarding status and final-screen settings', () => {
    expect(
      resolveAuthDestination(
        { ...readyState, onboardingComplete: null },
        allFeatures
      )
    ).toBe('loading');
    expect(
      resolveAuthDestination(
        { ...readyState, isSettingsReady: false },
        allFeatures
      )
    ).toBe('loading');
  });

  it('routes entitled and dismissed users past the paywall', () => {
    expect(resolveAuthDestination(readyState, allFeatures)).toBe('app');
    expect(
      resolveAuthDestination(
        {
          ...readyState,
          hasEntitlement: false,
          isPaywallDismissed: true,
        },
        allFeatures
      )
    ).toBe('app');
  });

  it('shows the paywall only when enabled and access is absent', () => {
    const noAccess = { ...readyState, hasEntitlement: false };
    expect(resolveAuthDestination(noAccess, allFeatures)).toBe('paywall');
    expect(
      resolveAuthDestination(
        { ...noAccess, isSettingsReady: false },
        {
          ...allFeatures,
          paywallEnabled: false,
        }
      )
    ).toBe('app');
  });
});
