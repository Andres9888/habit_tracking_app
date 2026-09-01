import { FEATURE_FLAGS } from '../../constants/featureFlags';

export type AuthDestination =
  | 'loading'
  | 'welcome'
  | 'onboarding'
  | 'paywall'
  | 'app';

export type AuthScreenKey = Exclude<AuthDestination, 'loading'>;

export interface AuthRoutingState {
  hasEntitlement: boolean;
  isAuthLoaded: boolean;
  isCacheHydrated: boolean;
  isPaywallDismissed: boolean;
  isSettingsReady: boolean;
  isSignedIn: boolean | undefined;
  onboardingComplete: boolean | null;
}

export interface AuthRoutingFeatures {
  onboardingEnabled: boolean;
  paywallEnabled: boolean;
}

const configuredFeatures: AuthRoutingFeatures = {
  onboardingEnabled: FEATURE_FLAGS.ONBOARDING_V2_ENABLED,
  paywallEnabled: FEATURE_FLAGS.PAYWALL_ENABLED,
};

function isBootstrapPending(state: AuthRoutingState): boolean {
  return !state.isAuthLoaded || !state.isCacheHydrated;
}

function shouldEnterOnboarding(
  state: AuthRoutingState,
  features: AuthRoutingFeatures
): boolean {
  return features.onboardingEnabled && !state.onboardingComplete;
}

export function resolveAuthDestination(
  state: AuthRoutingState,
  features: AuthRoutingFeatures = configuredFeatures
): AuthDestination {
  if (isBootstrapPending(state)) return 'loading';
  if (state.isSignedIn !== true) return 'welcome';
  if (state.onboardingComplete === null) return 'loading';
  if (shouldEnterOnboarding(state, features)) return 'onboarding';
  if (!features.paywallEnabled) return 'app';
  if (!state.isSettingsReady) return 'loading';
  if (state.hasEntitlement) return 'app';
  if (state.isPaywallDismissed) return 'app';
  return 'paywall';
}
