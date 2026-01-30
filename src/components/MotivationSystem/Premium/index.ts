/**
 * Premium UI Components for Motivation System
 *
 * This module provides all components needed for premium feature gating,
 * upsell flows, and paywall integration in the Motivation System.
 *
 * Components:
 * - PremiumFeatureLock: Visual lock indicator (inline, overlay, card variants)
 * - FeatureLimitBadge: Shows free tier usage (e.g., "1/2 Free")
 * - PremiumBenefitsModal: Educates users on premium value
 * - MotivationPaywall: Full-screen purchase flow
 *
 * Usage:
 * ```tsx
 * import {
 *   PremiumFeatureLock,
 *   FeatureLimitBadge,
 *   PremiumBenefitsModal,
 *   MotivationPaywall,
 *   usePremiumUpsell,
 * } from '@/components/MotivationSystem/Premium';
 *
 * function MyComponent({ isPremium }) {
 *   const { showPaywall, setShowPaywall, triggeredFeature, triggerPaywall } =
 *     usePremiumUpsell();
 *
 *   return (
 *     <>
 *       <VoiceNotesSection
 *         isPremium={isPremium}
 *         onPremiumRequired={() => triggerPaywall('voiceNotes')}
 *       />
 *       <MotivationPaywall
 *         visible={showPaywall}
 *         onClose={() => setShowPaywall(false)}
 *         onStartTrial={handlePurchase}
 *         triggeredByFeature={triggeredFeature}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @see motivation-system-spec.md - Premium Tier section
 */

export {
  PremiumFeatureLock,
  FeatureLimitBadge,
  type MotivationPremiumFeature,
} from './PremiumFeatureLock';

export { PremiumBenefitsModal } from './PremiumBenefitsModal';

export { MotivationPaywall } from './MotivationPaywall';

export { usePremiumUpsell } from './usePremiumUpsell';
