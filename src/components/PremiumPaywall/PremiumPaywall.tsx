/**
 * PremiumPaywall - Unified premium paywall component
 *
 * Consolidates three separate paywall modals into one configurable component:
 * - variant="analytics"  → Full-screen blur overlay (was PremiumAnalyticsPaywall)
 * - variant="motivation" → Dark modal with glow CTA (was MotivationPaywall)
 * - variant="benefits"   → Page-sheet with detailed features (was PremiumBenefitsModal)
 */

import React from 'react';
import type { PremiumPaywallProps } from './PremiumPaywall.types';
import { AnalyticsVariant } from './components/AnalyticsVariant';
import { MotivationVariant } from './components/MotivationVariant';
import { BenefitsVariant } from './components/BenefitsVariant';

export function PremiumPaywall({ variant, ...props }: PremiumPaywallProps) {
  switch (variant) {
    case 'analytics':
      return <AnalyticsVariant {...props} />;
    case 'motivation':
      return <MotivationVariant {...props} />;
    case 'benefits':
      return <BenefitsVariant {...props} />;
    default:
      return null;
  }
}

export default PremiumPaywall;
