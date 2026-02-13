/**
 * Premium UI Components for Motivation System
 *
 * This module provides all components needed for premium feature gating,
 * upsell flows, and paywall integration in the Motivation System.
 *
 * Components:
 * - PremiumFeatureLock: Visual lock indicator (inline, overlay, card variants)
 * - FeatureLimitBadge: Shows free tier usage (e.g., "1/2 Free")
 * - PremiumPaywall: Unified paywall (variant="motivation"|"benefits"|"analytics")
 *
 * Usage:
 * ```tsx
 * import { PremiumPaywall, usePremiumUpsell } from '@/components/MotivationSystem/Premium';
 *
 * <PremiumPaywall variant="motivation" visible={show} onClose={close} onStartTrial={buy} />
 * ```
 *
 * @see motivation-system-spec.md - Premium Tier section
 */

export {
  PremiumFeatureLock,
  FeatureLimitBadge,
  type MotivationPremiumFeature,
} from './PremiumFeatureLock';

export { PremiumPaywall } from '../../PremiumPaywall';
export type { PremiumPaywallProps, PaywallVariant } from '../../PremiumPaywall';

/**
 * @deprecated Use `<PremiumPaywall variant="benefits" />` instead
 */
export { PremiumPaywall as PremiumBenefitsModal } from '../../PremiumPaywall';

/**
 * @deprecated Use `<PremiumPaywall variant="motivation" />` instead
 */
export { PremiumPaywall as MotivationPaywall } from '../../PremiumPaywall';

export { usePremiumUpsell } from './usePremiumUpsell';
