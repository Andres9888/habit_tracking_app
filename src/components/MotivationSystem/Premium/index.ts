/**
 * Premium UI Components for Motivation System
 *
 * Components:
 * - PremiumFeatureLock: Visual lock indicator (inline, overlay, card variants)
 * - FeatureLimitBadge: Shows free tier usage (e.g., "1/2 Free")
 * - PremiumPaywall: Unified paywall (use variant="motivation"|"benefits"|"analytics")
 *
 * Usage:
 * ```tsx
 * import {
 *   PremiumFeatureLock,
 *   FeatureLimitBadge,
 *   PremiumPaywall,
 *   usePremiumUpsell,
 * } from '@/components/MotivationSystem/Premium';
 *
 * <PremiumPaywall
 *   variant="motivation"
 *   visible={showPaywall}
 *   onClose={() => setShowPaywall(false)}
 *   onStartTrial={handlePurchase}
 *   triggeredByFeature={triggeredFeature}
 * />
 * ```
 */

export {
  PremiumFeatureLock,
  FeatureLimitBadge,
  type MotivationPremiumFeature,
} from './PremiumFeatureLock';

// Unified paywall — backward-compatible aliases
export { PremiumPaywall } from '../../PremiumPaywall';
export { PremiumPaywall as MotivationPaywall } from '../../PremiumPaywall';
export { PremiumPaywall as PremiumBenefitsModal } from '../../PremiumPaywall';

export { usePremiumUpsell } from './usePremiumUpsell';
