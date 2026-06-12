/**
 * Feature flags for in-progress work.
 * Flip a flag to true when the feature is ready to ship.
 */
export const FEATURE_FLAGS = {
  /** Chain Builder onboarding (v2). Disabled until the flow is finished. */
  ONBOARDING_V2_ENABLED: false,
  /** Auth-gate paywall. Disabled until subscription flow is ready. */
  PAYWALL_ENABLED: false,
} as const;
