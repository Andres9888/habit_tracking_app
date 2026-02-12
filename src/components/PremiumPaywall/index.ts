/**
 * PremiumPaywall - Unified premium paywall component
 *
 * Consolidates three separate paywall modals into one configurable component:
 * - variant="analytics"  → Full-screen blur overlay (was PremiumAnalyticsPaywall)
 * - variant="motivation" → Dark modal with glow CTA (was MotivationPaywall)
 * - variant="benefits"   → Page-sheet with detailed features (was PremiumBenefitsModal)
 *
 * @example
 * ```tsx
 * import { PremiumPaywall } from '@/components/PremiumPaywall';
 *
 * function AnalyticsScreen() {
 *   return (
 *     <PremiumPaywall
 *       variant="analytics"
 *       visible={showPaywall}
 *       onClose={() => setShowPaywall(false)}
 *       onStartTrial={handlePurchase}
 *     />
 *   );
 * }
 * ```
 */

export { PremiumPaywall, default } from './PremiumPaywall';
export type { PremiumPaywallProps } from './PremiumPaywall.types';
export type { PaywallVariant } from './PremiumPaywall.types';
