/**
 * Premium UI Components for Motivation System
 *
 * Components:
 * - PremiumFeatureLock: Visual lock indicator (inline, overlay, card variants)
 * - FeatureLimitBadge: Shows free tier usage (e.g., "1/2 Free")
 *
 * @see motivation-system-spec.md - Premium Tier section
 */

export {
  PremiumFeatureLock,
  FeatureLimitBadge,
  type MotivationPremiumFeature,
} from './PremiumFeatureLock';

export { usePremiumUpsell } from './usePremiumUpsell';
