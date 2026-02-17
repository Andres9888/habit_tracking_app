/**
 * Lightweight A/B Testing Framework
 *
 * Assigns users to experiment variants deterministically (sticky via AsyncStorage).
 * Tracks experiment analytics events through the existing logInteraction pipeline.
 *
 * Usage:
 *   const variant = await getVariant('paywall_screen');
 *   if (variant === 'B') { // social proof paywall }
 *   if (variant === 'C') { // fear-of-loss paywall }
 *
 * Sourced from PR #981 (feat/onboarding-ab-test).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { logInteraction } from '@/lib/analytics/interactions';

// ─── Types ───────────────────────────────────────────────────────────

export type VariantId = string; // e.g. 'A', 'B', 'C'

export interface ExperimentConfig {
  /** Unique experiment identifier */
  id: string;
  /** Ordered list of variant ids — first is control */
  variants: [VariantId, ...VariantId[]];
  /** Weight per variant (must sum to 1). Defaults to equal split. */
  weights?: number[];
  /** When false, all users get variant A (control). Default true. */
  enabled: boolean;
}

// ─── Experiment Registry ─────────────────────────────────────────────

export const experiments: Record<string, ExperimentConfig> = {
  onboarding_flow: {
    enabled: true,
    id: 'onboarding_flow',
    variants: ['A', 'B'],
    weights: [0.5, 0.5],
  },
  /**
   * paywall_screen — Tests 3 paywall messaging variants.
   *
   * A (control)  — Current RevenueCat-managed paywall design
   * B (social)   — Social proof: "10,000+ chains built" + testimonials
   * C (urgency)  — Fear-of-loss: "Your X-day streak is at risk without Premium"
   */
  paywall_screen: {
    enabled: true,
    id: 'paywall_screen',
    variants: ['A', 'B', 'C'],
    weights: [0.34, 0.33, 0.33],
  },
} as const;

// ─── Storage helpers ─────────────────────────────────────────────────

const STORAGE_PREFIX = '@abtest_';

function storageKey(experimentId: string): string {
  return `${STORAGE_PREFIX}${experimentId}`;
}

// ─── Core API ────────────────────────────────────────────────────────

/**
 * Get (or assign) the current user's variant for an experiment.
 * Assignment is sticky — once set it never changes for that experiment id.
 */
export async function getVariant(experimentId: string): Promise<VariantId> {
  const config = experiments[experimentId];
  if (!config || !config.enabled) {
    return 'A'; // default to control when experiment is unknown or disabled
  }

  // Check for existing assignment
  try {
    const stored = await AsyncStorage.getItem(storageKey(experimentId));
    if (stored && config.variants.includes(stored)) {
      return stored;
    }
  } catch {
    // storage read failed — fall through to assignment
  }

  // Assign a new variant
  const variant = pickVariant(config);

  try {
    await AsyncStorage.setItem(storageKey(experimentId), variant);
  } catch {
    // persist failed — still return the variant for this session
    if (__DEV__) {
      console.warn(`[abTest] Failed to persist variant for ${experimentId}`);
    }
  }

  trackEvent('variant_assigned', experimentId, variant);
  return variant;
}

/**
 * Weighted random variant selection.
 */
function pickVariant(config: ExperimentConfig): VariantId {
  const { variants, weights } = config;

  if (!weights || weights.length !== variants.length) {
    // equal split
    return variants[Math.floor(Math.random() * variants.length)];
  }

  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < variants.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      return variants[i];
    }
  }
  return variants[variants.length - 1];
}

// ─── Analytics ───────────────────────────────────────────────────────

/**
 * Track an A/B test analytics event.
 */
export function trackEvent(
  event:
    | 'variant_assigned'
    | 'onboarding_completed'
    | 'first_habit_created'
    | 'paywall_viewed'
    | 'paywall_converted'
    | 'paywall_dismissed',
  experimentId: string,
  variant: VariantId,
  extra?: Record<string, unknown>
): void {
  logInteraction(`ab_${event}`, {
    experiment: experimentId,
    variant,
    ...extra,
  });
}

// ─── Utilities ───────────────────────────────────────────────────────

/**
 * Reset a single experiment assignment (useful for testing).
 */
export async function resetExperiment(experimentId: string): Promise<void> {
  await AsyncStorage.removeItem(storageKey(experimentId));
}

/**
 * Reset all experiment assignments.
 */
export async function resetAllExperiments(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const abKeys = keys.filter((k) => k.startsWith(STORAGE_PREFIX));
  if (abKeys.length > 0) {
    await AsyncStorage.multiRemove(abKeys);
  }
}

/**
 * React hook-friendly: synchronous check if a variant has been loaded.
 * Use with useEffect + getVariant for the actual value.
 */
export function isExperimentEnabled(experimentId: string): boolean {
  return !!experiments[experimentId]?.enabled;
}
