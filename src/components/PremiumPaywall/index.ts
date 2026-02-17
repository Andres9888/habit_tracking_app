/**
 * PremiumPaywall - Unified premium paywall component
 *
 * Replaces: MotivationPaywall, PremiumBenefitsModal, PremiumAnalyticsPaywall
 *
 * @example
 * ```tsx
 * <PremiumPaywall variant="motivation" visible={show} onClose={close} onStartTrial={buy} />
 * <PremiumPaywall variant="benefits" visible={show} onClose={close} onStartTrial={buy} />
 * <PremiumPaywall variant="analytics" visible={show} onClose={close} onStartTrial={buy} />
 * ```
 */

export { PremiumPaywall, default } from './PremiumPaywall';
export type {
  PremiumPaywallProps,
  PaywallVariant,
} from './PremiumPaywall.types';

// ── A/B Test exports ──────────────────────────────────────────────────
export { PaywallABTest } from './PaywallABTest';
export type { PaywallABTestProps } from './PaywallABTest';
export { PaywallVariantB } from './PaywallVariantB';
export { PaywallVariantC } from './PaywallVariantC';
export { usePaywallExperiment, PAYWALL_EXPERIMENT_ID } from './usePaywallExperiment';
export type { PaywallABVariant, PaywallExperiment } from './usePaywallExperiment';
