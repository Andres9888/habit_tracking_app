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
